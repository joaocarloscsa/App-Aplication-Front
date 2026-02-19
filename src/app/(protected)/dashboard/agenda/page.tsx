"use client";

// path: frontend/src/app/(protected)/dashboard/agenda/page.tsx

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getAnimalAgenda,
  AgendaItem,
  AgendaView,
} from "@/services/animalAgenda";
import { AgendaViewSwitcher } from "@/components/agenda/AgendaViewSwitcher";

export default function AgendaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const animalId = searchParams.get("animalId") ?? "";

  const [view, setView] = useState<AgendaView>("day");
  const [referenceDate] = useState(new Date());

  const [items, setItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!animalId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await getAnimalAgenda(
        animalId,
        view,
        referenceDate.toISOString()
      );
      setItems(res.items);
    } catch {
      setError("Erro ao carregar agenda.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animalId, view]);

  if (!animalId) {
    return (
      <section className="space-y-3">
        <h1 className="text-lg font-semibold text-zinc-900">Agenda</h1>
        <p className="text-sm text-zinc-600">
          Selecione um animal para visualizar a agenda.
        </p>

        <button
          onClick={() => router.push("/dashboard/animals")}
          className="rounded-md border px-3 py-2 text-sm"
        >
          Ir para Animais
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <header className="flex items-start justify-between gap-3">
        <h1 className="text-lg font-semibold text-zinc-900">
          Agenda
        </h1>

        <AgendaViewSwitcher value={view} onChange={setView} />
      </header>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading && <p className="text-sm text-zinc-500">Carregando…</p>}

      {!loading && items.length === 0 && (
        <p className="text-sm text-zinc-500">
          Nenhum item neste período.
        </p>
      )}

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={`${item.type}-${item.id}`}
            className="rounded-md border bg-white px-4 py-3 space-y-1"
          >
            <div className="flex justify-between gap-3">
              <div className="space-y-1">
                <p className="font-medium text-zinc-900">
                  {item.title}
                </p>

                {/* DESCRIÇÃO HUMANA */}
                {item.description && (
                  <p className="text-sm text-zinc-800 whitespace-pre-line">
                    {item.description}
                  </p>
                )}

                <p className="text-xs text-zinc-500">
                  {item.starts_at
                    ? new Date(item.starts_at).toLocaleString()
                    : "Sem data"}
                </p>

                <p className="text-xs text-zinc-600">
                  Criado por {item.created_by.name}
                </p>
              </div>

              <span className="text-xs rounded-full bg-zinc-100 px-2 py-0.5">
                {item.type}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
