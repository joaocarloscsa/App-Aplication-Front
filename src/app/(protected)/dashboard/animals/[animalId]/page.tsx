"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

import { getAnimal } from "@/services/animals";
import { revokeTutorFromAnimal } from "@/services/animalTutors";

import { AnimalHeader } from "@/components/animals/AnimalHeader";
import { AnimalSectionMenu } from "@/components/animals/AnimalSectionMenu";
import { AnimalBasicForm } from "@/components/animals/AnimalBasicForm";
import { AnimalParentsForm } from "@/components/animals/AnimalParentsForm";

export default function AnimalPage() {
  const { animalId } = useParams<{ animalId: string }>();

  const [animal, setAnimal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const reloadAnimal = useCallback(async () => {
    if (!animalId) return;
    setLoading(true);
    const data = await getAnimal(animalId);
    setAnimal(data);
    setLoading(false);
  }, [animalId]);

  useEffect(() => {
    reloadAnimal();
  }, [reloadAnimal]);

  if (loading || !animal) {
    return <div className="p-6 text-zinc-500">Carregando animal…</div>;
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-6 space-y-10">
      <AnimalHeader
        animal={animal}
        onRevokeTutor={async (personId) => {
          await revokeTutorFromAnimal(animal.public_id, personId);
          await reloadAnimal();
        }}
      />

      <AnimalSectionMenu animalId={animal.public_id} />

      {/* VISÃO GERAL = FORMULÁRIOS */}
      <AnimalBasicForm
        publicId={animal.public_id}
        initialData={animal}
      />

      <AnimalParentsForm
        publicId={animal.public_id}
        animal={animal}
        onChanged={reloadAnimal}
      />
    </section>
  );
}
