// path: frontend/src/hooks/useConsultationExamOrders.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import type { ClinicalExamOrderItem } from "@/types/clinicalExamOrders";
import {
  listConsultationExamOrders,
} from "@/services/clinicalExamOrders";

export function useConsultationExamOrders(
  consultationPublicId: string
) {
  const [items, setItems] = useState<ClinicalExamOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!consultationPublicId) return;

    try {
      setLoading(true);
      const res = await listConsultationExamOrders(consultationPublicId);
      setItems(res.items ?? []);
      setError(null);
    } catch {
      setError("Erro ao carregar pedidos de exame.");
    } finally {
      setLoading(false);
    }
  }, [consultationPublicId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, loading, error, reload };
}
