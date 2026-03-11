"use client";

// path: frontend/src/components/agenda/task/BaseTaskCard.tsx

import type { AnimalTaskItem } from "@/types/agenda";
import { useTaskActions } from "@/hooks/useTaskActions";
import { TaskBadges } from "../TaskBadges";
import { isDueSoon, TaskStatus } from "@/utils/task-actions";

type Props = {
  animalId: string;
  task: AnimalTaskItem;
  expanded?: boolean;
  onToggleExpand?: () => void;
  onReload?: () => Promise<void>;
  updateTaskLocally?: (id: number, patch: Partial<AnimalTaskItem>) => void;
};

function actionLabel(action: string): string {
  switch (action) {
    case "completed":
      return "Concluída";
    case "reopened":
      return "Reaberta";
    case "canceled":
      return "Cancelada";
    default:
      return action;
  }
}

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

export function BaseTaskCard({
  animalId,
  task,
  expanded,
  onToggleExpand,
  onReload,
  updateTaskLocally,
}: Props) {
  const visualState = getTaskVisualState(task);
  const status = task.status as TaskStatus;
  const dueSoon = isDueSoon(task, 12);
  const isTreatment = task.source === "TREATMENT";

  const rc = task.recurrence_context ?? null;
  const last = task.last_action ?? null;

  const { done, cancel, reopen } = useTaskActions(
    animalId,
    task.id,
    onReload,
    updateTaskLocally
  );

  return (
    <li
      onClick={onToggleExpand}
      className={`rounded-md border px-4 py-3 space-y-2 cursor-pointer ${stateStyle[visualState]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">

          <div className="flex items-center gap-2">
            <p className="font-medium text-zinc-900 truncate">
              {task.title}
            </p>

            <TaskBadges
              status={status}
              isTreatment={isTreatment}
              dueSoon={dueSoon}
            />
          </div>

          {task.description && (
            <p className="text-sm text-zinc-800 whitespace-pre-line">
              {task.description}
            </p>
          )}

          {rc?.index && rc?.total && (
            <p className="text-xs text-zinc-500">
              🔁 Repetição: item {rc.index} de {rc.total}
            </p>
          )}

          <p className="text-xs text-zinc-500">
            {task.scheduled_at
              ? new Date(task.scheduled_at).toLocaleString()
              : "Sem data"}
          </p>

          {last && last.by && (
            <p className="text-xs text-zinc-500">
              Última ação:{" "}
              <span className="font-medium">
                {actionLabel(last.action)}
              </span>{" "}
              por{" "}
              <span className="font-medium">
                {last.by.name}
              </span>{" "}
              em{" "}
              {new Date(last.at).toLocaleString()}
            </p>
          )}
        </div>

        <div
          className="flex gap-3 text-xs"
          onClick={(e) => e.stopPropagation()}
        >
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
                ✖ Cancelar
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
      </div>
    </li>
  );
}
