// path: frontend/src/utils/tasks/task-date-range.ts

import {
  localDateToUtcStartIso,
  localDateToUtcEndIso,
} from "@/utils/datetime/local-date";

export function resolveTaskDateRange(
  todayOnly: boolean,
  year: number,
  month: number,
  from?: string,
  to?: string
) {
  if (from && to) {
    return {
      from: localDateToUtcStartIso(from),
      to: localDateToUtcEndIso(to),
    };
  }

  if (todayOnly) {
    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    const today = `${yyyy}-${mm}-${dd}`;

    return {
      from: localDateToUtcStartIso(today),
      to: localDateToUtcEndIso(today),
    };
  }

  const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;

  const lastDayDate = new Date(year, month, 0);

  const lastDay = `${lastDayDate.getFullYear()}-${String(
    lastDayDate.getMonth() + 1
  ).padStart(2, "0")}-${String(lastDayDate.getDate()).padStart(2, "0")}`;

  return {
    from: localDateToUtcStartIso(firstDay),
    to: localDateToUtcEndIso(lastDay),
  };
}