// /var/www/GSA/animal/frontend/src/app/(protected)/dashboard/animals/animals-list.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAnimals, AnimalListItem } from "@/services/animals";

export default function AnimalsList() {
  const [animals, setAnimals] = useState<AnimalListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const list = await fetchAnimals();
        if (mounted) {
          setAnimals(list);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
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
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-zinc-200 overflow-hidden">
              {a.photo?.url && (
                <img
                  src={a.photo.url}
                  alt={a.call_name ?? a.public_id}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="min-w-0">
              <div className="font-semibold truncate">
                {a.call_name ?? "Sem nome"}
              </div>
              <div className="text-xs text-zinc-500 flex gap-2">
                <span className="font-mono">{a.public_id}</span>
                {a.type && (
                  <span className="uppercase">{a.type}</span>
                )}
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
