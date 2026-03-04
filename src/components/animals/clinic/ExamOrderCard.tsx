// path: frontend/src/components/animals/clinic/ExamOrderCard.tsx
"use client";

import type { ClinicalExamOrderItem } from "@/types/clinicalExamOrders";

function statusLabel(status: ClinicalExamOrderItem["status"]) {
  switch (status) {
    case "REQUESTED":
      return "Solicitado";
    case "COLLECTED":
      return "Coletado";
    case "RECEIVED":
      return "Recebido";
    case "VALIDATED":
      return "Validado";
    default:
      return status;
  }
}

function statusBadge(status: ClinicalExamOrderItem["status"]) {
  switch (status) {
    case "REQUESTED":
      return "bg-zinc-100 text-zinc-800";
    case "COLLECTED":
      return "bg-amber-100 text-amber-800";
    case "RECEIVED":
      return "bg-blue-100 text-blue-800";
    case "VALIDATED":
      return "bg-green-100 text-green-800";
    default:
      return "bg-zinc-100 text-zinc-800";
  }
}

export function ExamOrderCard({ item }: { item: ClinicalExamOrderItem }) {
  return (
    <div className="rounded-lg border bg-white p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-900 truncate">
            {item.exam_type}
          </p>

          <p className="text-xs text-zinc-500">
            {item.requested_at
              ? new Date(item.requested_at).toLocaleString()
              : ""}
          </p>
        </div>

        <span
          className={[
            "shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            statusBadge(item.status),
          ].join(" ")}
        >
          {statusLabel(item.status)}
        </span>
      </div>

      <div className="text-sm text-zinc-800 whitespace-pre-line">
        {item.justification}
      </div>

      {item.diagnostic_hypothesis && (
        <div className="text-xs text-zinc-600 whitespace-pre-line">
          <span className="font-medium">Hipótese:</span>{" "}
          {item.diagnostic_hypothesis}
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-xs text-zinc-600">
        <span className="rounded bg-zinc-50 border px-2 py-0.5">
          Prioridade: {item.priority}
        </span>

        {item.laboratory && (
          <span className="rounded bg-zinc-50 border px-2 py-0.5">
            Lab: {item.laboratory}
          </span>
        )}
      </div>

      {item.parameters?.length > 0 && (
        <div className="text-xs text-zinc-700">
          <span className="font-medium">Parâmetros:</span>{" "}
          {item.parameters.join(", ")}
        </div>
      )}
    </div>
  );
}
