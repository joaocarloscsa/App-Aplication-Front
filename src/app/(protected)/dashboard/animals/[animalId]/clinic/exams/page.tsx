"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { listAnimalExamOrders } from "@/services/clinicalExamOrders";
import { ExamOrderCard } from "@/components/animals/clinic/ExamOrderCard";

export default function AnimalExamsPage() {
  const { animalId } = useParams<{ animalId: string }>();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    const data = await listAnimalExamOrders(animalId);

    const received = (data.items || []).filter(
      (x: any) => x.status === "RECEIVED" || x.status === "VALIDATED"
    );

    setItems(received);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [animalId]);

  if (loading) {
    return <div className="text-sm text-zinc-500">Carregando exames…</div>;
  }

  return (
    <div className="space-y-4">

      <h2 className="text-sm font-semibold text-zinc-900">
        Exames realizados
      </h2>

      {items.length === 0 && (
        <p className="text-sm text-zinc-500">
          Nenhum exame recebido ainda.
        </p>
      )}

      {items.map((item) => (
        <ExamOrderCard key={item.public_id} item={item} />
      ))}

    </div>
  );
}
