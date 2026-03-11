// /var/www/GSA/animal/frontend/src/app/(protected)/dashboard/animals/[animalId]/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

import { getAnimal } from "@/services/animals";
import { revokeTutorFromAnimal } from "@/services/animalTutors";

import { AnimalHeader } from "@/components/animals/AnimalHeader";
import { AnimalSectionMenu } from "@/components/animals/AnimalSectionMenu";
import { AnimalBasicForm } from "@/components/animals/AnimalBasicForm";
import { AnimalParentsForm } from "@/components/animals/AnimalParentsForm";

type AnimalPageDTO = {
  public_id: string;
  call_name?: string | null;
  photo?: unknown;
  my_role?: string | null;
  permissions?: {
    edit?: boolean;
    invite?: boolean;
    clinic?: boolean;
    agenda?: boolean;
    files?: boolean;
    tutors?: boolean;
    organizations?: boolean;
    history?: boolean;
  } | null;
  tutors?: {
    primary?: {
      person_public_id: string;
      name: string;
    } | null;
    invited?: Array<{
      person_public_id: string;
      name: string;
    }>;
  } | null;
  [key: string]: unknown;
};

export default function AnimalPage() {
  const { animalId } = useParams<{ animalId: string }>();

  const [animal, setAnimal] = useState<AnimalPageDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const reloadAnimal = useCallback(async () => {
    if (!animalId) {
      setAnimal(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await getAnimal<AnimalPageDTO>(animalId);
      setAnimal(data);
    } finally {
      setLoading(false);
    }
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

<AnimalBasicForm
  publicId={animal.public_id}
  initialData={{
    ...animal,
    call_name: animal.call_name ?? undefined,
  }}
/>

      <AnimalParentsForm
        publicId={animal.public_id}
        animal={animal}
        onChanged={reloadAnimal}
      />
    </section>
  );
}