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

function priorityLabel(priority: ClinicalExamOrderItem["priority"]) {
  switch (priority) {
    case "URGENT":
      return "Urgente";
    case "ROUTINE":
      return "Rotina";
    default:
      return priority;
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
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold text-zinc-900">{item.exam_type}</p>

          <p className="text-xs text-zinc-500">
            Pedido {item.public_id}
          </p>

          <p className="text-xs text-zinc-500">
            {item.requested_at ? new Date(item.requested_at).toLocaleString() : ""}
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
        <span className="rounded border bg-zinc-50 px-2 py-0.5">
          Prioridade: {priorityLabel(item.priority)}
        </span>

        {item.laboratory && (
          <span className="rounded border bg-zinc-50 px-2 py-0.5">
            Laboratório: {item.laboratory}
          </span>
        )}

        {item.consultation?.public_id && (
          <span className="rounded border bg-zinc-50 px-2 py-0.5">
            Consulta: {item.consultation.public_id}
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