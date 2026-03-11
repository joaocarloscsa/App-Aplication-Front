"use client";

import { useState } from "react";
import { ConsultationHeader } from "./ConsultationHeader";
import { ConsultationFormFields } from "./ConsultationFormFields";
import { AnimalExamOrderCreateForm } from "./AnimalExamOrderCreateForm";
import { ProblemCreateForm } from "@/components/animals/clinic/problems/ProblemCreateForm";
import { useConsultationExamOrders } from "@/components/animals/clinic/hooks/useConsultationExamOrders";
import { ExamOrderCard } from "./ExamOrderCard";
import { ConsultationNotesSection } from "./ConsultationNotesSection";
import { useRouter } from "next/navigation";
import { ProblemLinkForm } from "@/components/animals/clinic/problems/ProblemLinkForm";
import { ConsultationExamOrdersSection } from "@/components/animals/clinic/ConsultationExamOrdersSection";

type Props = {
  consultation: any;
  animalPublicId: string;
};

export function ConsultationCard({ consultation, animalPublicId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);

  const {
    items: examOrders,
    loading: examOrdersLoading,
    error: examOrdersError,
    reload: reloadExamOrders,
  } = useConsultationExamOrders(consultation.public_id);

  return (
    <div className="rounded-lg border bg-white">
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

        <div className="mt-2 text-sm text-zinc-600">
          {consultation.chief_complaint}
        </div>

        <div className="text-xs text-zinc-400 mt-1">
          {open ? "▲ Ocultar detalhes" : "▼ Ver detalhes"}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t space-y-6">
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


            <ConsultationExamOrdersSection
    consultationPublicId={consultation.public_id}
  />
  
          <ConsultationNotesSection
            consultationPublicId={consultation.public_id}
            notes={consultation.notes ?? []}
            onCreated={() => { }}
          />

<section className="space-y-3">

  <div className="flex items-center justify-between">
    <h3 className="text-xs font-semibold text-zinc-700">
      Problemas clínicos
    </h3>

    <div className="flex gap-3">

      <button
        type="button"
        onClick={() => setShowProblemForm((v) => !v)}
        className="text-xs text-zinc-700 hover:underline"
      >
        + Abrir problema
      </button>

      <button
        type="button"
        onClick={() => setShowLinkForm((v) => !v)}
        className="text-xs text-blue-600 hover:underline"
      >
        + Associar problema
      </button>

    </div>
  </div>


  {consultation.problems?.length === 0 && (
    <p className="text-xs text-zinc-500">
      Nenhum problema associado.
    </p>
  )}


  {consultation.problems?.length > 0 && (

    <div className="space-y-2">

      {consultation.problems.map((p: any) => (

        <div
          key={p.public_id}
          className="rounded border bg-zinc-50 px-3 py-2"
        >

<div className="flex items-center justify-between">

  <span className="text-sm font-medium text-zinc-900">
    {p.title}
  </span>

  <span className="text-xs text-zinc-500">
    {p.status?.label}
  </span>

</div>

          <div className="text-xs text-zinc-500 mt-1">

            {p.opened_at && (
              <span>
                Associado em {new Date(p.opened_at).toLocaleString()}
              </span>
            )}

            {p.created_by?.name && (
              <span>
                {" • "}
                por {p.created_by.name}
              </span>
            )}

          </div>

        </div>

      ))}

    </div>

  )}


  {showProblemForm && (
    <ProblemCreateForm
      consultationPublicId={consultation.public_id}
      onCancel={() => setShowProblemForm(false)}
      onCreated={async (problemPublicId) => {
        setShowProblemForm(false);
        router.push(
          `/dashboard/animals/${animalPublicId}/clinic/problems/${problemPublicId}`
        );
      }}
    />
  )}


  {showLinkForm && (
    <ProblemLinkForm
      animalPublicId={animalPublicId}
      consultationPublicId={consultation.public_id}
      alreadyLinked={consultation.problems?.map((p: any) => p.public_id) ?? []}
      onLinked={() => setShowLinkForm(false)}
    />
  )}

</section>


        </div>
      )}
    </div>
  );
}