// path: frontend/src/utils/task-actions.ts

import type { AnimalTaskItem } from "@/services/animalTasks";

export type TaskStatus = "PLANNED" | "DONE" | "CANCELED";

export function statusLabel(status: TaskStatus): string {
  switch (status) {
    case "PLANNED":
      return "Pendente";
    case "DONE":
      return "Feita";
    case "CANCELED":
      return "Cancelada";
    default:
      return status;
  }
}

export function statusBadgeClasses(status: TaskStatus): string {
  switch (status) {
    case "PLANNED":
      return "bg-amber-100 text-amber-800";
    case "DONE":
      return "bg-green-100 text-green-800";
    case "CANCELED":
      return "bg-zinc-100 text-zinc-700";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
}

export function isDueSoon(
  task: Pick<AnimalTaskItem, "scheduled_at" | "status">,
  hours = 12
): boolean {
  if (task.status !== "PLANNED") return false;
  if (!task.scheduled_at) return false;

  const now = Date.now();
  const due = new Date(task.scheduled_at).getTime();
  const diffMs = due - now;

  if (diffMs < 0) return false;

  return diffMs <= hours * 60 * 60 * 1000;
}
