///var/www/GSA/animal/frontend/src/app/(protected)/dashboard/animals/[animalId]/clinic/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import type { ClinicalExamOrderItem } from "@/types/clinicalExamOrders";
import { listAnimalExamOrders } from "@/services/clinicalExamOrders";
import { ExamOrderCard } from "@/components/animals/clinic/ExamOrderCard";

export default function AnimalExamOrdersPage() {
  const { animalId } = useParams<{ animalId: string }>();

  const [items, setItems] = useState<ClinicalExamOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await listAnimalExamOrders(animalId);
        if (!alive) return;
        setItems(data.items || []);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Erro ao carregar pedidos de exame");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    if (animalId) load();

    return () => {
      alive = false;
    };
  }, [animalId]);

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-zinc-900">
            Pedidos de exame
          </h2>

          <p className="text-xs text-zinc-500">
            Histórico longitudinal de pedidos de exame deste animal.
          </p>
        </div>

        <Link
          href={`/dashboard/animals/${animalId}/clinic/consultations`}
          className="text-xs text-zinc-700 hover:underline"
        >
          + Abrir consulta para solicitar exame
        </Link>
      </header>

      {loading && (
        <div className="text-sm text-zinc-500">Carregando…</div>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-md border bg-white px-4 py-3 text-sm text-zinc-600">
          Nenhum pedido de exame encontrado.
        </div>
      )}

      <div className="grid gap-3">
        {items.map((item) => (
          <ExamOrderCard key={item.public_id} item={item} />
        ))}
      </div>
    </div>
  );
}