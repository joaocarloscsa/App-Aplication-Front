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
            {/* FOTO DO ANIMAL — FLUXO CANÔNICO */}
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
                    {/* Linha 1 — Nome + Tipo + Papel */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="font-semibold truncate">
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
                          className="text-xs text-zinc-400 cursor-default"
                        >
                          🤝
                        </span>
                      )}
                    </div>

                    {/* Linha 2 — ID + copiar */}
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <span className="font-mono truncate">{a.public_id}</span>
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

