// path: frontend/src/app/dashboard/animals/[animalId]/agenda/tasks/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AnimalTaskItemCard } from "@/components/agenda/AnimalTaskItemCard";

import {
  getAnimalTasks,
  markTaskDone,
  reopenTask,
  cancelTask,
  cancelTaskRecurrence,
} from "@/services/animalTasks";

import type { AnimalTaskItem } from "@/types/agenda";

import { TaskCreateForm } from "@/components/agenda/TaskCreateForm";
import { AgendaTaskFilters } from "@/components/agenda/AgendaTaskFilters";

/* =======================
 * Tipos locais (UI)
 * ======================= */

type TaskStatusFilter = "PLANNED" | "DONE" | "LATE" | "ALL";

/* =======================
 * Visual helpers
 * ======================= */

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

/* =======================
 * Datas (regra única)
 * ======================= */

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

/* =======================
 * Page
 * ======================= */

export default function AnimalAgendaTasksPage() {
  const { animalId } = useParams<{ animalId: string }>();
  const now = new Date();

  const [tasks, setTasks] = useState<AnimalTaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [todayOnly, setTodayOnly] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const [from, setFrom] = useState<string | undefined>();
  const [to, setTo] = useState<string | undefined>();

  const [statusFilter, setStatusFilter] =
    useState<TaskStatusFilter>("PLANNED");

  async function load() {
    if (!animalId) return;

    const range = resolveDateRange(todayOnly, year, month, from, to);

    const backendStatus =
      statusFilter === "LATE" ? "PLANNED" : statusFilter;

    const res = await getAnimalTasks(animalId, {
      ...range,
      status: backendStatus === "ALL" ? undefined : backendStatus,
    });

    const items =
      statusFilter === "LATE"
        ? res.items.filter(
            (t) =>
              t.status === "PLANNED" &&
              t.scheduled_at &&
              new Date(t.scheduled_at) < new Date()
          )
        : res.items;

    setTasks(items);
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animalId, todayOnly, year, month, from, to, statusFilter]);

  if (loading) {
    return <p className="text-sm text-zinc-500">Carregando tarefas…</p>;
  }

  return (
    <section className="space-y-6">
      <TaskCreateForm animalId={animalId} onCreated={load} />

      <AgendaTaskFilters
        todayOnly={todayOnly}
        expanded={expanded}
        year={year}
        month={month}
        from={from}
        to={to}
        status={statusFilter}
        onToggleToday={setTodayOnly}
        onToggleExpanded={() => setExpanded((v) => !v)}
        onChangeYear={setYear}
        onChangeMonth={setMonth}
        onChangeFrom={setFrom}
        onChangeTo={setTo}
        onChangeStatus={setStatusFilter}
      />
      <ul className="space-y-3">
        {tasks.map((task) => (
          <AnimalTaskItemCard
            key={task.id}
            animalId={animalId}
            task={task}
            expanded={expandedId === task.id}
            onToggleExpand={() =>
              setExpandedId(
                expandedId === task.id ? null : task.id
              )
            }
            onReload={load}
          />
        ))}
      </ul>
    </section>
  );
}
