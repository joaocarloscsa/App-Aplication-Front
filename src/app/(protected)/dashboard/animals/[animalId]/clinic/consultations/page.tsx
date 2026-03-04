"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useAnimalConsultations } from "@/hooks/useAnimalConsultations";
import { ConsultationCard } from "@/components/animals/clinic/ConsultationCard";
import { AnimalConsultationCreateForm } from "@/components/animals/clinic/AnimalConsultationCreateForm";
import { useModal } from "@/components/ui/modal/ModalProvider";

export default function AnimalConsultationsPage() {
  const { animalId } = useParams<{ animalId: string }>();

  const { consultations, loading, error, reload } =
    useAnimalConsultations(animalId);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const { confirm } = useModal();

  if (loading) {
    return (
      <p className="text-sm text-zinc-500">
        Carregando consultas…
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

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900">
          Consultas clínicas
        </h2>

        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="text-sm font-medium text-zinc-900 hover:underline"
        >
          + Nova consulta
        </button>
      </div>

      {/* FORM */}
      {showCreateForm && (
        <AnimalConsultationCreateForm
          animalPublicId={animalId}
          onCancel={() => setShowCreateForm(false)}
          onCreated={async () => {
            await reload();
            setShowCreateForm(false);

            await confirm({
              title: "Consulta registrada",
              message: "A consulta foi criada com sucesso.",
              confirmLabel: "OK",
              hideCancel: true,
            });
          }}
        />
      )}

      {/* EMPTY */}
      {consultations.length === 0 && (
        <p className="text-sm text-zinc-500">
          Nenhuma consulta registrada para este animal.
        </p>
      )}

      {/* LIST */}
      {consultations.map((c) => (
        <ConsultationCard
          key={c.public_id}
          consultation={c}
        />
      ))}
    </div>
  );
}
