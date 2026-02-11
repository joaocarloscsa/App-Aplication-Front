"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDashboardOverlay } from "./DashboardOverlayContext";
import { fetchAnimals, AnimalListItem } from "@/services/animals";

export function AnimalsOverlay() {
  const { activeOverlay, closeOverlay } = useDashboardOverlay();
  const [animals, setAnimals] = useState<AnimalListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeOverlay !== "animals") return;

    setLoading(true);
    fetchAnimals()
      .then(setAnimals)
      .finally(() => setLoading(false));
  }, [activeOverlay]);

  if (activeOverlay !== "animals") return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 p-4">
      <div className="mx-auto max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Animais</h2>
          <button
            onClick={closeOverlay}
            className="text-sm text-zinc-500 hover:text-zinc-900"
          >
            Fechar
          </button>
        </div>

        <div className="px-6 py-4 space-y-3 max-h-[360px] overflow-y-auto">
          {loading && (
            <p className="text-sm text-zinc-500">Carregando…</p>
          )}

          {!loading && animals.length === 0 && (
            <p className="text-sm text-zinc-500">
              Nenhum animal encontrado.
            </p>
          )}

          {animals.map((a) => (
            <div
              key={a.public_id}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <div className="h-10 w-10 rounded-full bg-zinc-200 overflow-hidden">
                {a.photo?.url && (
                  <img
                    src={a.photo.url}
                    alt={a.call_name ?? a.public_id}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">
                  {a.call_name ?? "Sem nome"}
                </div>
                <div className="text-xs text-zinc-500 flex gap-2">
                  <span className="font-mono">{a.public_id}</span>
                  {a.type && <span className="uppercase">{a.type}</span>}
                </div>
              </div>

              <Link
                href={`/dashboard/animals/${a.public_id}`}
                className="text-sm font-medium text-zinc-700 hover:underline"
              >
                Editar
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

