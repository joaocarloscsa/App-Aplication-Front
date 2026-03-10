// path: src/app/(protected)/dashboard/animals/[animalId]/clinic/consultations/[consultationId]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  fetchConsultationDetails,
  ConsultationDetailsDTO,
} from "@/services/animalConsultations";

import { ConsultationHeader } from "@/components/animals/clinic/ConsultationHeader";
import { ConsultationSOAP } from "@/components/animals/clinic/ConsultationSOAP";
import { ConsultationNotesSection } from "@/components/animals/clinic/ConsultationNotesSection";
import { ExamOrderCard } from "@/components/animals/clinic/ExamOrderCard";

export default function ConsultationPage() {

  const params = useParams();

  const consultationId =
    typeof params.consultationId === "string"
      ? params.consultationId
      : params.consultationId?.[0];

  const [data, setData] = useState<ConsultationDetailsDTO | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!consultationId) return;

    const res = await fetchConsultationDetails(consultationId);
    setData(res);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [consultationId]);

  if (loading) {
    return <div className="text-sm text-zinc-500">Carregando…</div>;
  }

  if (!data) return null;

  const c = data.consultation;

  return (
    <div className="space-y-6">
      <ConsultationHeader
        type={c.type}
        status={c.status}
        dateTime={c.date_time}
        createdByName={c.created_by?.name}
      />

      <ConsultationSOAP
        chiefComplaint={c.chief_complaint}
        clinicalFindings={c.clinical_findings}
        diagnosticImpression={c.diagnostic_impression}
        conduct={c.conduct}
        temperature={c.temperature}
        heartRate={c.heart_rate}
        respiratoryRate={c.respiratory_rate}
        weight={c.weight}
      />

      <ConsultationNotesSection
        consultationPublicId={c.public_id}
        notes={data.notes}
        onCreated={load}
      />

      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-zinc-700">
          Pedidos de exame
        </h3>

        {data.exam_orders.map((order) => (
          <ExamOrderCard key={order.public_id} item={order} />
        ))}
      </section>
    </div>
  );
}