// path: src/components/animals/clinic/ConsultationCard.tsx

"use client";

import { useState } from "react";
import { ConsultationHeader } from "./ConsultationHeader";
import { ConsultationSOAP } from "./ConsultationSOAP";
import { ConsultationFormFields } from "./ConsultationFormFields";

type Props = {
  consultation: any;
};

export function ConsultationCard({ consultation }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-white">
      {/* HEADER CLICÁVEL */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 hover:bg-zinc-50 transition"
      >
        <ConsultationHeader
          type={consultation.type}
          status={consultation.status}
          dateTime={consultation.date_time}
          createdByName={consultation.created_by?.name}
        />

        {/* preview curto */}
        <div className="mt-2 text-sm text-zinc-600">
          {consultation.chief_complaint}
        </div>

        <div className="text-xs text-zinc-400 mt-1">
          {open ? "▲ Ocultar detalhes" : "▼ Ver detalhes"}
        </div>
      </button>

      {/* CONTEÚDO SOAP */}
      {open && (
        <div className="px-4 pb-4 border-t">

<ConsultationFormFields
  readOnly

  chiefComplaint={consultation.chief_complaint ?? ""}
  clinicalFindings={consultation.clinical_findings ?? ""}
  diagnosticImpression={consultation.diagnostic_impression ?? ""}
  conduct={consultation.conduct ?? ""}

  temperature={consultation.temperature?.toString() ?? ""}
  heartRate={consultation.heart_rate?.toString() ?? ""}
  respiratoryRate={consultation.respiratory_rate?.toString() ?? ""}
  weight={consultation.weight?.toString() ?? ""}
/>
        </div>
      )}
    </div>
  );
}