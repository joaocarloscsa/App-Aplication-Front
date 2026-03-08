"use client";

import { useState } from "react";

import type {
  ClinicalExamRequestItem,
  ClinicalExamResultItem
} from "@/types/clinicalExamOrders";

import {
  uploadClinicalExamResult,
  validateClinicalExamResult,
  deleteClinicalExamResult
} from "@/services/clinicalExamOrders";

import { useModal } from "@/components/ui/modal/ModalProvider";

function requestStatusLabel(status: ClinicalExamRequestItem["status"]) {
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

function requestStatusBadge(status: ClinicalExamRequestItem["status"]) {
  switch (status) {
    case "REQUESTED":
      return "bg-zinc-100 text-zinc-800";
    case "COLLECTED":
      return "bg-blue-100 text-blue-800";
    case "RECEIVED":
      return "bg-amber-100 text-amber-800";
    case "VALIDATED":
      return "bg-green-100 text-green-800";
    default:
      return "bg-zinc-100 text-zinc-800";
  }
}

export function ExamRequestCard({
  request,
}: {
  request: ClinicalExamRequestItem;
}) {

  const { confirm } = useModal();

  const [localRequest, setLocalRequest] = useState(request);

  const [uploading, setUploading] = useState(false);
  const [validatingId, setValidatingId] = useState<string | null>(null);

  async function handleUpload(file: File) {

    try {

      setUploading(true);

      const response = await uploadClinicalExamResult(
        localRequest.public_id,
        file
      );

const newResult: ClinicalExamResultItem = {
  public_id: response.result_public_id ?? response.public_id,
  file_name: file.name,
  uploaded_at: new Date().toISOString(),
  read_url: response.read_url ?? null
};

      setLocalRequest(prev => ({
        ...prev,
        status: "RECEIVED",
        results: [...(prev.results ?? []), newResult]
      }));

    } catch (e) {

      console.error(e);

      await confirm({
        title: "Erro",
        message: "Erro ao enviar resultado.",
        confirmLabel: "OK",
        hideCancel: true,
      });

    } finally {

      setUploading(false);

    }
  }

  async function handleDelete(result: ClinicalExamResultItem) {

    const ok = await confirm({
      title: "Excluir resultado?",
      message: "Esta ação não pode ser desfeita.",
      variant: "danger",
    });

    if (!ok) return;

    try {

      await deleteClinicalExamResult(result.public_id);

      setLocalRequest(prev => {

        const newResults = prev.results?.filter(
          r => r.public_id !== result.public_id
        ) ?? [];

        return {
          ...prev,
          status: newResults.length ? prev.status : "REQUESTED",
          results: newResults
        };

      });

    } catch (e) {

      console.error(e);

      await confirm({
        title: "Erro",
        message: "Erro ao excluir resultado.",
        confirmLabel: "OK",
        hideCancel: true,
      });

    }

  }

  async function handleValidate(result: ClinicalExamResultItem) {

    try {

      setValidatingId(result.public_id);

      await validateClinicalExamResult(result.public_id);

      setLocalRequest(prev => ({
        ...prev,
        status: "VALIDATED"
      }));

    } catch (e) {

      console.error(e);

      await confirm({
        title: "Erro",
        message: "Erro ao validar exame.",
        confirmLabel: "OK",
        hideCancel: true,
      });

    } finally {

      setValidatingId(null);

    }
  }

  return (

    <div className="border rounded-lg p-3 bg-zinc-50 space-y-3">

      <div className="flex items-center justify-between">

        <span className="font-medium text-zinc-900">
          {localRequest.exam_type.name}
        </span>

        <span
          className={[
            "text-xs font-semibold px-2 py-1 rounded",
            requestStatusBadge(localRequest.status)
          ].join(" ")}
        >
          {requestStatusLabel(localRequest.status)}
        </span>

      </div>

      <div className="text-xs text-zinc-500">
        ID: {localRequest.public_id}
      </div>

      {localRequest.results?.length ? (

        <div className="space-y-2">

          {localRequest.results.map((r) => (

            <div
              key={r.public_id}
              className="border rounded p-2 bg-white flex items-center justify-between gap-3"
            >

              <div className="text-xs text-zinc-700 flex-1">

                <div className="font-medium">
                  {r.file_name}
                </div>

                {r.uploaded_at && (
                  <div className="text-zinc-400">
                    Enviado em {new Date(r.uploaded_at).toLocaleString()}
                  </div>
                )}

              </div>

              <div className="flex items-center gap-2">

                {r.read_url && (
                  <a
                    href={r.read_url}
                    target="_blank"
                    className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Abrir
                  </a>
                )}

                {localRequest.status !== "VALIDATED" && (
                  <button
                    onClick={() => handleValidate(r)}
                    disabled={validatingId === r.public_id}
                    className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {validatingId === r.public_id ? "Validando..." : "Validar"}
                  </button>
                )}

                <button
                  onClick={() => handleDelete(r)}
                  className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Excluir
                </button>

              </div>

            </div>

          ))}

        </div>

      ) : (

        <div className="text-xs text-zinc-400">
          Nenhum resultado enviado
        </div>

      )}

      <input
        type="file"
        id={`upload-${localRequest.public_id}`}
        className="hidden"
        disabled={uploading}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {

          const file = e.target.files?.[0];

          if (!file) return;

          handleUpload(file);

          e.currentTarget.value = "";

        }}
      />

      <label
        htmlFor={`upload-${localRequest.public_id}`}
        className={[
          "inline-block text-xs px-3 py-1 rounded",
          uploading
            ? "bg-zinc-400 cursor-not-allowed"
            : "bg-zinc-900 text-white cursor-pointer"
        ].join(" ")}
      >
        {uploading ? "Enviando..." : "Enviar resultado"}
      </label>

    </div>

  );

}