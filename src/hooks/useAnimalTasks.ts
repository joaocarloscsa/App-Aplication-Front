"use client";

// path: frontend/src/hooks/useAnimalTasks.ts

import { useCallback, useEffect, useMemo, useState } from "react";
import { getAnimalTasks } from "@/services/animalTasks";
import { resolveTaskDateRange } from "@/utils/tasks/task-date-range";
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

  treatmentPublicId?: string;
  treatmentSchedulePublicId?: string;
};

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
    treatmentPublicId: undefined,
    treatmentSchedulePublicId: undefined,
  });

  const reload = useCallback(async () => {
    if (!animalId) return;

    const range = resolveTaskDateRange(
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
      treatment_public_id: filters.treatmentPublicId,
      treatment_schedule_public_id: filters.treatmentSchedulePublicId,
    });

    const items =
      filters.status === "LATE"
        ? res.items.filter(
            (t) =>
              t.status === "PLANNED" &&
              t.scheduled_at &&
              new Date(t.scheduled_at) < now
          )
        : res.items;

    setTasks(() => items);
  }, [
    animalId,
    filters.todayOnly,
    filters.year,
    filters.month,
    filters.from,
    filters.to,
    filters.status,
    filters.treatmentPublicId,
    filters.treatmentSchedulePublicId,
    now,
  ]);

  useEffect(() => {
    setLoading(true);
    reload().finally(() => setLoading(false));
  }, [reload]);

  /**
   * Atualiza uma tarefa localmente sem reload
   */
  const updateTaskLocally = useCallback(
    (taskId: number, patch: Partial<AnimalTaskItem>) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, ...patch }
            : task
        )
      );
    },
    []
  );

  /**
   * Remove tarefa da lista
   */
  const removeTaskLocally = useCallback((taskId: number) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== taskId)
    );
  }, []);

  /**
   * Adiciona tarefa nova na lista
   */
  const addTaskLocally = useCallback(
    (task: AnimalTaskItem) => {
      setTasks((prev) => [task, ...prev]);
    },
    []
  );

  return {
    tasks,
    loading,
    filters,
    setFilters,

    reload,

    updateTaskLocally,
    removeTaskLocally,
    addTaskLocally,
  };
}