// path: frontend/src/hooks/useAnimalTasks.ts

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getAnimalTasks } from "@/services/animalTasks";
import type { AnimalTaskItem } from "@/types/agenda";

export type TaskStatusFilter = "PLANNED" | "DONE" | "LATE" | "ALL";

export type TaskFiltersState = {
  todayOnly: boolean;
  expanded: boolean;

  year: number;
  month: number;

  from?: string;
  to?: string;

  status: TaskStatusFilter;
};

function resolveDateRange(
  todayOnly: boolean,
  year: number,
  month: number,
  from?: string,
  to?: string
) {
  if (from && to) {
    return {
      from: new Date(from + "T00:00:00").toISOString(),
      to: new Date(to + "T23:59:59").toISOString(),
    };
  }

  if (todayOnly) {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    return {
      from: `${yyyy}-${mm}-${dd}T00:00:00`,
      to: `${yyyy}-${mm}-${dd}T23:59:59`,
    };
  }

  return {
    from: new Date(year, month - 1, 1, 0, 0, 0).toISOString(),
    to: new Date(year, month, 0, 23, 59, 59).toISOString(),
  };
}

export function useAnimalTasks(animalId: string | undefined) {
  const now = useMemo(() => new Date(), []);

  const [tasks, setTasks] = useState<AnimalTaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<TaskFiltersState>({
    todayOnly: false,
    expanded: false,
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    from: undefined,
    to: undefined,
    status: "PLANNED",
  });

  const reload = useCallback(async () => {
    if (!animalId) return;

    const range = resolveDateRange(
      filters.todayOnly,
      filters.year,
      filters.month,
      filters.from,
      filters.to
    );

    const backendStatus =
      filters.status === "LATE" ? "PLANNED" : filters.status;

    const res = await getAnimalTasks(animalId, {
      ...range,
      status: backendStatus === "ALL" ? undefined : backendStatus,
    });

    const items =
      filters.status === "LATE"
        ? res.items.filter(
            (t) =>
              t.status === "PLANNED" &&
              t.scheduled_at &&
              new Date(t.scheduled_at) < new Date()
          )
        : res.items;

    setTasks(items);
  }, [
    animalId,
    filters.todayOnly,
    filters.year,
    filters.month,
    filters.from,
    filters.to,
    filters.status,
  ]);

  useEffect(() => {
    setLoading(true);
    reload().finally(() => setLoading(false));
  }, [reload]);

  return {
    tasks,
    loading,
    filters,
    setFilters,
    reload,
  };
}
