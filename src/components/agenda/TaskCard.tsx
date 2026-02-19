"use client";

// path: frontend/src/components/agenda/TaskCard.tsx

import type { AnimalTaskItem } from "@/types/agenda";
import {
  isDueSoon,
  statusBadgeClasses,
  statusLabel,
  TaskStatus,
} from "@/utils/task-actions";

type Props = {
  animalId: string;
  task: AnimalTaskItem;
  onAction(
    action: "done" | "reopen" | "cancel",
    comment: string | null
  ): Promise<void>;
  onRefresh?: () => void;
};

function askComment(label: string): string | null {
  const v = prompt(label);
  if (v === null) return null;
  const t = v.trim();
  return t || null;
}

function actionLabel(action: string): string {
  switch (action) {
    case "completed":
      return "Concluída";
    case "reopened":
      return "Reaberta";
    case "canceled":
      return "Cancelada";
    default:
      return action;
  }
}

export function TaskCard({
  animalId,
  task,
  onAction,
  onRefresh,
}: Props) {
  const status = task.status as TaskStatus;
  const dueSoon = isDueSoon(task, 12);
  const rc = task.recurrence_context ?? null;
  const last = task.last_action ?? null;

  const canMarkDone = status === "PLANNED";
  const canReopen = status === "DONE";
  const canCancel = status === "PLANNED";

  return (
    <li className="rounded-md border bg-white px-4 py-3 space-y-2">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-zinc-900 truncate">
              {task.title}
            </p>

            <span
              className={[
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                statusBadgeClasses(status),
              ].join(" ")}
            >
              {statusLabel(status)}
            </span>

            {dueSoon && status === "PLANNED" && (
              <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-medium">
                Atrasada
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-sm text-zinc-800 whitespace-pre-line">
              {task.description}
            </p>
          )}

          {rc?.index && rc?.total && (
            <p className="text-xs text-zinc-500">
              🔁 Repetição: item {rc.index} de {rc.total}
            </p>
          )}

          <p className="text-xs text-zinc-500">
            {task.scheduled_at
              ? new Date(task.scheduled_at).toLocaleString()
              : "Sem data"}
          </p>

          <p className="text-xs text-zinc-600">
            Criada por{" "}
            <span className="font-medium">
              {task.created_by.name}
            </span>
          </p>

          {/* 🔍 ÚLTIMA AÇÃO (AUDITORIA) */}
          {last && last.by && (
            <p className="text-xs text-zinc-500">
              Última ação:{" "}
              <span className="font-medium">
                {actionLabel(last.action)}
              </span>{" "}
              por{" "}
              <span className="font-medium">
                {last.by.name}
              </span>{" "}
              em{" "}
              {new Date(last.at).toLocaleString()}
              {last.comment && (
                <>
                  {" "}
                  — <em>{last.comment}</em>
                </>
              )}
            </p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 shrink-0">
          {canMarkDone && (
            <button
              onClick={async () => {
                const c = askComment("Comentário (opcional):");
                if (c === null) return;
                await onAction("done", c);
              }}
              className="text-xs px-3 py-1.5 rounded-md border border-green-300 text-green-700 hover:bg-green-50"
            >
              Marcar como feita
            </button>
          )}

          {canReopen && (
            <button
              onClick={async () => {
                const c = askComment("Motivo da reabertura:");
                if (c === null) return;
                await onAction("reopen", c);
              }}
              className="text-xs px-3 py-1.5 rounded-md border border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              Reabrir
            </button>
          )}

          {canCancel && (
            <button
              onClick={async () => {
                const ok = confirm("Cancelar esta tarefa?");
                if (!ok) return;
                const c = askComment("Motivo (opcional):");
                if (c === null) return;
                await onAction("cancel", c);
              }}
              className="text-xs px-3 py-1.5 rounded-md border border-red-300 text-red-700 hover:bg-red-50"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
