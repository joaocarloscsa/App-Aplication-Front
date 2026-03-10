"use client";

import { useState } from "react";
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

  const [open, setOpen] = useState(false);

  const examCount = item.requests?.length ?? 0;

  return (
    <div className="rounded-xl border bg-white shadow-sm">

      {/* HEADER */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 space-y-3 hover:bg-zinc-50"
      >

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

        <div className="flex gap-6 text-xs text-zinc-500">

          <div>
            <span className="font-medium text-zinc-700">
              Pedido em:
            </span>{" "}
            {item.requested_at
              ? new Date(item.requested_at).toLocaleString()
              : "-"}
          </div>

          <div>
            <span className="font-medium text-zinc-700">
              Prioridade:
            </span>{" "}
            {item.priority === "URGENT" ? "Urgente" : "Rotina"}
          </div>

          {item.laboratory && (
            <div>
              <span className="font-medium text-zinc-700">
                Laboratório:
              </span>{" "}
              {item.laboratory}
            </div>
          )}

        </div>

      </button>

      {/* BODY */}
      {open && item.requests?.length ? (

        <div className="border-t px-5 pb-5 space-y-3">

          <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wide pt-4">
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