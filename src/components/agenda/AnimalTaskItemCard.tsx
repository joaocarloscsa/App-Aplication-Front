"use client";

import type { AnimalTaskItem } from "@/types/agenda";
import { useTaskActions } from "@/hooks/useTaskActions";

import { AnimalTaskHeader } from "./task/AnimalTaskHeader";
import { AnimalTaskExpanded } from "./task/AnimalTaskExpanded";
import { AnimalTaskActions } from "./task/AnimalTaskActions";

import { getTaskVisualState } from "@/utils/tasks/task-status";
import { formatDateTime } from "@/utils/datetime/formatDateTime";

type Props = {
  animalId: string;
  task: AnimalTaskItem;
  expanded: boolean;
  onToggleExpand(): void;
  onReload(): Promise<void>;
};

type TaskVisualState =
  | "planned"
  | "late"
  | "done"
  | "canceled";

const stateStyle: Record<TaskVisualState, string> = {
  planned: "bg-white",
  late: "bg-amber-50",
  done: "bg-green-50",
  canceled: "bg-zinc-100",
};

export function AnimalTaskItemCard({
  animalId,
  task,
  expanded,
  onToggleExpand,
  onReload,
}: Props) {
  const visualState: TaskVisualState =
    getTaskVisualState(task);

  const rc = task.recurrence_context;

  const {
    done,
    cancel,
    reopen,
    cancelRecurrence,
  } = useTaskActions(animalId, task.id, onReload);

  return (
    <li
      onClick={onToggleExpand}
      className={`rounded-md border px-4 py-3 space-y-2 cursor-pointer ${
        stateStyle[visualState] ?? "bg-white"
      }`}
    >
      <AnimalTaskHeader task={task} />

      {task.description && (
        <p className="text-sm text-zinc-800 whitespace-pre-line">
          {task.description}
        </p>
      )}

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

      <p className="text-xs text-zinc-500">
        {formatDateTime(task.scheduled_at)}
      </p>

      {expanded && (
        <AnimalTaskExpanded task={task} />
      )}

      <div
        className="flex gap-3 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimalTaskActions
          status={task.status}
          done={done}
          cancel={cancel}
          reopen={reopen}
        />
      </div>
    </li>
  );
}