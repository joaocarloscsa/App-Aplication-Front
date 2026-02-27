"use client";

// path: frontend/src/components/agenda/AnimalTaskItemCard.tsx

import type { AnimalTaskItem } from "@/types/agenda";
import { useTaskActions } from "@/hooks/useTaskActions";

type Props = {
  animalId: string;
  task: AnimalTaskItem;
  expanded: boolean;
  onToggleExpand(): void;
  onReload(): Promise<void>;
};

function getTaskVisualState(task: AnimalTaskItem) {
  if (task.status === "CANCELED") return "canceled";
  if (task.status === "DONE") return "done";

  if (
    task.status === "PLANNED" &&
    task.scheduled_at &&
    new Date(task.scheduled_at).getTime() < Date.now()
  ) {
    return "late";
  }

  return "planned";
}

const stateStyle: Record<string, string> = {
  planned: "bg-white",
  late: "bg-amber-50",
  done: "bg-green-50",
  canceled: "bg-zinc-100",
};

const statusBadge: Record<string, string> = {
  PLANNED: "bg-zinc-100 text-zinc-700",
  DONE: "bg-green-100 text-green-800",
  CANCELED: "bg-red-100 text-red-800",
};

function mapActionLabel(action: string) {
  switch (action) {
    case "completed":
      return "Concluída";
    case "canceled":
      return "Cancelada";
    case "reopened":
      return "Reaberta";
    default:
      return action;
  }
}

function mapSourceLabel(source?: string | null) {
  if (!source) return null;

  switch (source) {
    case "TREATMENT":
      return "Tratamento";
    case "SYSTEM":
      return "Sistema";
    case "MANUAL":
      return "Manual";
    default:
      return source;
  }
}

export function AnimalTaskItemCard({
  animalId,
  task,
  expanded,
  onToggleExpand,
  onReload,
}: Props) {
  const visualState = getTaskVisualState(task);
  const rc = task.recurrence_context;
  const isTreatment = task.source === "TREATMENT";

  const { done, cancel, reopen, cancelRecurrence } = useTaskActions(
    animalId,
    task.id,
    onReload
  );

  return (
    <li
      onClick={onToggleExpand}
      className={`rounded-md border px-4 py-3 space-y-2 cursor-pointer ${stateStyle[visualState]}`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-zinc-900">{task.title}</p>
          
{isTreatment && (
  <span className="inline-flex items-center rounded-md bg-blue-100 text-blue-900 px-2.5 py-1 text-xs font-semibold border border-blue-300">
    🏥 Tratamento clínico
  </span>
)}
        </div>

        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[task.status]}`}
        >
          {task.status}
        </span>
      </div>

      {/* DESCRIÇÃO */}
      {task.description && (
        <p className="text-sm text-zinc-800 whitespace-pre-line">
          {task.description}
        </p>
      )}

      {/* RECORRÊNCIA */}
      {rc?.index && rc?.total && (
        <p className="text-xs text-zinc-500 flex items-center gap-2">
          <span>
            🔁 Repetição {rc.index} de {rc.total}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              cancelRecurrence();
            }}
            className="text-zinc-400 hover:text-zinc-600 hover:underline"
          >
            Cancelar todas
          </button>
        </p>
      )}

      {/* DATA */}
      <p className="text-xs text-zinc-500">
        {task.scheduled_at
          ? new Date(task.scheduled_at).toLocaleString()
          : "Sem data"}
      </p>

      {/* DETALHES EXPANDIDOS */}
      {expanded && (
        <div className="border-t pt-3 text-xs text-zinc-600 space-y-1">
          {/* IDs técnicos de tratamento */}
          {isTreatment && (
            <div className="pt-1 space-y-1 text-zinc-500">
              {task.treatment_public_id && (
                <p>
                  <strong>Tratamento:</strong>{" "}
                  <span className="font-mono">
                    {task.treatment_public_id}
                  </span>
                </p>
              )}

              {task.treatment_schedule_public_id && (
                <p>
                  <strong>Medicação:</strong>{" "}
                  <span className="font-mono">
                    {task.treatment_schedule_public_id}
                  </span>
                </p>
              )}
            </div>
          )}

          <p>
            <strong>Criada em:</strong>{" "}
            {new Date(task.created_at).toLocaleString()}
          </p>

          <p>
            <strong>Criada por:</strong> {task.created_by.name}
          </p>

          {task.last_action && (
            <>
              <p className="pt-1">
                <strong>Última ação:</strong>{" "}
                {mapActionLabel(task.last_action.action)}
              </p>

              {task.last_action.by?.name && (
                <p>
                  <strong>Por:</strong> {task.last_action.by.name}
                </p>
              )}

              <p>
                <strong>Em:</strong>{" "}
                {new Date(task.last_action.at).toLocaleString()}
              </p>

              {task.last_action.comment && (
                <p className="italic text-zinc-500">
                  “{task.last_action.comment}”
                </p>
              )}

              {task.last_action.source &&
                task.last_action.source !== "MANUAL" && (
                  <p className="text-zinc-500">
                    <strong>Origem:</strong>{" "}
                    {mapSourceLabel(task.last_action.source)}
                  </p>
                )}
            </>
          )}
        </div>
      )}

      {/* ACTIONS */}
      <div
        className="flex gap-3 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {task.status === "PLANNED" && (
          <>
            <button
              type="button"
              onClick={() => done()}
              className="text-green-700 hover:underline"
            >
              ✔ Feita
            </button>

            <button
              type="button"
              onClick={() => cancel()}
              className="text-red-700 hover:underline"
            >
              ✖ Cancelar tarefa
            </button>
          </>
        )}

        {(task.status === "DONE" || task.status === "CANCELED") && (
          <button
            type="button"
            onClick={() => reopen()}
            className="text-amber-700 hover:underline"
          >
            ↺ Reabrir
          </button>
        )}
      </div>
    </li>
  );
}