"use client";

import type { ClinicalExamOrderItem } from "@/types/clinicalExamOrders";
import { ExamRequestCard } from "./ExamRequestCard";

function statusLabel(status: ClinicalExamOrderItem["status"]) {
  switch (status) {
    case "REQUESTED":
      return "Solicitado";
    case "PARTIAL":
      return "Parcial";
    case "COMPLETED":
      return "Completo";
    default:
      return status;
  }
}

function statusBadge(status: ClinicalExamOrderItem["status"]) {
  switch (status) {
    case "REQUESTED":
      return "bg-zinc-100 text-zinc-800";
    case "PARTIAL":
      return "bg-amber-100 text-amber-800";
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    default:
      return "bg-zinc-100 text-zinc-800";
  }
}

export function ExamOrderCard({
  item,
  onUpdated,
}: {
  item: ClinicalExamOrderItem;
  onUpdated?: () => void;
}) {
  const examCount = item.requests?.length ?? 0;

  return (
    <div className="rounded-xl border bg-white p-5 space-y-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base font-semibold text-zinc-900">
            Pedido de exames ({examCount})
          </p>

          <p className="text-xs text-zinc-500">
            ID do pedido: {item.public_id}
          </p>
        </div>

        <span
          className={[
            "rounded-full px-3 py-1 text-xs font-semibold",
            statusBadge(item.status),
          ].join(" ")}
        >
          {statusLabel(item.status)}
        </span>
      </div>

      <div className="text-xs text-zinc-500">
        <span className="font-medium text-zinc-700">
          Data do pedido:
        </span>{" "}
        {item.requested_at
          ? new Date(item.requested_at).toLocaleString()
          : "-"}
      </div>

      <div>
        <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wide mb-1">
          Justificativa clínica
        </p>

        <p className="text-sm text-zinc-800 whitespace-pre-line">
          {item.justification}
        </p>
      </div>

      {item.diagnostic_hypothesis && (
        <div>
          <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wide mb-1">
            Hipótese diagnóstica
          </p>

          <p className="text-sm text-zinc-800">
            {item.diagnostic_hypothesis}
          </p>
        </div>
      )}

      {item.parameters?.length ? (
        <div>
          <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wide mb-2">
            Parâmetros solicitados
          </p>

          <div className="flex flex-wrap gap-2">
            {item.parameters.map((p) => (
              <span
                key={p}
                className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-4 text-sm border-t pt-3">
        <div>
          <span className="text-xs text-zinc-500 block">
            Prioridade
          </span>

          <span className="text-zinc-800 font-medium">
            {item.priority === "URGENT" ? "Urgente" : "Rotina"}
          </span>
        </div>

        {item.laboratory && (
          <div>
            <span className="text-xs text-zinc-500 block">
              Laboratório
            </span>

            <span className="text-zinc-800 font-medium">
              {item.laboratory}
            </span>
          </div>
        )}
      </div>

      {item.requests?.length ? (
        <div className="space-y-3 border-t pt-4">
          <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">
            Exames solicitados
          </p>

          {item.requests.map((request) => (
            <ExamRequestCard
              key={request.public_id}
              request={request}
              onUpdated={onUpdated}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}