"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { listAnimalExamOrders } from "@/services/clinicalExamOrders";
import { ExamOrderCard } from "@/components/animals/clinic/ExamOrderCard";

export default function AnimalExamOrdersPage() {
  const { animalId } = useParams<{ animalId: string }>();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await listAnimalExamOrders(animalId);
    setItems(data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [animalId]);

  if (loading) {
    return <div className="text-sm text-zinc-500">Carregando pedidos…</div>;
  }

  return (
    <div className="space-y-4">

      <h2 className="text-sm font-semibold text-zinc-900">
        Pedidos de exame
      </h2>

      {items.length === 0 && (
        <p className="text-sm text-zinc-500">
          Nenhum pedido de exame encontrado.
        </p>
      )}

      {items.map((item) => (
        <ExamOrderCard key={item.public_id} item={item} />
      ))}

    </div>
  );
}
