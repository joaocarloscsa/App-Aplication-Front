"use client";

import { useEffect, useState } from "react";
import {
  fetchAnimalConsultations,
  ConsultationDTO,
} from "@/services/animalConsultations";

export function useAnimalConsultations(animalId?: string) {
  const [consultations, setConsultations] = useState<ConsultationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    if (!animalId) return;

    try {
      const data = await fetchAnimalConsultations(animalId);

      setConsultations(
        data.sort(
          (a, b) =>
            new Date(b.date_time).getTime() -
            new Date(a.date_time).getTime()
        )
      );

      setError(null);
    } catch {
      setError("Erro ao carregar consultas.");
    }
  }

  useEffect(() => {
    setLoading(true);

    reload()
      .catch(() => setError("Erro ao carregar consultas."))
      .finally(() => setLoading(false));
  }, [animalId]);

  return {
    consultations,
    loading,
    error,
    reload,
  };
}
