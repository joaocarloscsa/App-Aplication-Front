// path: frontend/src/app/(protected)/dashboard/animals/[animalId]/agenda/tasks/page.tsx

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import type { AnimalTaskItem } from "@/types/agenda";

import { TaskCreateForm } from "@/components/agenda/TaskCreateForm";
import { AgendaTaskFilters } from "@/components/agenda/AgendaTaskFilters";
import { AnimalTaskItemCard } from "@/components/agenda/AnimalTaskItemCard";

import { useAnimalTasks } from "@/hooks/useAnimalTasks";

export default function AnimalAgendaTasksPage() {
  const { animalId } = useParams<{ animalId: string }>();

  const { tasks, loading, filters, setFilters, reload } =
    useAnimalTasks(animalId);

  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (loading) {
    return <p className="text-sm text-zinc-500">Carregando tarefas…</p>;
  }

  return (
    <section className="space-y-6">
      <TaskCreateForm animalId={animalId} onCreated={reload} />

      <AgendaTaskFilters
        todayOnly={filters.todayOnly}
        expanded={filters.expanded}
        year={filters.year}
        month={filters.month}
        from={filters.from}
        to={filters.to}
        status={filters.status}
        onToggleToday={(v) =>
          setFilters((s) => ({ ...s, todayOnly: v }))
        }
        onToggleExpanded={() =>
          setFilters((s) => ({ ...s, expanded: !s.expanded }))
        }
        onChangeYear={(v) => setFilters((s) => ({ ...s, year: v }))}
        onChangeMonth={(v) => setFilters((s) => ({ ...s, month: v }))}
        onChangeFrom={(v) => setFilters((s) => ({ ...s, from: v }))}
        onChangeTo={(v) => setFilters((s) => ({ ...s, to: v }))}
        onChangeStatus={(v) => setFilters((s) => ({ ...s, status: v }))}
      />

      <ul className="space-y-3">
        {tasks.map((task: AnimalTaskItem) => (
          <AnimalTaskItemCard
            key={task.id}
            animalId={animalId}
            task={task}
            expanded={expandedId === task.id}
            onToggleExpand={() =>
              setExpandedId((cur) => (cur === task.id ? null : task.id))
            }
            onReload={reload}
          />
        ))}
      </ul>
    </section>
  );
}