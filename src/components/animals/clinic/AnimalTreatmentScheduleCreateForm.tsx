// path: frontend/src/components/animals/clinic/AnimalTreatmentScheduleCreateForm.tsx

"use client";

import { useMemo, useState } from "react";
import {
  createTreatmentSchedule,
  CreateTreatmentSchedulePayload,
} from "@/services/treatmentSchedules";

type Props = {
  treatmentPublicId: string;
  animalId: string; // ✅ existe, e vai ser útil depois
  onCreated(): Promise<void> | void;
};

type Mode = "COUNT" | "UNTIL";
type DosageUnit = "gotas" | "comprimido" | "mg" | "g" | "ml";

const MAX_COUNT = 365;

function normalizeTime(v: string): string {
  const t = (v || "").trim();
  if (/^\d{2}:\d{2}$/.test(t)) return t;
  return "08:00";
}

function toIsoStart(dateYmd: string): string {
  return new Date(`${dateYmd}T00:00:00`).toISOString();
}

function toIsoEnd(dateYmd: string): string {
  return new Date(`${dateYmd}T23:59:59`).toISOString();
}

function addDays(baseYmd: string, days: number): string {
  const d = new Date(`${baseYmd}T00:00:00`);
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function buildPreviewDates(
  startYmd: string,
  intervalInDays: number,
  mode: Mode,
  count: number,
  until: string
) {
  if (!startYmd || intervalInDays < 1) return { dates: [], endsAtYmd: "" };

  const endsAtYmd =
    mode === "COUNT"
      ? addDays(
        startYmd,
        (Math.max(1, Math.min(MAX_COUNT, count)) - 1) * intervalInDays
      )
      : until || "";

  const dates: string[] = [];
  const total =
    mode === "COUNT"
      ? Math.max(1, Math.min(MAX_COUNT, count))
      : 9999; // só pra limitar preview

  let current = startYmd;
  for (let i = 0; i < total && dates.length < 3; i++) {
    dates.push(current);
    current = addDays(current, intervalInDays);
    if (
      mode === "UNTIL" &&
      endsAtYmd &&
      new Date(current) > new Date(endsAtYmd)
    )
      break;
  }

  return { dates, endsAtYmd };
}

export function AnimalTreatmentScheduleCreateForm({
  treatmentPublicId,
  animalId,
  onCreated,
}: Props) {
  const [open, setOpen] = useState(false);

  const [startsAt, setStartsAt] = useState(""); // YYYY-MM-DD
  const [intervalInDays, setIntervalInDays] = useState(1);

  const [timesPerDay, setTimesPerDay] = useState(2);
  const [time1, setTime1] = useState("08:00");
  const [time2, setTime2] = useState("20:00");
  const [time3, setTime3] = useState("12:00");
  const [time4, setTime4] = useState("18:00");

  const [mode, setMode] = useState<Mode>("COUNT");
  const [count, setCount] = useState(7);
  const [until, setUntil] = useState("");

  const [medicationName, setMedicationName] = useState("");

  // 🔹 DOSAGEM
  const [dosageDescription, setDosageDescription] = useState("");
  const [dosageAmount, setDosageAmount] = useState<number | "">("");
  const [dosageUnit, setDosageUnit] = useState<DosageUnit>("gotas");
  const [pillMg, setPillMg] = useState<number | "">("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const times = useMemo(() => {
    const pool = [time1, time2, time3, time4].map(normalizeTime);
    const n = Math.max(1, Math.min(4, timesPerDay));
    return pool.slice(0, n);
  }, [time1, time2, time3, time4, timesPerDay]);

  const preview = useMemo(() => {
    return buildPreviewDates(startsAt, intervalInDays, mode, count, until);
  }, [startsAt, intervalInDays, mode, count, until]);

  function syncDosageString(
    amount: number | "",
    unit: DosageUnit,
    mg: number | ""
  ) {
    if (amount === "" || amount <= 0) {
      setDosageDescription("");
      return;
    }

    if (unit === "comprimido") {
      if (mg === "" || mg <= 0) {
        setDosageDescription("");
        return;
      }
      setDosageDescription(`${amount} comprimido (${mg} mg)`);
      return;
    }

    setDosageDescription(`${amount} ${unit}`);
  }

  async function submit() {
    setError(null);

    if (!startsAt) {
      setError("Data de início obrigatória.");
      return;
    }

    if (intervalInDays < 1) {
      setError("Intervalo em dias inválido.");
      return;
    }

    if (timesPerDay < 1 || timesPerDay > 4) {
      setError("Vezes por dia inválido (1 a 4).");
      return;
    }

    if (
      !Array.isArray(times) ||
      times.length !== Math.max(1, Math.min(4, timesPerDay))
    ) {
      setError("Horários inválidos.");
      return;
    }



    let endsAtYmd = "";

    if (mode === "COUNT") {
      if (count < 1 || count > MAX_COUNT) {
        setError(`Número de repetições inválido (1 a ${MAX_COUNT}).`);
        return;
      }
      endsAtYmd = addDays(startsAt, (count - 1) * intervalInDays);
    } else {
      if (!until) {
        setError("Data final obrigatória neste modo.");
        return;
      }
      if (new Date(until) < new Date(startsAt)) {
        setError("A data final deve ser posterior à data inicial.");
        return;
      }
      endsAtYmd = until;
    }

    function onlyNumber(
      value: string,
      allowDecimal = false
    ): string {
      const regex = allowDecimal
        ? /[^0-9.,]/g
        : /[^0-9]/g;

      return value.replace(regex, "").replace(",", ".");
    }

    const medicationNameValue =
  medicationName.trim() === "" ? null : medicationName.trim();

    const dosagePerUnit =
      dosageUnit === "comprimido" && pillMg !== "" && pillMg > 0
        ? String(pillMg)
        : null;

    const payloadBase: Omit<CreateTreatmentSchedulePayload, "interval_execution_time"> =
    {
      frequency_type: "interval_days",
      starts_at: toIsoStart(startsAt),
      ends_at: endsAtYmd ? toIsoEnd(endsAtYmd) : null,
      interval_in_days: intervalInDays,

      dosage_description: dosageDescription.trim() || null,
      dosage_amount:
        dosageAmount === "" || dosageAmount <= 0 ? null : String(dosageAmount),
      dosage_unit: dosageUnit || null,
      dosage_per_unit: dosagePerUnit,

      notes: notes.trim() || null,

      should_generate_agenda: true,
    };
    const finalDosageDescription =
      dosageAmount && dosageUnit
        ? dosageUnit === "comprimido"
          ? `${dosageAmount} comprimido (${pillMg} mg)`
          : `${dosageAmount} ${dosageUnit}`
        : null;
    try {
      setLoading(true);

      const isDailyTimes = timesPerDay > 1;

      if (isDailyTimes) {
        // === DAILY_TIMES ===
        await createTreatmentSchedule(treatmentPublicId, {
          frequency_type: "daily_times",

          starts_at: toIsoStart(startsAt),
          ends_at: endsAtYmd ? toIsoEnd(endsAtYmd) : null,

          daily_times_count: times.length,
          daily_times: times,

          medication_name: medicationNameValue,

          dosage_description: finalDosageDescription,
          dosage_amount:
            dosageAmount === "" || Number(dosageAmount) <= 0
              ? null
              : String(dosageAmount),
          dosage_unit: dosageUnit,
          dosage_per_unit:
            dosageUnit === "comprimido" ? String(pillMg) : null,
          notes: notes.trim() || null,

          should_generate_agenda: true,
        });
      } else {
        // === INTERVAL_DAYS ===
        await createTreatmentSchedule(treatmentPublicId, {
          frequency_type: "interval_days",

          starts_at: toIsoStart(startsAt),
          ends_at: endsAtYmd ? toIsoEnd(endsAtYmd) : null,

          interval_in_days: intervalInDays,
          interval_execution_time: times[0],

           medication_name: medicationNameValue,

          dosage_description: finalDosageDescription,
          dosage_amount:
            dosageAmount === "" || Number(dosageAmount) <= 0
              ? null
              : String(dosageAmount),
          dosage_unit: dosageUnit,
          dosage_per_unit:
            dosageUnit === "comprimido" ? String(pillMg) : null,
          notes: notes.trim() || null,

          should_generate_agenda: true,
        });
      }

      // === RESET FORM ===
      setStartsAt("");
      setIntervalInDays(1);
      setTimesPerDay(2);
      setTime1("08:00");
      setTime2("20:00");
      setTime3("12:00");
      setTime4("18:00");
      setMode("COUNT");
      setCount(7);
      setUntil("");
      setDosageDescription("");
      setDosageAmount("");
      setDosageUnit("gotas");
      setPillMg("");
      setNotes("");

      setOpen(false);
      await onCreated();
    } catch {
      setError("Erro ao criar agendamento do tratamento.");
    } finally {
      setLoading(false);
    }
  }
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-zinc-700 hover:underline"
      >
        + Adicionar medicação / procedimento
      </button>
    );
  }

  return (
    <div className="mt-2 rounded border bg-zinc-50 p-3 space-y-3">
      {error && <p className="text-xs text-red-600">{error}</p>}

      {/* Início / intervalo */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs text-zinc-600">Início</label>
          <input
            type="date"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className="w-full rounded border px-2 py-1 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-zinc-600">A cada (dias)</label>
          <input
            type="number"
            min={1}
            value={intervalInDays}
            onChange={(e) => setIntervalInDays(Number(e.target.value))}
            className="w-full rounded border px-2 py-1 text-sm"
          />
        </div>
      </div>
      {/* NOME MEDICAMENTO */}
      <input
        type="text"
        placeholder="Nome do medicamento (ex: Amoxicilina)"
        value={medicationName}
        onChange={(e) => setMedicationName(e.target.value)}
        className="w-full rounded border px-2 py-1 text-sm"
      />

      {/* DOSAGEM */}
      <div className="space-y-1">
        <label className="text-xs text-zinc-600">Dosagem</label>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            placeholder="Qtd"
            value={dosageAmount}
            onChange={(e) => {
              const v = e.target.value === "" ? "" : Number(e.target.value);
              setDosageAmount(v);
              syncDosageString(v, dosageUnit, pillMg);
            }}
            className="rounded border px-2 py-1 text-sm"
          />
          <select
            value={dosageUnit}
            onChange={(e) => {
              const u = e.target.value as DosageUnit;
              setDosageUnit(u);
              syncDosageString(dosageAmount, u, pillMg);
            }}
            className="rounded border px-2 py-1 text-sm"
          >
            <option value="gotas">gotas</option>
            <option value="comprimido">comprimido</option>
            <option value="mg">mg</option>
            <option value="g">g</option>
            <option value="ml">ml</option>
          </select>
          {dosageUnit === "comprimido" ? (
            <input
              type="number"
              placeholder="mg / comprimido"
              value={pillMg}
              onChange={(e) => {
                const m = e.target.value === "" ? "" : Number(e.target.value);
                setPillMg(m);
                syncDosageString(dosageAmount, dosageUnit, m);
              }}
              className="rounded border px-2 py-1 text-sm"
            />
          ) : (
            <div />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-600 w-28">Vezes por dia</label>
          <input
            type="number"
            min={1}
            max={4}
            value={timesPerDay}
            onChange={(e) => setTimesPerDay(Number(e.target.value))}
            className="w-20 rounded border px-2 py-1 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="time"
            value={time1}
            onChange={(e) => setTime1(e.target.value)}
            className="w-full rounded border px-2 py-1 text-sm"
          />
          <input
            type="time"
            value={time2}
            onChange={(e) => setTime2(e.target.value)}
            className="w-full rounded border px-2 py-1 text-sm"
            disabled={timesPerDay < 2}
          />
          <input
            type="time"
            value={time3}
            onChange={(e) => setTime3(e.target.value)}
            className="w-full rounded border px-2 py-1 text-sm"
            disabled={timesPerDay < 3}
          />
          <input
            type="time"
            value={time4}
            onChange={(e) => setTime4(e.target.value)}
            className="w-full rounded border px-2 py-1 text-sm"
            disabled={timesPerDay < 4}
          />
        </div>

        <p className="text-[11px] text-zinc-500">
          Nota: {timesPerDay}x/dia = {timesPerDay} schedules (cadeias
          independentes) → {timesPerDay} tarefas por dia de ocorrência.
        </p>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
            className="w-full rounded border px-2 py-1 text-sm"
          >
            <option value="COUNT">Nº repetições</option>
            <option value="UNTIL">Data final</option>
          </select>

          {mode === "COUNT" ? (
            <input
              type="number"
              min={1}
              max={MAX_COUNT}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full rounded border px-2 py-1 text-sm"
            />
          ) : (
            <input
              type="date"
              value={until}
              onChange={(e) => setUntil(e.target.value)}
              className="w-full rounded border px-2 py-1 text-sm"
            />
          )}
        </div>

        {startsAt && intervalInDays >= 1 && (
          <div className="text-xs bg-white border rounded px-3 py-2 space-y-1">
            <p className="font-medium text-zinc-800">Preview (datas)</p>

            {(() => {
              const total =
                mode === "COUNT"
                  ? Math.max(1, Math.min(MAX_COUNT, count))
                  : null;

              const allDates =
                mode === "COUNT"
                  ? Array.from({ length: total ?? 0 }).map((_, i) =>
                    addDays(startsAt, i * intervalInDays)
                  )
                  : preview.dates;

              const first = allDates.slice(0, 3);
              const last =
                mode === "COUNT" && allDates.length > 3
                  ? allDates[allDates.length - 1]
                  : null;

              return (
                <>
                  <ul className="list-disc pl-4 text-zinc-700 space-y-0.5">
                    {first.map((d) => (
                      <li key={d}>
                        {new Date(`${d}T00:00:00`).toLocaleDateString()} —
                        horários: {times.join(", ")}
                      </li>
                    ))}

                    {last && (
                      <li key={last} className="text-zinc-500">
                        … (mais {allDates.length - 4} ocorrências)
                      </li>
                    )}

                    {last && (
                      <li key={`${last}-final`} className="text-zinc-700">
                        {new Date(`${last}T00:00:00`).toLocaleDateString()} —
                        horários: {times.join(", ")}{" "}
                        <span className="text-zinc-500">(última)</span>
                      </li>
                    )}
                  </ul>

                  {mode === "COUNT" && (
                    <p className="text-zinc-500">
                      Total de ocorrências: {allDates.length}
                    </p>
                  )}

                  {preview.endsAtYmd && (
                    <p className="text-zinc-500">
                      Termina em:{" "}
                      {new Date(
                        `${preview.endsAtYmd}T00:00:00`
                      ).toLocaleDateString()}
                    </p>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>

      <textarea
        placeholder="Observações, cuidados extras na aplicação da medicação"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        className="w-full rounded border px-2 py-1 text-sm"
      />

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-zinc-600"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="text-xs rounded bg-zinc-900 px-3 py-1 text-white disabled:opacity-50"
        >
          Salvar
        </button>
      </div>

      <input type="hidden" value={animalId} readOnly />
    </div>
  );
}