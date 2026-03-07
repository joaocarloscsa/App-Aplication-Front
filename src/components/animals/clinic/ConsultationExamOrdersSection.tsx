"use client";

import { useConsultationExamOrders } from "@/components/animals/clinic/hooks/useConsultationExamOrders";
import { AnimalExamOrderCreateForm } from "@/components/animals/clinic/AnimalExamOrderCreateForm";
import { ExamOrderCard } from "@/components/animals/clinic/ExamOrderCard";
import type { ClinicalExamOrderItem } from "@/types/clinicalExamOrders";

export function ConsultationExamOrdersSection({
  consultationPublicId,
}: {
  consultationPublicId: string;
}) {
  const { items, loading, error, reload } =
    useConsultationExamOrders(consultationPublicId);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-zinc-700">
          Pedidos de exame
        </h3>

        <AnimalExamOrderCreateForm
          consultationPublicId={consultationPublicId}
          onCreated={reload}
        />
      </div>

      {loading && (
        <p className="text-sm text-zinc-500">
          Carregando pedidos…
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="text-sm text-zinc-500">
          Nenhum exame solicitado nesta consulta.
        </p>
      )}

      <div className="grid gap-3">
        {items.map((i: ClinicalExamOrderItem) => (
          <ExamOrderCard
            key={i.public_id}
            item={i}
            onUpdated={reload}
          />
        ))}
      </div>
    </section>
  );
}