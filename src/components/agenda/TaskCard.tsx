// /var/www/GSA/animal/frontend/src/components/agenda/TaskCard.tsx

"use client";

// path: frontend/src/components/agenda/TaskCard.tsx

import type { AnimalTaskItem } from "@/types/agenda";
import {
  isDueSoon,
  statusBadgeClasses,
  statusLabel,
  TaskStatus,
} from "@/utils/task-actions";
import { useModal } from "@/components/ui/modal/ModalProvider";

type Props = {
  animalId: string;
  task: AnimalTaskItem;
  onAction(
    action: "done" | "reopen" | "cancel",
    comment: string | null
  ): Promise<void>;
  onRefresh?: () => void;
};

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
  const { confirm, prompt } = useModal();

  const status = task.status as TaskStatus;
  const dueSoon = isDueSoon(task, 12);
  const rc = task.recurrence_context ?? null;
  const last = task.last_action ?? null;

  const isTreatment = task.source === "TREATMENT";

  const canMarkDone = status === "PLANNED";
  const canReopen = status === "DONE";
  const canCancel = status === "PLANNED";

  async function askComment(label: string): Promise<string | null> {
    const value = await prompt({
      title: "Comentário",
      label,
    });
    return value;
  }

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

          {isTreatment && (
            <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-medium">
              Tratamento clínico
            </span>
          )}

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

  {isTreatment && (
    <span className="inline-flex items-center rounded-full bg-blue-600 text-white px-2 py-0.5 text-xs font-semibold">
      Tratamento
    </span>
  )}

  {dueSoon && status === "PLANNED" && (
    <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-medium">
      Atrasada
    </span>
  )}
</div>



{/*           {isTreatment && (
            <div className="text-xs text-zinc-500 space-y-0.5">
              {task.treatment_public_id && (
                <div>
                  Tratamento ID:{" "}
                  <span className="font-mono">
                    {task.treatment_public_id}
                  </span>
                </div>
              )}

              {task.treatment_schedule_public_id && (
                <div>
                  Medicação ID:{" "}
                  <span className="font-mono">
                    {task.treatment_schedule_public_id}
                  </span>
                </div>
              )}
            </div>
          )} */}

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
                const c = await askComment("Comentário (opcional):");
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
                const c = await askComment("Motivo da reabertura:");
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
                const ok = await confirm({
                  title: "Cancelar tarefa?",
                  message: "Cancelar esta tarefa?",
                });
                if (!ok) return;

                const c = await askComment("Motivo (opcional):");
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