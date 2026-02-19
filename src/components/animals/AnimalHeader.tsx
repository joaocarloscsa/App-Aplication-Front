"use client";

import { CopyId } from "@/components/dashboard/CopyId";
import { AnimalPhotoBlock } from "@/components/animals/AnimalPhotoBlock";

type Props = {
  animal: any;
  onRevokeTutor?: (personPublicId: string) => void;
};

export function AnimalHeader({ animal, onRevokeTutor }: Props) {
  return (
    <header className="space-y-6">
      {/* IDENTIDADE */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        <AnimalPhotoBlock
          animalPublicId={animal.public_id}
          photo={animal.photo}
          name={animal.call_name || animal.public_id}
        />

        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-xl font-semibold truncate">
              {animal.call_name || animal.public_id}
            </h1>

            {animal.my_role === "invited_tutor" && (
              <span className="text-xs text-zinc-500">
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

      {/* TUTORES */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900">
          Tutores deste animal
        </h2>

        {animal.tutors?.primary && (
          <div className="rounded-lg border px-4 py-3">
            <div className="text-xs font-semibold text-zinc-600 mb-1">
              👑 Tutor principal
            </div>
            <div className="text-sm font-medium flex items-center gap-2">
              <span>{animal.tutors.primary.name}</span>
              <span className="text-xs font-mono text-zinc-500">
                ({animal.tutors.primary.person_public_id})
              </span>
              <CopyId id={animal.tutors.primary.person_public_id} />
            </div>
          </div>
        )}

        {animal.tutors?.invited?.length > 0 && (
          <div className="rounded-lg border px-4 py-3 space-y-2">
            <div className="text-xs font-semibold text-zinc-600">
              🤝 Tutores convidados
            </div>

            {animal.tutors.invited.map((t: any) => (
              <div
                key={t.person_public_id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span>{t.name}</span>
                  <span className="text-xs font-mono text-zinc-500">
                    ({t.person_public_id})
                  </span>
                  <CopyId id={t.person_public_id} />
                </div>

                {animal.permissions?.edit && onRevokeTutor && (
                  <button
                    onClick={() =>
                      onRevokeTutor(t.person_public_id)
                    }
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remover acesso
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </header>
  );
}
