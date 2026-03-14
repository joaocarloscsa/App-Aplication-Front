"use client";

import { useParams } from "next/navigation";
import { useAnimalWeight } from "@/hooks/useAnimalWeight";
import { AnimalWeightCreateForm } from "@/components/animals/history/AnimalWeightCreateForm";

export default function AnimalWeightPage() {

  const { animalId } = useParams<{ animalId: string }>();

  const { records, loading, reload } = useAnimalWeight(animalId);

  if (loading) {
    return <p className="text-sm text-zinc-500">Carregando pesos…</p>;
  }

  return (
    <div className="space-y-4">

      <h2 className="text-sm font-semibold text-zinc-900">
        Histórico de peso
      </h2>

      <AnimalWeightCreateForm
        animalId={animalId}
        onCreated={reload}
      />

      {records.map((r) => (
        <div
          key={r.public_id}
          className="border rounded-lg p-4 bg-white text-sm"
        >
          <p>
            Peso: <strong>{r.weight_value} {r.weight_unit}</strong>
          </p>

          <p className="text-zinc-500 text-xs">
            {new Date(r.recorded_at).toLocaleString("pt-PT")}
          </p>
        </div>
      ))}

    </div>
  );
}

