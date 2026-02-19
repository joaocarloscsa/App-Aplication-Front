// path: /var/www/GSA/animal/frontend/src/utils/tasks-time-filter.ts

import type { AnimalTaskItem } from "@/services/animalTasks";

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
}

export function filterTasksByView(
  tasks: AnimalTaskItem[],
  view: "day" | "week" | "month",
  reference: Date
) {
  const ref = new Date(reference);

  let from: Date;
  let to: Date;

  if (view === "day") {
    from = startOfDay(ref);
    to = endOfDay(ref);
  } else if (view === "week") {
    const day = ref.getDay(); // 0..6 (domingo..sábado)
    const start = new Date(ref);
    start.setDate(ref.getDate() - day);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    from = startOfDay(start);
    to = endOfDay(end);
  } else {
    from = new Date(ref.getFullYear(), ref.getMonth(), 1);
    to = endOfDay(new Date(ref.getFullYear(), ref.getMonth() + 1, 0));
  }

return tasks
  .filter((t) => {
    if (!t.scheduled_at) return false;
    const d = new Date(t.scheduled_at);
    return d >= from && d <= to;
  })
  .sort((a, b) => {
    const da = new Date(a.scheduled_at!).getTime();
    const db = new Date(b.scheduled_at!).getTime();
    if (da !== db) return da - db;

    return b.priority - a.priority;
  });

}

export function formatPeriodLabel(
  view: "day" | "week" | "month",
  reference: Date
): string {
  const ref = new Date(reference);

  if (view === "day") {
    return ref.toLocaleDateString();
  }

  if (view === "week") {
    const day = ref.getDay();
    const start = new Date(ref);
    start.setDate(ref.getDate() - day);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return `${start.toLocaleDateString()} — ${end.toLocaleDateString()}`;
  }

  return ref.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

