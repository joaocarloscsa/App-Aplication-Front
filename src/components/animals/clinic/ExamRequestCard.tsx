"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  ClinicalExamRequestItem,
  ClinicalExamRequestStatus,
  ClinicalExamResultItem,
} from "@/types/clinicalExamOrders";

import {
  uploadClinicalExamResult,
  validateClinicalExamResult,
  deleteClinicalExamResult,
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

function deriveRequestStatus(
  results: ClinicalExamResultItem[] | undefined
): ClinicalExamRequestStatus {
  const safeResults = results ?? [];

  if (safeResults.length === 0) {
    return "REQUESTED";
  }

  const allValidated = safeResults.every((result) => result.validated === true);

  if (allValidated) {
    return "VALIDATED";
  }

  return "RECEIVED";
}

export function ExamRequestCard({
  request,
}: {
  request: ClinicalExamRequestItem;
}) {
  const { confirm } = useModal();

  const [localRequest, setLocalRequest] = useState<ClinicalExamRequestItem>(request);
  const [uploading, setUploading] = useState(false);
  const [validatingId, setValidatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setLocalRequest(request);
  }, [request]);

  const derivedStatus = useMemo(
    () => deriveRequestStatus(localRequest.results),
    [localRequest.results]
  );

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
        validated: false,
        validated_at: null,
        read_url: response.read_url ?? null,
      };

      setLocalRequest((prev) => {
        const nextResults = [...(prev.results ?? []), newResult];

        return {
          ...prev,
          status: deriveRequestStatus(nextResults),
          results: nextResults,
        };
      });

      await confirm({
        title: "Resultado enviado",
        message: "O arquivo foi enviado com sucesso.",
        confirmLabel: "OK",
        hideCancel: true,
      });
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
      confirmLabel: "Excluir",
      cancelLabel: "Cancelar",
      variant: "danger",
    });

    if (!ok) return;

    try {
      setDeletingId(result.public_id);

      const response = await deleteClinicalExamResult(result.public_id);

      setLocalRequest((prev) => {
        const nextResults =
          prev.results?.filter((r) => r.public_id !== result.public_id) ?? [];

        return {
          ...prev,
          status:
            (response?.exam_request_status as ClinicalExamRequestStatus | undefined) ??
            deriveRequestStatus(nextResults),
          results: nextResults,
        };
      });

      await confirm({
        title: "Resultado excluído",
        message: "O arquivo foi removido com sucesso.",
        confirmLabel: "OK",
        hideCancel: true,
      });
    } catch (e) {
      console.error(e);

      await confirm({
        title: "Erro",
        message: "Erro ao excluir resultado.",
        confirmLabel: "OK",
        hideCancel: true,
      });
    } finally {
      setDeletingId(null);
    }
  }

  async function handleValidate(result: ClinicalExamResultItem) {
    try {
      setValidatingId(result.public_id);

      const response = await validateClinicalExamResult(result.public_id);

      setLocalRequest((prev) => {
        const nextResults =
          prev.results?.map((item) =>
            item.public_id === result.public_id
              ? {
                  ...item,
                  validated: true,
                  validated_at: new Date().toISOString(),
                }
              : item
          ) ?? [];

        return {
          ...prev,
          status:
            (response?.exam_request_status as ClinicalExamRequestStatus | undefined) ??
            deriveRequestStatus(nextResults),
          results: nextResults,
        };
      });

      await confirm({
        title: "Resultado validado",
        message: "O arquivo foi validado com sucesso.",
        confirmLabel: "OK",
        hideCancel: true,
      });
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
            requestStatusBadge(derivedStatus),
          ].join(" ")}
        >
          {requestStatusLabel(derivedStatus)}
        </span>
      </div>

      <div className="text-xs text-zinc-500">
        ID: {localRequest.public_id}
      </div>

      {localRequest.results?.length ? (
        <div className="space-y-2">
          {localRequest.results.map((r) => {
            const isValidated = r.validated === true;
            const isValidating = validatingId === r.public_id;
            const isDeleting = deletingId === r.public_id;

            return (
              <div
                key={r.public_id}
                className="border rounded p-2 bg-white flex items-center justify-between gap-3"
              >
                <div className="text-xs text-zinc-700 flex-1 space-y-1">
                  <div className="font-medium">
                    {r.file_name}
                  </div>

                  {r.uploaded_at && (
                    <div className="text-zinc-400">
                      Enviado em {new Date(r.uploaded_at).toLocaleString()}
                    </div>
                  )}

                  {isValidated ? (
                    <div className="text-green-600 font-medium">
                      Validado
                      {r.validated_at
                        ? ` em ${new Date(r.validated_at).toLocaleString()}`
                        : ""}
                    </div>
                  ) : (
                    <div className="text-amber-600 font-medium">
                      Aguardando validação
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {r.read_url && (
                    <a
                      href={r.read_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Abrir
                    </a>
                  )}

                  {!isValidated && (
                    <button
                      type="button"
                      onClick={() => handleValidate(r)}
                      disabled={isValidating || isDeleting}
                      className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {isValidating ? "Validando..." : "Validar"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(r)}
                    disabled={isDeleting || isValidating}
                    className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {isDeleting ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              </div>
            );
          })}
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
            ? "bg-zinc-400 cursor-not-allowed text-white"
            : "bg-zinc-900 text-white cursor-pointer",
        ].join(" ")}
      >
        {uploading ? "Enviando..." : "Enviar resultado"}
      </label>
    </div>
  );
}