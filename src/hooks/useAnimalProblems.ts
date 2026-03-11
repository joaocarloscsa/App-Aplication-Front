"use client";

import { useCallback, useEffect, useState } from "react";
import {
  listAnimalClinicalProblems,
  type ClinicalProblemSummaryDTO,
} from "@/services/clinicalProblems";

export function useAnimalProblems(animalId?: string) {
  const [items, setItems] = useState<ClinicalProblemSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!animalId) return;

    try {
      setLoading(true);
      const data = await listAnimalClinicalProblems(animalId);
      setItems(data);
      setError(null);
    } catch {
      setError("Erro ao carregar problemas clínicos.");
    } finally {
      setLoading(false);
    }
  }, [animalId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    items,
    loading,
    error,
    reload,
  };
}
