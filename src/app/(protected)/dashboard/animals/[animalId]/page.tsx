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
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-xl font-semibold text-zinc-900 truncate">
              {animal.call_name || animal.public_id}
            </h1>

            {animal.my_role === "invited_tutor" && (
              <span
                title="Você é tutor convidado deste animal"
                className="text-xs text-zinc-500 cursor-default"
              >
                🤝 Tutor convidado
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <span className="font-mono">{animal.public_id}</span>
            <CopyId id={animal.public_id} />
          </div>
        </div>
      </div>

                        {/* TUTORES DO ANIMAL */}
<section className="space-y-3">
  <h2 className="text-sm font-semibold text-zinc-900">
    Tutores deste animal
  </h2>

  {/* Tutor principal */}
  {animal.tutors?.primary && (
    <div className="rounded-lg border px-4 py-3">
      <div className="text-xs font-semibold text-zinc-600 mb-1">
        👑 Tutor principal
      </div>

      <div className="text-sm font-medium text-zinc-900">
        {animal.tutors.primary.name}
        <span className="ml-1 text-xs font-mono text-zinc-500">
          ({animal.tutors.primary.person_public_id})
           <CopyId id={animal.tutors.primary.person_public_id} />
        </span>
      </div>
    </div>
  )}

  {/* Tutores convidados */}
  {animal.tutors?.invited?.length > 0 && (
    <div className="rounded-lg border px-4 py-3 space-y-2">
      <div className="text-xs font-semibold text-zinc-600">
        🤝 Tutores convidados
      </div>

      {animal.tutors.invited.map((t: any) => (
        <div
          key={t.person_public_id}
          className="text-sm text-zinc-900"
        >
          {t.name}
          <span className="ml-1 text-xs font-mono text-zinc-500">
            ({t.person_public_id})
             <CopyId id={t.person_public_id} />
          </span>
        </div>
      ))}
    </div>
  )}
</section>

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
