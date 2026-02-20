// path: frontend/src/app/(protected)/dashboard/animals/[animalId]/clinic/treatments/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AnimalTreatmentScheduleCreateForm } from "@/components/animals/clinic/AnimalTreatmentScheduleCreateForm";
import { AnimalTreatmentCreateForm } from "@/components/animals/clinic/AnimalTreatmentCreateForm";
import { fetchAnimalTreatments, TreatmentDTO } from "@/services/animalTreatments";

function humanizeStatus(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "active") return "Ativo";
  if (s === "paused") return "Pausado";
  if (s === "cancelled" || s === "canceled") return "Cancelado";
  if (s === "finished") return "Finalizado";
  return status;
}

export default function AnimalClinicTreatmentsPage() {
  const { animalId } = useParams<{ animalId: string }>();

  const [items, setItems] = useState<TreatmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  async function reload() {
    if (!animalId) return;

    const treatments = await fetchAnimalTreatments(animalId);

    setItems(
      treatments
        .filter((t): t is TreatmentDTO => Boolean(t && t.treatment_public_id))
        .sort((a, b) => {
          // ✅ mais novos primeiro (created_at DESC)
          const da = new Date(a.created_at).getTime();
          const db = new Date(b.created_at).getTime();
          return db - da;
        })
    );
  }

  useEffect(() => {
    reload()
      .catch(() => setError("Erro ao carregar tratamentos."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animalId]);

  if (loading) {
    return <p className="text-sm text-zinc-500">Carregando tratamentos…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900">Tratamentos</h2>

        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="text-sm font-medium text-zinc-900 hover:underline"
        >
          + Novo tratamento
        </button>
      </div>

      {showCreateForm && (
        <AnimalTreatmentCreateForm
          animalPublicId={animalId}
          onCancel={() => setShowCreateForm(false)}
          onCreated={async () => {
            await reload();
            setShowCreateForm(false);
          }}
        />
      )}

      {items.length === 0 && (
        <p className="text-sm text-zinc-500">
          Nenhum tratamento registrado para este animal.
        </p>
      )}

      {items.map((t) => (
        <div
          key={t.treatment_public_id}
          className="rounded-lg border bg-white px-4 py-3 space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-zinc-900 truncate">{t.name}</p>
              <p className="text-xs text-zinc-500 font-mono">
                {t.treatment_public_id}
              </p>
            </div>

            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
              {humanizeStatus(t.status)}
            </span>
          </div>

          <p className="text-xs text-zinc-500">
            Início: {new Date(t.starts_at).toLocaleString()}
            {t.ends_at ? ` • Fim: ${new Date(t.ends_at).toLocaleString()}` : ""}
          </p>

          <div className="pt-2 border-t">
            <AnimalTreatmentScheduleCreateForm
              animalId={animalId}
              treatmentPublicId={t.treatment_public_id}
              onCreated={async () => {
                const treatments = await fetchAnimalTreatments(animalId);
                setItems(
                  treatments.sort((a, b) => {
                    const da = new Date(a.created_at).getTime();
                    const db = new Date(b.created_at).getTime();
                    return db - da;
                  })
                );
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}