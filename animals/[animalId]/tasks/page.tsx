// path: frontend/src/app/dashboard/animals/[animalId]/agenda/tasks/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
        {tasks.map((task) => {
          const expandedItem = expandedId === task.id;
          const visualState = getTaskVisualState(task);
          const rc = task.recurrence_context;

          return (
            <li
              key={task.id}
              onClick={() => setExpandedId(expandedItem ? null : task.id)}
              className={`rounded-md border px-4 py-3 space-y-2 cursor-pointer ${stateStyle[visualState]}`}
            >
              {/* HEADER */}
              <div className="flex justify-between items-start gap-3">
                <p className="font-medium text-zinc-900">{task.title}</p>

                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[task.status]}`}
                >
                  {task.status}
                </span>
              </div>

              {/* DESCRIÇÃO HUMANA (canónica) */}
              {task.description && (
                <p className="text-sm text-zinc-800 whitespace-pre-line">
                  {task.description}
                </p>
              )}

              {/* CONTEXTO DE RECORRÊNCIA */}
              {rc?.index && rc?.total && (
                <p className="text-xs text-zinc-500 flex items-center gap-2">
                  <span>
                    🔁 Repetição {rc.index} de {rc.total}
                  </span>

                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();

                      const ok = confirm(
                        "Cancelar toda a recorrência?\n\n" +
                          "As ocorrências futuras que ainda não foram concluídas " +
                          "serão canceladas.\n\n" +
                          "As ocorrências já concluídas serão mantidas."
                      );

                      if (!ok) return;

                      await cancelTaskRecurrence(
                        animalId,
                        task.id,
                        "Recorrência cancelada pelo utilizador",
                        true
                      );

                      await load();
                    }}
                    className="text-zinc-400 hover:text-zinc-600 hover:underline"
                  >
                    Cancelar todas
                  </button>
                </p>
              )}

              <p className="text-xs text-zinc-500">
                {task.scheduled_at
                  ? new Date(task.scheduled_at).toLocaleString()
                  : "Sem data"}
              </p>

              {expandedItem && (
                <div className="border-t pt-3 text-xs text-zinc-600 space-y-1">
                  <p>
                    <strong>Criada em:</strong>{" "}
                    {new Date(task.created_at).toLocaleString()}
                  </p>

                  <p>
                    <strong>Criada por:</strong> {task.created_by.name}
                  </p>

                  {task.last_action && (
                    <>
                      <p className="pt-1">
                        <strong>Última ação:</strong>{" "}
                        {task.last_action.action === "completed"
                          ? "Concluída"
                          : task.last_action.action === "canceled"
                          ? "Cancelada"
                          : task.last_action.action === "reopened"
                          ? "Reaberta"
                          : task.last_action.action}
                      </p>

                      {"by" in task.last_action &&
                        (task.last_action as any).by?.name && (
                          <p>
                            <strong>Por:</strong>{" "}
                            {(task.last_action as any).by.name}
                          </p>
                        )}

                      <p>
                        <strong>Em:</strong>{" "}
                        {new Date(task.last_action.at).toLocaleString()}
                      </p>

                      {task.last_action.comment && (
                        <p className="italic text-zinc-500">
                          “{task.last_action.comment}”
                        </p>
                      )}

                      {"source" in task.last_action &&
                        (task.last_action as any).source &&
                        (task.last_action as any).source !== "MANUAL" && (
                          <p className="text-zinc-500">
                            Origem:{" "}
                            {(task.last_action as any).source === "TREATMENT"
                              ? "Tratamento"
                              : (task.last_action as any).source === "SYSTEM"
                              ? "Sistema"
                              : (task.last_action as any).source}
                          </p>
                        )}
                    </>
                  )}
                </div>
              )}

              {/* ACTIONS */}
              <div
                className="flex gap-3 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                {task.status === "PLANNED" && (
                  <>
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await markTaskDone(animalId, task.id);
                        await load();
                      }}
                      className="text-green-700 hover:underline"
                    >
                      ✔ Feita
                    </button>

                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const ok = confirm("Cancelar esta tarefa?");
                        if (!ok) return;

                        await cancelTask(animalId, task.id);
                        await load();
                      }}
                      className="text-red-700 hover:underline"
                    >
                      ✖ Cancelar tarefa
                    </button>
                  </>
                )}

                {(task.status === "DONE" || task.status === "CANCELED") && (
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await reopenTask(animalId, task.id);
                      await load();
                    }}
                    className="text-amber-700 hover:underline"
                  >
                    ↺ Reabrir
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
