"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { listAnimalExamOrders } from "@/services/clinicalExamOrders";
import type {
  ClinicalExamOrderItem,
  ClinicalExamResultItem
} from "@/types/clinicalExamOrders";

type ExamRow = {
  result: ClinicalExamResultItem;
  examName: string;
  requestedAt: string | null;
};

export default function AnimalExamsPage() {
  const { animalId } = useParams<{ animalId: string }>();

  const [items, setItems] = useState<ClinicalExamOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const data = await listAnimalExamOrders(animalId);
      setItems(data.items ?? []);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar exames");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (animalId) load();
  }, [animalId]);

  const exams = useMemo(() => {
    const rows: ExamRow[] = [];

    for (const order of items) {
      for (const request of order.requests ?? []) {
        for (const result of request.results ?? []) {
          rows.push({
            result,
            examName: request.exam_type.name,
            requestedAt: order.requested_at ?? null
          });
        }
      }
    }

    return rows;
  }, [items]);

  return (
    <div className="space-y-4">

      <header>
        <h2 className="text-sm font-semibold text-zinc-900">
          Exames
        </h2>

        <p className="text-xs text-zinc-500">
          Arquivos de exames recebidos para este animal
        </p>
      </header>

      {loading && (
        <div className="text-sm text-zinc-500">
          Carregando…
        </div>
      )}

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm rounded">
          {error}
        </div>
      )}

      {!loading && !error && exams.length === 0 && (
        <div className="border bg-white px-4 py-3 text-sm text-zinc-600 rounded">
          Nenhum exame disponível.
        </div>
      )}

      <div className="space-y-2">

        {exams.map(({ result, examName, requestedAt }) => (

          <div
            key={result.public_id}
            className="border rounded-md bg-white px-4 py-3 flex items-center justify-between"
          >

            <div className="text-sm space-y-1">

              <div className="font-medium text-zinc-900">
                {result.file_name}
              </div>

              <div className="text-xs text-zinc-500">
                Exame: {examName}
              </div>

              {requestedAt && (
                <div className="text-xs text-zinc-400">
                  Pedido em {new Date(requestedAt).toLocaleString()}
                </div>
              )}

              {result.uploaded_at && (
                <div className="text-xs text-zinc-400">
                  Recebido em {new Date(result.uploaded_at).toLocaleString()}
                </div>
              )}

              {result.validated && (
                <div className="text-xs text-green-600 font-medium">
                  Validado
                </div>
              )}

            </div>

            {result.read_url && (
              <a
                href={result.read_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Abrir
              </a>
            )}

          </div>

        ))}

      </div>

    </div>
  );
}