"use client";

import { useParams } from "next/navigation";
import { useAnimalProblems } from "@/hooks/useAnimalProblems";
import { ProblemCard } from "@/components/animals/clinic/problems/ProblemCard";

export default function AnimalClinicalProblemsPage() {
  const { animalId } = useParams<{ animalId: string }>();
  const { items, loading, error } = useAnimalProblems(animalId);

  if (loading) {
    return (
      <p className="text-sm text-zinc-500">
        Carregando problemas clínicos…
      </p>
    );
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900">
          Problemas clínicos
        </h2>

        <p className="text-xs text-zinc-500">
          Acompanhamento longitudinal dos problemas do animal.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border bg-white p-4 text-sm text-zinc-500">
          Nenhum problema clínico registrado para este animal.
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <ProblemCard
              key={item.public_id}
              animalPublicId={animalId}
              item={item}
            />
          ))}
        </div>
      )}
    </div>
  );
}
