"use client";

import { useState } from "react";
import { changeTreatmentStatus } from "@/services/treatmentStatus";

type Props = {
  treatmentPublicId: string;
  currentStatus: string;
  onChanged(): Promise<void> | void;
};

type Action = "paused" | "resumed" | "finished";

export function TreatmentStatusActions({
  treatmentPublicId,
  currentStatus,
  onChanged,
}: Props) {
  const [openAction, setOpenAction] = useState<Action | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!openAction) return;

    if (!notes.trim()) {
      setError("A observação é obrigatória.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await changeTreatmentStatus(treatmentPublicId, {
        action: openAction,
        notes,
      });

      setNotes("");
      setOpenAction(null);
      await onChanged();
    } catch {
      setError("Erro ao alterar o estado do tratamento.");
    } finally {
      setLoading(false);
    }
  }

  function canPause() {
    return currentStatus === "active";
  }

  function canResume() {
    return currentStatus === "paused";
  }

  function canFinish() {
    return currentStatus !== "finished";
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {canPause() && (
          <button
            onClick={() => setOpenAction("paused")}
            className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800"
          >
            ⏸ Suspender
          </button>
        )}

        {canResume() && (
          <button
            onClick={() => setOpenAction("resumed")}
            className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800"
          >
            ▶ Retomar
          </button>
        )}

        {canFinish() && (
          <button
            onClick={() => setOpenAction("finished")}
            className="text-xs px-2 py-1 rounded bg-green-100 text-green-800"
          >
            ✅ Finalizar
          </button>
        )}
      </div>

      {openAction && (
        <div className="rounded border bg-white p-3 space-y-2">
          <p className="text-xs font-medium text-zinc-700">
            {openAction === "paused" && "Suspender tratamento"}
            {openAction === "resumed" && "Retomar tratamento"}
            {openAction === "finished" && "Finalizar tratamento"}
          </p>

          <textarea
            placeholder="Observação obrigatória"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded border px-2 py-1 text-sm"
          />

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpenAction(null)}
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