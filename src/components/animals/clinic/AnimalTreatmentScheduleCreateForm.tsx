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
  intervalDays: number,
  mode: Mode,
  count: number,
  until: string
) {
  if (!startYmd || intervalDays < 1) return { dates: [], endsAtYmd: "" };

  const endsAtYmd =
    mode === "COUNT"
      ? addDays(startYmd, (Math.max(1, Math.min(MAX_COUNT, count)) - 1) * intervalDays)
      : until || "";

  const dates: string[] = [];
  const total =
    mode === "COUNT"
      ? Math.max(1, Math.min(MAX_COUNT, count))
      : 9999; // só pra limitar preview

  let current = startYmd;
  for (let i = 0; i < total && dates.length < 3; i++) {
    dates.push(current);
    current = addDays(current, intervalDays);
    if (mode === "UNTIL" && endsAtYmd && new Date(current) > new Date(endsAtYmd)) break;
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
  const [intervalDays, setIntervalDays] = useState(1);

  const [timesPerDay, setTimesPerDay] = useState(2);
  const [time1, setTime1] = useState("08:00");
  const [time2, setTime2] = useState("20:00");
  const [time3, setTime3] = useState("12:00");
  const [time4, setTime4] = useState("18:00");

  const [mode, setMode] = useState<Mode>("COUNT");
  const [count, setCount] = useState(7);
  const [until, setUntil] = useState("");

  const [dosage, setDosage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const times = useMemo(() => {
    const pool = [time1, time2, time3, time4].map(normalizeTime);
    const n = Math.max(1, Math.min(4, timesPerDay));
    return pool.slice(0, n);
  }, [time1, time2, time3, time4, timesPerDay]);

  const preview = useMemo(() => {
    return buildPreviewDates(startsAt, intervalDays, mode, count, until);
  }, [startsAt, intervalDays, mode, count, until]);

  async function submit() {
    setError(null);

    if (!startsAt) {
      setError("Data de início obrigatória.");
      return;
    }

    if (intervalDays < 1) {
      setError("Intervalo em dias inválido.");
      return;
    }

    if (timesPerDay < 1 || timesPerDay > 4) {
      setError("Vezes por dia inválido (1 a 4).");
      return;
    }

    if (!Array.isArray(times) || times.length !== Math.max(1, Math.min(4, timesPerDay))) {
      setError("Horários inválidos.");
      return;
    }

    let endsAtYmd = "";

    if (mode === "COUNT") {
      if (count < 1 || count > MAX_COUNT) {
        setError(`Número de repetições inválido (1 a ${MAX_COUNT}).`);
        return;
      }
      endsAtYmd = addDays(startsAt, (count - 1) * intervalDays);
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

    const payloadBase: Omit<CreateTreatmentSchedulePayload, "preferred_time"> = {
      frequency_type: "interval_days",
      starts_at: toIsoStart(startsAt),
      ends_at: endsAtYmd ? toIsoEnd(endsAtYmd) : null,
      interval_days: intervalDays,
      dosage: dosage.trim() || null,
      generate_agenda: true,
    };

    try {
      setLoading(true);

      // ✅ 2x/dia = 2 schedules (cadeias independentes) com MESMA frequência de dias
      for (const t of times) {
        await createTreatmentSchedule(treatmentPublicId, {
          ...payloadBase,
          preferred_time: t,
        });
      }

      setStartsAt("");
      setIntervalDays(1);

      setTimesPerDay(2);
      setTime1("08:00");
      setTime2("20:00");
      setTime3("12:00");
      setTime4("18:00");

      setMode("COUNT");
      setCount(7);
      setUntil("");

      setDosage("");

      setOpen(false);
      await onCreated();
    } catch (e: any) {
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
            value={intervalDays}
            onChange={(e) => setIntervalDays(Number(e.target.value))}
            className="w-full rounded border px-2 py-1 text-sm"
          />
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
          Nota: {timesPerDay}x/dia = {timesPerDay} schedules (cadeias independentes) → {timesPerDay} tarefas por dia de ocorrência.
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



{startsAt && intervalDays >= 1 && (
  <div className="text-xs bg-white border rounded px-3 py-2 space-y-1">
    <p className="font-medium text-zinc-800">Preview (datas)</p>

    {(() => {
      const total =
        mode === "COUNT"
          ? Math.max(1, Math.min(MAX_COUNT, count))
          : null;

      // gera lista completa só se COUNT (no UNTIL pode ser grande/indefinido)
      const allDates =
        mode === "COUNT"
          ? Array.from({ length: total ?? 0 }).map((_, i) =>
              addDays(startsAt, i * intervalDays)
            )
          : preview.dates; // no UNTIL fica só amostra (3)

      const first = allDates.slice(0, 3);
      const last = mode === "COUNT" && allDates.length > 3
        ? allDates[allDates.length - 1]
        : null;

      return (
        <>
          <ul className="list-disc pl-4 text-zinc-700 space-y-0.5">
            {first.map((d) => (
              <li key={d}>
                {new Date(`${d}T00:00:00`).toLocaleDateString()} — horários:{" "}
                {times.join(", ")}
              </li>
            ))}

            {last && (
              <li key={last} className="text-zinc-500">
                … (mais {allDates.length - 4} ocorrências)
              </li>
            )}

            {last && (
              <li key={`${last}-final`} className="text-zinc-700">
                {new Date(`${last}T00:00:00`).toLocaleDateString()} — horários:{" "}
                {times.join(", ")} <span className="text-zinc-500">(última)</span>
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
              {new Date(`${preview.endsAtYmd}T00:00:00`).toLocaleDateString()}
            </p>
          )}
        </>
      );
    })()}
  </div>
)}
      </div>

      <input
        placeholder="Dosagem / observações (opcional)"
        value={dosage}
        onChange={(e) => setDosage(e.target.value)}
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

      {/* animalId está aqui (não usado ainda), mas vai ser o fio pra ligar preview real e vincular tasks por origem */}
      <input type="hidden" value={animalId} readOnly />
    </div>
  );
}
