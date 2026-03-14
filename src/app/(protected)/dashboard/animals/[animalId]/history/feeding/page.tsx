"use client";

import { useParams } from "next/navigation";
import { useAnimalFeeding } from "@/hooks/useAnimalFeeding";
import { AnimalFeedingCreateForm } from "@/components/animals/history/AnimalFeedingCreateForm";

export default function AnimalFeedingPage() {

  const { animalId } = useParams<{ animalId: string }>();

  const { records, loading, reload } = useAnimalFeeding(animalId);

  if (loading) {
    return <p className="text-sm text-zinc-500">Carregando alimentação…</p>;
  }

  return (
    <div className="space-y-4">

      <h2 className="text-sm font-semibold text-zinc-900">
        Alimentação
      </h2>

      <AnimalFeedingCreateForm
        animalId={animalId}
        onCreated={reload}
      />

      {records.length === 0 && (
        <p className="text-sm text-zinc-500">
          Nenhum registro ainda.
        </p>
      )}

{records.map((r) => (

  <div
    key={r.public_id}
    className="border rounded-lg p-4 bg-white text-sm space-y-2"
  >

    <div className="flex justify-between">

      <p className="font-semibold">
        {r.food_type ?? "Alimentação"}
      </p>

      {r.daily_total_value && (
        <p className="text-sm text-zinc-700 font-medium">
          {r.daily_total_value} {r.daily_total_unit} / dia
        </p>
      )}

    </div>

    {r.food_brand && (
      <p className="text-zinc-600">
        Marca: {r.food_brand}
      </p>
    )}

    {r.food_name && (
      <p className="text-zinc-600">
        Dieta: {r.food_name}
      </p>
    )}

    {(r.meals_per_day && r.portion_value) && (
      <p className="text-zinc-600">
        {r.meals_per_day} refeições / dia — {r.portion_value} {r.portion_unit} por refeição
      </p>
    )}

    {r.description && (
      <p className="text-zinc-600 text-sm">
        {r.description}
      </p>
    )}

    <p className="text-xs text-zinc-500">
      {new Date(r.recorded_at).toLocaleString("pt-PT")}
    </p>

  </div>

))}


    </div>
  );
}

