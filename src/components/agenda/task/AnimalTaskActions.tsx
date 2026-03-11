"use client";

import type { TaskStatus } from "@/utils/task-actions";

type Props = {
  status: TaskStatus;
  done(): void;
  cancel(): void;
  reopen(): void;
};

export function AnimalTaskActions({
  status,
  done,
  cancel,
  reopen,
}: Props) {
  return (
    <div className="flex gap-3 text-xs">
      {status === "PLANNED" && (
        <>
          <button
            type="button"
            onClick={done}
            className="text-green-700 hover:underline"
          >
            ✔ Feita
          </button>

          <button
            type="button"
            onClick={cancel}
            className="text-red-700 hover:underline"
          >
            ✖ Cancelar tarefa
          </button>
        </>
      )}

      {(status === "DONE" || status === "CANCELED") && (
        <button
          type="button"
          onClick={reopen}
          className="text-amber-700 hover:underline"
        >
          ↺ Reabrir
        </button>
      )}
    </div>
  );
}