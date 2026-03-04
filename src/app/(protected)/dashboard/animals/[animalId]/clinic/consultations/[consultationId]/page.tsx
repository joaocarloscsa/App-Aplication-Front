"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { http, HttpError } from "@/services/http";
import { useModal } from "@/components/ui/modal/ModalProvider";

type ConsultationDetailsDTO = {
  public_id: string;
  type: string;
  status: string;
  date_time: string;

  chief_complaint: string;
  history_of_present_illness?: string | null;
  relevant_history?: string | null;

  temperature?: number | null;
  heart_rate?: number | null;
  respiratory_rate?: number | null;
  weight?: number | null;

  clinical_findings?: string | null;

  diagnostic_impression: string;
  differential_diagnoses?: string | null;

  conduct: string;
  instructions?: string | null;

  created_at: string;

  created_by?: {
    person_public_id: string;
    name: string;
  } | null;
};

async function fetchConsultation(
  consultationId: string
): Promise<ConsultationDetailsDTO> {
  return http(
    `/api/v1/clinical-consultations/${consultationId}`
  );
}

export default function ConsultationDetailsPage() {
  const { consultationId } = useParams<{
    consultationId: string;
  }>();

  const [consultation, setConsultation] =
    useState<ConsultationDetailsDTO | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { confirm } = useModal();

  async function load() {
    try {
      const data = await fetchConsultation(consultationId);
      setConsultation(data);
      setError(null);
    } catch (e) {
      if (e instanceof HttpError) {
        const code = (e.body as any)?.error ?? null;

        if (code === "not_found") {
          setError("Consulta não encontrada.");
          return;
        }

        if (code === "unauthenticated") {
          setError("Sessão expirada.");
          return;
        }
      }

      setError("Erro ao carregar consulta.");
    }
  }

  useEffect(() => {
    load()
      .catch(() => setError("Erro ao carregar consulta."))
      .finally(() => setLoading(false));
  }, [consultationId]);

  if (loading) {
    return (
      <p className="text-sm text-zinc-500">
        Carregando consulta…
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-600">
        {error}
      </p>
    );
  }

  if (!consultation) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="border-b pb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">
            Consulta clínica
          </h2>

          <span className="text-xs text-zinc-500">
            {new Date(
              consultation.date_time
            ).toLocaleString()}
          </span>
        </div>

        {consultation.created_by && (
          <p className="text-xs text-zinc-500 mt-1">
            Registrado por {consultation.created_by.name}
          </p>
        )}
      </div>

      {/* S — Subjetivo */}
      <section className="space-y-2">
        <h3 className="text-xs font-semibold text-zinc-700">
          Queixa principal
        </h3>

        <p className="text-sm text-zinc-800">
          {consultation.chief_complaint}
        </p>

        {consultation.history_of_present_illness && (
          <div>
            <p className="text-xs font-semibold text-zinc-700">
              História da doença atual
            </p>

            <p className="text-sm text-zinc-800">
              {consultation.history_of_present_illness}
            </p>
          </div>
        )}

        {consultation.relevant_history && (
          <div>
            <p className="text-xs font-semibold text-zinc-700">
              Histórico relevante
            </p>

            <p className="text-sm text-zinc-800">
              {consultation.relevant_history}
            </p>
          </div>
        )}
      </section>

      {/* O — Objetivo */}
      <section className="space-y-2">
        <h3 className="text-xs font-semibold text-zinc-700">
          Exame clínico
        </h3>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {consultation.temperature && (
            <p>
              Temperatura:{" "}
              <span className="font-medium">
                {consultation.temperature} °C
              </span>
            </p>
          )}

          {consultation.heart_rate && (
            <p>
              FC:{" "}
              <span className="font-medium">
                {consultation.heart_rate} bpm
              </span>
            </p>
          )}

          {consultation.respiratory_rate && (
            <p>
              FR:{" "}
              <span className="font-medium">
                {consultation.respiratory_rate} rpm
              </span>
            </p>
          )}

          {consultation.weight && (
            <p>
              Peso:{" "}
              <span className="font-medium">
                {consultation.weight} kg
              </span>
            </p>
          )}
        </div>

        {consultation.clinical_findings && (
          <p className="text-sm text-zinc-800">
            {consultation.clinical_findings}
          </p>
        )}
      </section>

      {/* A — Avaliação */}
      <section className="space-y-2">
        <h3 className="text-xs font-semibold text-zinc-700">
          Avaliação
        </h3>

        <p className="text-sm text-zinc-800">
          {consultation.diagnostic_impression}
        </p>

        {consultation.differential_diagnoses && (
          <div>
            <p className="text-xs font-semibold text-zinc-700">
              Diagnósticos diferenciais
            </p>

            <p className="text-sm text-zinc-800">
              {consultation.differential_diagnoses}
            </p>
          </div>
        )}
      </section>

      {/* P — Plano */}
      <section className="space-y-2">
        <h3 className="text-xs font-semibold text-zinc-700">
          Conduta
        </h3>

        <p className="text-sm text-zinc-800">
          {consultation.conduct}
        </p>

        {consultation.instructions && (
          <div>
            <p className="text-xs font-semibold text-zinc-700">
              Instruções
            </p>

            <p className="text-sm text-zinc-800">
              {consultation.instructions}
            </p>
          </div>
        )}
      </section>

      {/* Ações futuras */}
      <div className="pt-4 border-t">
        <button
          type="button"
          onClick={async () =>
            await confirm({
              title: "Funcionalidade em breve",
              message:
                "Problemas clínicos e exames serão adicionados nesta tela.",
              confirmLabel: "OK",
              hideCancel: true,
            })
          }
          className="text-xs text-zinc-600 hover:underline"
        >
          + Adicionar problema clínico
        </button>
      </div>
    </div>
  );
}
