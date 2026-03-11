// path: /var/www/GSA/animal/frontend/src/app/(protected)/dashboard/animals/[animalId]/clinic/consultations/[consultationId]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  fetchConsultationDetails,
  ConsultationDetailsDTO,
} from "@/services/animalConsultations";

import { ConsultationHeader } from "@/components/animals/clinic/ConsultationHeader";
import { ConsultationFormFields } from "@/components/animals/clinic/ConsultationFormFields";
import { ConsultationNotesSection } from "@/components/animals/clinic/ConsultationNotesSection";
import { ExamOrderCard } from "@/components/animals/clinic/ExamOrderCard";
import { ProblemCreateForm } from "@/components/animals/clinic/problems/ProblemCreateForm";
import { AnimalExamOrderCreateForm } from "@/components/animals/clinic/AnimalExamOrderCreateForm";
import { ProblemLinkForm } from "@/components/animals/clinic/problems/ProblemLinkForm";

export default function ConsultationPage() {
  const params = useParams();
  const router = useRouter();

  const consultationId =
    typeof params.consultationId === "string"
      ? params.consultationId
      : params.consultationId?.[0];

  const animalId =
    typeof params.animalId === "string"
      ? params.animalId
      : params.animalId?.[0];

  const [data, setData] = useState<ConsultationDetailsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProblemForm, setShowProblemForm] = useState(false);

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
    return (
      <div className="text-sm text-zinc-500">
        Carregando consulta…
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const c = data.consultation;

  return (
    <div className="space-y-6">

      <ConsultationHeader
        type={c.type}
        status={c.status}
        dateTime={c.date_time}
        createdByName={c.created_by?.name}
      />

      <ConsultationFormFields
        readOnly
        chiefComplaint={c.chief_complaint ?? ""}
        clinicalFindings={c.clinical_findings ?? ""}
        diagnosticImpression={c.diagnostic_impression ?? ""}
        conduct={c.conduct ?? ""}
        temperature={c.temperature?.toString() ?? ""}
        heartRate={c.heart_rate?.toString() ?? ""}
        respiratoryRate={c.respiratory_rate?.toString() ?? ""}
        weight={c.weight?.toString() ?? ""}
      />

<section className="space-y-3">

  <div className="flex items-center justify-between gap-3">

    <h3 className="text-xs font-semibold text-zinc-700">
      Problemas clínicos
    </h3>

    <button
      type="button"
      onClick={() => setShowProblemForm((v) => !v)}
      className="text-xs text-zinc-700 hover:underline"
    >
      + Abrir problema
    </button>

  </div>

  {data.problems.length === 0 && (
    <p className="text-xs text-zinc-500">
      Nenhum problema associado a esta consulta.
    </p>
  )}

  {data.problems.map((p) => (
    <div
      key={p.public_id}
      className="text-sm border-l-2 border-zinc-300 pl-3 py-1"
    >
      {p.title}
    </div>
  ))}

  {animalId && (
<ProblemLinkForm
  animalPublicId={animalId}
  consultationPublicId={c.public_id}
  alreadyLinked={data.problems.map((p) => p.public_id)}
  onLinked={load}
/>
  )}

</section>

      <ConsultationNotesSection
        consultationPublicId={c.public_id}
        notes={data.notes}
        onCreated={load}
      />

<section className="space-y-3">

  <div className="flex items-center justify-between gap-3">

    <h3 className="text-xs font-semibold text-zinc-700">
      Pedidos de exame
    </h3>

    <AnimalExamOrderCreateForm
      consultationPublicId={c.public_id}
      animalPublicId={animalId}
      onCreated={load}
    />

  </div>

  {data.exam_orders.length === 0 && (
    <p className="text-xs text-zinc-500">
      Nenhum exame solicitado nesta consulta.
    </p>
  )}

  {data.exam_orders.map((order) => (
    <ExamOrderCard
      key={order.public_id}
      item={order}
    />
  ))}

</section>

    </div>
  );
}