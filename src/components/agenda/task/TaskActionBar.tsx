"use client";

type Props = {
  status: string;
  onDone(): void;
  onCancel(): void;
  onReopen(): void;
};

export function TaskActionBar({
  status,
  onDone,
  onCancel,
  onReopen,
}: Props) {
  return (
    <div className="flex gap-3 text-xs">
      {status === "PLANNED" && (
        <>
          <button
            type="button"
            onClick={onDone}
            className="text-green-700 hover:underline"
          >
            ✔ Feita
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="text-red-700 hover:underline"
          >
            ✖ Cancelar tarefa
          </button>
        </>
      )}

      {(status === "DONE" || status === "CANCELED") && (
        <button
          type="button"
          onClick={onReopen}
          className="text-amber-700 hover:underline"
        >
          ↺ Reabrir
        </button>
      )}
    </div>
  );
}
