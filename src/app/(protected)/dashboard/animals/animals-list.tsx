// /var/www/GSA/animal/frontend/src/app/(protected)/dashboard/animals/animals-list.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAnimals, AnimalListItem } from "@/services/animals";
import { AnimalPhoto } from "@/components/animals/AnimalPhoto";
import { CopyId } from "@/components/dashboard/CopyId";

export default function AnimalsList() {
  const [animals, setAnimals] = useState<AnimalListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const list = await fetchAnimals();

        if (!isCancelled) {
          setAnimals(list);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-zinc-500">
        Carregando animais…
      </div>
    );
  }

  if (animals.length === 0) {
    return (
      <div className="text-sm text-zinc-500">
        Nenhum animal disponível no momento.
      </div>
    );
  }

  return (
    <ul className="divide-y rounded-lg border bg-white">
      {animals.map((a) => (
        <li
          key={a.public_id}
          className="flex items-center justify-between gap-3 px-4 py-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-10 w-10 shrink-0">
              <AnimalPhoto
                size="sm"
                alt={a.call_name ?? a.public_id}
                photo={{
                  read_url: `/api/v1/animals/${a.public_id}/photo/read`,
                }}
              />
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex min-w-0 items-center gap-2">
                <div className="truncate font-semibold">
                  {a.call_name ?? "Sem nome"}
                </div>

                {a.type && (
                  <span className="text-xs font-medium uppercase text-zinc-500">
                    {a.type}
                  </span>
                )}

                {a.my_role === "invited_tutor" && (
                  <span
                    title="Você é tutor convidado"
                    className="cursor-default text-xs text-zinc-400"
                  >
                    🤝
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <CopyId id={a.public_id} />
              </div>
            </div>
          </div>

          <Link
            href={`/dashboard/animals/${a.public_id}`}
            className="text-sm font-medium text-zinc-700 hover:underline"
          >
            Editar
          </Link>
        </li>
      ))}
    </ul>
  );
}