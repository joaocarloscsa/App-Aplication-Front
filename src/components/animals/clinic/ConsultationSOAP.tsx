// path: src/components/animals/clinic/ConsultationSOAP.tsx

"use client";

import { ConsultationVitals } from "./ConsultationVitals";

type Props = {
  chiefComplaint: string;
  clinicalFindings?: string | null;
  diagnosticImpression: string;
  conduct: string;
  temperature?: number | null;
  heartRate?: number | null;
  respiratoryRate?: number | null;
  weight?: number | null;
};

function textOrEmpty(v?: string | null) {
  if (!v || v.trim() === "") {
    return (
      <p className="text-sm text-zinc-400">
        Não registrado
      </p>
    );
  }

  return (
    <p className="text-sm text-zinc-900 whitespace-pre-line">
      {v}
    </p>
  );
}

export function ConsultationSOAP({
  chiefComplaint,
  clinicalFindings,
  diagnosticImpression,
  conduct,
  temperature,
  heartRate,
  respiratoryRate,
  weight,
}: Props) {
  return (
    <div className="space-y-6">
      {/* S */}
      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">
          S — Subjetivo
        </p>

        <p className="text-xs text-zinc-500 mb-1">
          Queixa principal
        </p>

        {textOrEmpty(chiefComplaint)}
      </div>

      {/* O */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-zinc-500 uppercase">
          O — Objetivo
        </p>

        <div>
          <p className="text-xs text-zinc-500 mb-1">
            Exame clínico
          </p>

          {textOrEmpty(clinicalFindings)}
        </div>

        <ConsultationVitals
          temperature={temperature}
          heartRate={heartRate}
          respiratoryRate={respiratoryRate}
          weight={weight}
        />
      </div>

      {/* A */}
      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">
          A — Avaliação
        </p>

        {textOrEmpty(diagnosticImpression)}
      </div>

      {/* P */}
      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">
          P — Plano
        </p>

        {textOrEmpty(conduct)}
      </div>
    </div>
  );
}
