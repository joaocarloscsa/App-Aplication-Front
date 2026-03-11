"use client";

import type { AnimalTaskItem } from "@/types/agenda";

type Props = {
  task: AnimalTaskItem;
};

function mapActionLabel(action: string) {
  switch (action) {
    case "completed":
      return "Concluída";
    case "canceled":
      return "Cancelada";
    case "reopened":
      return "Reaberta";
    default:
      return action;
  }
}

function mapSourceLabel(source?: string | null) {
  if (!source) return null;

  switch (source) {
    case "TREATMENT":
      return "Tratamento";
    case "SYSTEM":
      return "Sistema";
    case "MANUAL":
      return "Manual";
    default:
      return source;
  }
}

export function AnimalTaskExpanded({ task }: Props) {
  const isTreatment = task.source === "TREATMENT";

  return (
    <div className="border-t pt-3 text-xs text-zinc-600 space-y-1">
      {isTreatment && (
        <div className="pt-1 space-y-1 text-zinc-500">
          {task.treatment_public_id && (
            <p>
              <strong>Tratamento:</strong>{" "}
              <span className="font-mono">
                {task.treatment_public_id}
              </span>
            </p>
          )}

          {task.treatment_schedule_public_id && (
            <p>
              <strong>Medicação:</strong>{" "}
              <span className="font-mono">
                {task.treatment_schedule_public_id}
              </span>
            </p>
          )}
        </div>
      )}

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
            {mapActionLabel(task.last_action.action)}
          </p>

          {task.last_action.by?.name && (
            <p>
              <strong>Por:</strong>{" "}
              {task.last_action.by.name}
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

          {task.last_action.source &&
            task.last_action.source !== "MANUAL" && (
              <p className="text-zinc-500">
                <strong>Origem:</strong>{" "}
                {mapSourceLabel(
                  task.last_action.source
                )}
              </p>
            )}
        </>
      )}
    </div>
  );
}
