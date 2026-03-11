"use client";

import type { ClinicalProblemTimelineEventDTO } from "@/services/clinicalProblems";

type Props = {
  items: ClinicalProblemTimelineEventDTO[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderMetadata(
  metadata?: Record<string, unknown> | null
): React.ReactNode {
  if (!metadata || typeof metadata !== "object") {
    return null;
  }

  const oldDiagnosis =
    typeof metadata.old_diagnosis === "string"
      ? metadata.old_diagnosis
      : null;
  const newDiagnosis =
    typeof metadata.new_diagnosis === "string"
      ? metadata.new_diagnosis
      : null;

  if (oldDiagnosis !== null || newDiagnosis !== null) {
    return (
      <div className="text-xs text-zinc-600">
        <span className="font-medium text-zinc-700">Diagnóstico:</span>{" "}
        {(oldDiagnosis || "não definido")} → {newDiagnosis || "não definido"}
      </div>
    );
  }

  const oldStatus =
    metadata.old_status &&
    typeof metadata.old_status === "object" &&
    typeof (metadata.old_status as any).label === "string"
      ? String((metadata.old_status as any).label)
      : null;

  const newStatus =
    metadata.new_status &&
    typeof metadata.new_status === "object" &&
    typeof (metadata.new_status as any).label === "string"
      ? String((metadata.new_status as any).label)
      : null;

  if (oldStatus !== null || newStatus !== null) {
    return (
      <div className="text-xs text-zinc-600">
        <span className="font-medium text-zinc-700">Status:</span>{" "}
        {(oldStatus || "não definido")} → {newStatus || "não definido"}
      </div>
    );
  }

  return null;
}

function renderConsultationClinicalFields(
  preview?: ClinicalProblemTimelineEventDTO["consultation_preview"]
) {
  if (!preview) return null;

  if (!preview.chief_complaint && !preview.clinical_exam) {
    return null;
  }

  return (
    <div className="mt-3 rounded border bg-zinc-50 p-3 text-xs text-zinc-700 space-y-2">
      {preview.chief_complaint && (
        <div>
          <div className="font-medium text-zinc-800">
            Queixa principal
          </div>
          <div>{preview.chief_complaint}</div>
        </div>
      )}

      {preview.clinical_exam && (
        <div>
          <div className="font-medium text-zinc-800">
            Exame clínico
          </div>
          <div>{preview.clinical_exam}</div>
        </div>
      )}
    </div>
  );
}




export function ProblemTimeline({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-4 text-sm text-zinc-500">
        Nenhum evento registrado para este problema.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.public_id}
          className="rounded-lg border bg-white p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-zinc-900">
                {item.title}
              </p>

              <p className="text-xs text-zinc-500">
                {item.type.label}
              </p>
            </div>

            <div className="text-right text-xs text-zinc-500">
              <p>{formatDate(item.occurred_at)}</p>
              {item.created_by?.name ? <p>{item.created_by.name}</p> : null}
            </div>
          </div>

          {item.description ? (
            <p className="mt-3 whitespace-pre-line text-sm text-zinc-700">
              {item.description}
            </p>
          ) : null}

          {renderMetadata(item.metadata)}
{renderConsultationClinicalFields(item.consultation_preview)}

        </div>
      ))}
    </div>
  );
}
