// path: frontend/src/components/animals/clinic/TreatmentScheduleStatusActions.tsx
"use client";

import { useState } from "react";
import {
  changeTreatmentScheduleStatus,
  ScheduleStatusAction,
} from "@/services/treatmentScheduleStatus";

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

  function startAction(a: ScheduleStatusAction) {
    setAction(a);
    setNotes("");
    setError(null);
  }

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
    } catch {
      setError("Erro ao alterar estado da prescrição.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2 pt-2">
      <div className="flex gap-2 flex-wrap">
        {currentStatus === "active" && (
          <>
            <button
              onClick={() => startAction("pause")}
              className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800"
            >
              ⏸ Suspender
            </button>

            <button
              onClick={() => startAction("finish")}
              className="text-xs px-2 py-1 rounded bg-green-100 text-green-800"
            >
              ✅ Finalizar
            </button>

            <button
              onClick={() => startAction("cancel")}
              className="text-xs px-2 py-1 rounded bg-red-100 text-red-800"
            >
              ❌ Cancelar
            </button>
          </>
        )}

        {currentStatus === "paused" && (
          <>
            <button
              onClick={() => startAction("resume")}
              className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800"
            >
              ▶ Retomar
            </button>

            <button
              onClick={() => startAction("cancel")}
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
            disabled={loading}
            className="w-full rounded border px-2 py-1 text-xs disabled:bg-zinc-100"
          />

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setAction(null)}
              disabled={loading}
              className="text-xs text-zinc-600 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
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