// /var/www/GSA/animal/frontend/src/app/(protected)/dashboard/animals/[animalId]/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { getAnimal } from "@/services/animals";
import { AnimalBasicForm } from "@/components/animals/AnimalBasicForm";
import { AnimalParentsForm } from "@/components/animals/AnimalParentsForm";
import { AnimalPhotoBlock } from "@/components/animals/AnimalPhotoBlock";
import { CopyId } from "@/components/dashboard/CopyId";

type RawAnimal = any;

export default function AnimalPage() {
  const params = useParams();
  const publicId = params?.animalId as string;

  const [animal, setAnimal] = useState<RawAnimal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reloadAnimal = useCallback(async () => {
    if (!publicId) return;

    try {
      setLoading(true);
      const data = await getAnimal(publicId);
      setAnimal(data);
    } catch {
      setError("Erro ao carregar o animal.");
    } finally {
      setLoading(false);
    }
  }, [publicId]);

  useEffect(() => {
    reloadAnimal();
  }, [reloadAnimal]);

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (loading || !animal) {
    return <div className="p-6 text-zinc-500">Carregando animal…</div>;
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-6 space-y-10">
      {/* TOPO: FOTO + IDENTIDADE */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        <AnimalPhotoBlock
          animalPublicId={animal.public_id}
          photo={animal.photo}
          name={animal.call_name || animal.public_id}
          onUploaded={reloadAnimal}
        />

        <div className="min-w-0 space-y-1">
          <h1 className="text-xl font-semibold text-zinc-900 truncate">
            {animal.call_name || animal.public_id}
          </h1>

          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <span className="font-mono">{animal.public_id}</span>
            <CopyId id={animal.public_id} />
          </div>
        </div>
      </div>

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
