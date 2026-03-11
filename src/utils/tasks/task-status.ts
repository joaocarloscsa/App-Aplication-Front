import type { AnimalTaskItem } from "@/types/agenda";

export type TaskVisualState =
  | "planned"
  | "late"
  | "done"
  | "canceled";

export function isTaskLate(task: AnimalTaskItem): boolean {
  if (task.status !== "PLANNED") return false;
  if (!task.scheduled_at) return false;

  return new Date(task.scheduled_at).getTime() < Date.now();
}

export function getTaskVisualState(
  task: AnimalTaskItem
): TaskVisualState {
  if (task.status === "CANCELED") return "canceled";
  if (task.status === "DONE") return "done";

  if (isTaskLate(task)) return "late";

  return "planned";
}

export function canCompleteTask(task: AnimalTaskItem) {
  return task.status === "PLANNED";
}

export function canReopenTask(task: AnimalTaskItem) {
  return task.status === "DONE" || task.status === "CANCELED";
}

export function canCancelTask(task: AnimalTaskItem) {
  return task.status === "PLANNED";
}
