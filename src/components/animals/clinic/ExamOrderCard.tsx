// /var/www/GSA/animal/frontend/src/components/animals/clinic/ExamOrderCard.tsx
"use client";

import { useState } from "react";
import type { ClinicalExamOrderItem } from "@/types/clinicalExamOrders";
import {
  uploadClinicalExamResult,
} from "@/services/clinicalExamOrders";

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

export function ExamOrderCard({
  item,
  onUpdated,
}: {
  item: ClinicalExamOrderItem;
  onUpdated?: () => void;
}) {

  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    try {
      setUploading(true);

      await uploadClinicalExamResult(
        item.public_id,
        file
      );

      onUpdated?.();

    } catch (e) {
      console.error(e);
      alert("Erro ao enviar resultado.");
    } finally {
      setUploading(false);
    }
  }





return (
  <div className="rounded-xl border bg-white p-5 space-y-5 shadow-sm">

    {/* HEADER */}
    <div className="flex items-start justify-between">

      <div>
        <p className="text-base font-semibold text-zinc-900">
          {item.exam_type?.name}
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


    {/* METADADOS */}
    <div className="text-xs text-zinc-500">
      <span className="font-medium text-zinc-700">
        Data do pedido:
      </span>{" "}
      {new Date(item.requested_at).toLocaleString()}
    </div>


    {/* JUSTIFICATIVA */}
    <div>
      <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wide mb-1">
        Justificativa clínica
      </p>

      <p className="text-sm text-zinc-800 whitespace-pre-line">
        {item.justification}
      </p>
    </div>


    {/* HIPÓTESE */}
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


    {/* PARÂMETROS */}
    {item.parameters?.length > 0 && (
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
    )}


    {/* CONFIGURAÇÃO */}
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


    {/* RESULTADO */}
    {item.status === "REQUESTED" && (
      <div className="flex items-center justify-between border-t pt-4">

        <span className="text-sm text-zinc-600">
          Resultado do exame
        </span>

        <input
          type="file"
          id={`upload-${item.public_id}`}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleUpload(file);
              e.currentTarget.value = "";
            }
          }}
        />

        <label
          htmlFor={`upload-${item.public_id}`}
          className="text-xs px-3 py-1.5 bg-zinc-900 text-white rounded-md cursor-pointer hover:bg-zinc-800 transition"
        >
          Enviar resultado
        </label>

      </div>
    )}

    {item.status === "VALIDATED" && (
      <div className="text-xs text-green-700 font-medium border-t pt-3">
        ✓ Exame validado
      </div>
    )}

  </div>
);
}