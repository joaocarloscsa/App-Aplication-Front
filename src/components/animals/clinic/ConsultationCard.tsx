"use client";

import { useState } from "react";
import { ConsultationHeader } from "./ConsultationHeader";
import { ConsultationFormFields } from "./ConsultationFormFields";
import { AnimalExamOrderCreateForm } from "./AnimalExamOrderCreateForm";
import { useConsultationExamOrders } from "@/components/animals/clinic/hooks/useConsultationExamOrders";
import { ExamOrderCard } from "./ExamOrderCard";
import { ConsultationNotesSection } from "./ConsultationNotesSection";

type Props = {
  consultation: any;
  animalPublicId: string;
};

export function ConsultationCard({ consultation, animalPublicId }: Props) {
  const [open, setOpen] = useState(false);

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

          <ConsultationNotesSection
            consultationPublicId={consultation.public_id}
            notes={consultation.notes ?? []}
            onCreated={() => {}}
          />

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xs font-semibold text-zinc-700">
                Pedidos de exame
              </h3>

              <AnimalExamOrderCreateForm
                consultationPublicId={consultation.public_id}
                onCreated={reloadExamOrders}
              />
            </div>

            {examOrdersLoading && (
              <p className="text-xs text-zinc-500">Carregando pedidos…</p>
            )}

            {examOrdersError && (
              <p className="text-xs text-red-600">{examOrdersError}</p>
            )}

            {!examOrdersLoading && !examOrdersError && examOrders.length === 0 && (
              <p className="text-xs text-zinc-500">
                Nenhum exame solicitado nesta consulta.
              </p>
            )}

            <div className="grid gap-3">
              {examOrders.map((order) => (
                <ExamOrderCard
                  key={order.public_id}
                  item={order}
                  onUpdated={reloadExamOrders}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}