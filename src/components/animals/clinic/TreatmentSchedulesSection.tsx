// /var/www/GSA/animal/frontend/src/components/animals/clinic/TreatmentSchedulesSection.tsx
"use client";

import { useState } from "react";
import { AnimalTreatmentScheduleCreateForm } from "./AnimalTreatmentScheduleCreateForm";
import { TreatmentScheduleStatusActions } from "./TreatmentScheduleStatusActions";
import { TreatmentScheduleTimeline } from "./TreatmentScheduleTimeline";
import { TreatmentScheduleDTO } from "@/services/animalTreatments";
import { CopyId } from "@/components/dashboard/CopyId";

type Props = {
  treatmentPublicId: string;
  schedules: TreatmentScheduleDTO[];
  onReload(): Promise<void> | void;
};

function formatDateSafe(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-PT");
}

function renderFrequency(s: TreatmentScheduleDTO) {
  const t = s.frequency?.type;

  if (t === "daily_times") {
    const perDay = s.frequency?.daily?.times_per_day ?? s.frequency?.daily?.times?.length ?? 1;
    return `${perDay}x por dia`;
  }

  if (t === "interval_days") {
    const days = s.frequency?.interval?.days ?? 1;
    if (days === 1) return "Diário";
    return `A cada ${days} dias`;
  }

  return "";
}

function renderTimes(s: TreatmentScheduleDTO): string | null {
  const t = s.frequency?.type;

  if (t === "daily_times") {
    const times = s.frequency?.daily?.times ?? [];
    return times.length ? `Horários: ${times.join(", ")}` : null;
  }

  if (t === "interval_days") {
    const ex = s.frequency?.interval?.execution_time;
    return ex ? `Horário: ${ex}` : null;
  }

  return null;
}


function humanizeRoute(label?: string | null) {
  if (!label) return "";

  const normalized = label.toLowerCase();

  if (normalized.includes("oral"))
    return "Via oral (pela boca)";

  if (normalized.includes("ocular") || normalized.includes("oft"))
    return "Aplicação nos olhos";

  if (normalized.includes("cut"))
    return "Aplicação na pele";

  if (normalized.includes("oto"))
    return "Aplicação no ouvido";

  return label;
}

function renderStatusBadge(status?: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "paused":
      return "bg-yellow-100 text-yellow-700";
    case "finished":
      return "bg-blue-100 text-blue-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-zinc-100 text-zinc-600";
  }
}

function renderDosage(s: TreatmentScheduleDTO): string | null {
  const amount = s.dosage?.amount;
  if (!amount) return null;

  const unitLabel = s.dosage?.unit?.label ?? "";

  let strengthPart = "";

  if (s.dosage?.strength?.value) {
    strengthPart = ` (${s.dosage.strength.value}`;

    if (s.dosage.strength.unit?.label) {
      strengthPart += ` ${s.dosage.strength.unit.label}`;
    }

    strengthPart += ")";
  }

  return `${amount} ${unitLabel}${strengthPart}`.trim();
}

export function TreatmentSchedulesSection({
  treatmentPublicId,
  schedules,
  onReload,
}: Props) {
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-zinc-800">
          Prescrições (medicações / procedimentos)
        </h4>

        {!creating && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="text-xs text-blue-600 hover:underline"
          >
            + Adicionar prescrição
          </button>
        )}
      </div>

      {schedules.length === 0 && !creating && (
        <p className="text-xs text-zinc-500 italic">
          Nenhuma prescrição registrada neste tratamento.
        </p>
      )}

      {schedules.map((s) => {
        const timesLine = renderTimes(s);
        const dosageLine = renderDosage(s);

        return (
          <div
            key={s.schedule_public_id}
            className="rounded border bg-white p-4 text-sm space-y-3"
          >
            {/* HEADER */}
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <p className="font-medium text-zinc-900 truncate">
                  {s.medication_name || "Prescrição"}
                </p>

                <p className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                  {s.schedule_public_id}
                  <CopyId id={s.schedule_public_id} showValue={false} />
                </p>

                {s.administration_route?.label && (
                  <p className="text-xs text-zinc-600">
                    Via: <span className="font-medium">
                      {humanizeRoute(s.administration_route.label)}
                    </span>
                  </p>
                )}

                <p className="text-[11px] text-zinc-500">
                  Prescrito por{" "}
                  <span className="font-medium">
                    {s.created_by?.name ?? "—"}
                  </span>
                </p>

                {/* ✅ HORA DA CRIAÇÃO */}
                {s.meta?.created_at && (
                  <p className="text-[11px] text-zinc-400">
                    Criado em{" "}
                    {new Date(s.meta.created_at).toLocaleString("pt-PT")}
                  </p>
                )}
              </div>

              <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                {renderFrequency(s)}
              </span>
            </div>

            {/* HORÁRIOS */}
            {timesLine && (
              <p className="text-xs text-zinc-600">{timesLine}</p>
            )}

            {/* DOSAGEM */}
            {dosageLine && (
              <p className="text-xs text-zinc-600">
                Dosagem: {dosageLine}
              </p>
            )}

            {/* PERÍODO */}
            <p className="text-xs text-zinc-500">
              Início: {formatDateSafe(s.period?.starts_at)}
              {s.period?.ends_at && ` • Fim: ${formatDateSafe(s.period.ends_at)}`}
            </p>

{s.task_stats && (
  <div className="text-xs border-t pt-2 space-y-1">
    <div className="flex gap-4 flex-wrap">
      <span>
        Total:{" "}
        <span className="font-medium">
          {s.task_stats.total}
        </span>
      </span>

      <span className="text-green-700">
        Administradas:{" "}
        <span className="font-medium">
          {s.task_stats.done}
        </span>
      </span>

      <span className="text-yellow-700">
        Suspensas:{" "}
        <span className="font-medium">
          {s.task_stats.suspended}
        </span>
      </span>

      {s.task_stats.canceled > 0 && (
        <span className="text-red-700">
          Canceladas:{" "}
          <span className="font-medium">
            {s.task_stats.canceled}
          </span>
        </span>
      )}

      <span className="text-blue-700">
        Restantes:{" "}
        <span className="font-medium">
          {s.task_stats.remaining}
        </span>
      </span>
    </div>

    {s.task_stats.total > 0 && (
      <div className="w-full bg-zinc-200 rounded h-1.5 mt-1">
        <div
          className="bg-green-600 h-1.5 rounded"
          style={{
            width: `${(s.task_stats.done / s.task_stats.total) * 100}%`,
          }}
        />
      </div>
    )}
  </div>
)}

            {/* OBSERVAÇÕES */}
            {s.notes && (
              <div className="text-xs text-zinc-600 italic border-t pt-2">
                {s.notes}
              </div>
            )}

            {/* TIMELINE */}
            {Array.isArray(s.status_history) && (
              <TreatmentScheduleTimeline events={s.status_history} />
            )}

            {/* AÇÕES */}
            <TreatmentScheduleStatusActions
              schedulePublicId={s.schedule_public_id}
              currentStatus={s.meta?.status ?? "active"}
              onChanged={onReload}
            />

            <span
              className={`text-[11px] px-2 py-0.5 rounded ${renderStatusBadge(
                s.meta?.status
              )}`}
            >
              {s.meta?.status?.toUpperCase()}
            </span>
          </div>
        );
      })}

      {creating && (
        <div className="pt-2">
          <AnimalTreatmentScheduleCreateForm
            treatmentPublicId={treatmentPublicId}
            onCreated={async () => {
              setCreating(false);
              await onReload();
            }}
          />

          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="text-xs text-zinc-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}