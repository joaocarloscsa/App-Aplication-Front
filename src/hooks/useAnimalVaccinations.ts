"use client";

import { useEffect, useState } from "react";
import {
  fetchAnimalVaccinations,
  VaccinationDTO,
} from "@/services/animalVaccinations";

export function useAnimalVaccinations(animalId?: string) {
  const [vaccinations, setVaccinations] = useState<VaccinationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    if (!animalId) {
      setVaccinations([]);
      return;
    }

    try {
      const data = await fetchAnimalVaccinations(animalId);

      setVaccinations(
        data.sort(
          (a, b) =>
            new Date(b.created_at ?? "").getTime() -
            new Date(a.created_at ?? "").getTime()
        )
      );

      setError(null);
    } catch {
      setError("Erro ao carregar vacinas.");
    }
  }

  useEffect(() => {
    setLoading(true);

    reload()
      .catch(() => setError("Erro ao carregar vacinas."))
      .finally(() => setLoading(false));
  }, [animalId]);

  return {
    vaccinations,
    loading,
    error,
    reload,
  };
}
