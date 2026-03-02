// /var/www/GSA/animal/frontend/src/components/animals/clinic/TreatmentScheduleStatusActions.tsx

"use client";

import { useState } from "react";
import {
  changeTreatmentScheduleStatus,
  ScheduleStatusAction,
} from "@/services/treatmentScheduleStatus";
import { HttpError } from "@/services/http";

type Props = {
  schedulePublicId: string;
  currentStatus: string;
  onChanged(): Promise<void> | void;
};

export function TreatmentScheduleStatusActions({
  schedulePublicId,
  currentStatus,
  onChanged,
}: Props) {
  const [action, setAction] = useState<ScheduleStatusAction | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!action) return;

    if (!notes.trim()) {
      setError("Observação obrigatória.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await changeTreatmentScheduleStatus(schedulePublicId, {
        action,
        notes,
      });

      setAction(null);
      setNotes("");
      await onChanged();
    } catch (e) {
      if (e instanceof HttpError) {
        const code = (e.body as any)?.error?.code;

        if (code === "treatment_not_active") {
          setError(
            "Não é possível alterar a prescrição porque o tratamento não está ativo. Retome o tratamento para poder suspender/retomar/finalizar/cancelar a medicação."
          );
          return;
        }

        if (code === "schedule_not_active") {
          setError("A prescrição não está ativa, então não pode ser suspensa.");
          return;
        }

        if (code === "schedule_not_paused") {
          setError("A prescrição não está suspensa, então não pode ser retomada.");
          return;
        }

        if (code === "schedule_already_closed") {
          setError("A prescrição já está finalizada ou cancelada.");
          return;
        }

        if (code === "notes_required") {
          setError("Observação obrigatória.");
          return;
        }

        if (code === "invalid_status_transition") {
          setError("Esta alteração de estado não é permitida.");
          return;
        }

        if (code === "schedule_has_pending_tasks") {
          setError(
            "Você não pode finalizar esta prescrição porque ainda existem doses pendentes. Conclua ou suspenda as tarefas restantes antes de finalizar."
          );
          return;
        }

        if (code === "schedule_has_pending_tasks") {
          setError(
            "Não é possível finalizar enquanto houver doses agendadas ainda não concluídas."
          );
          return;
        }

        setError("Erro ao alterar estado da prescrição.");
        return;
      }

      setError("Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2 pt-2">
      <div className="flex gap-2 flex-wrap">
        {currentStatus === "active" && (
          <button
            type="button"
            onClick={() => setAction("pause")}
            className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800"
          >
            ⏸ Suspender
          </button>
        )}

        {currentStatus === "paused" && (
          <button
            type="button"
            onClick={() => setAction("resume")}
            className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800"
          >
            ▶ Retomar
          </button>
        )}

        {!["finished", "cancelled"].includes(currentStatus) && (
          <>
            <button
              type="button"
              onClick={() => setAction("finish")}
              className="text-xs px-2 py-1 rounded bg-green-100 text-green-800"
            >
              ✅ Finalizar
            </button>
            <button
              type="button"
              onClick={() => setAction("cancel")}
              className="text-xs px-2 py-1 rounded bg-red-100 text-red-800"
            >
              ❌ Cancelar
            </button>
          </>
        )}
      </div>

      {action && (
        <div className="rounded border bg-white p-2 space-y-2">
          <p className="text-xs font-medium text-zinc-700">
            Ação:{" "}
            {{
              pause: "Suspender prescrição",
              resume: "Retomar prescrição",
              finish: "Finalizar prescrição",
              cancel: "Cancelar prescrição",
            }[action]}
          </p>

          <textarea
            placeholder="Observação obrigatória"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full rounded border px-2 py-1 text-xs"
          />

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAction(null)}
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
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}