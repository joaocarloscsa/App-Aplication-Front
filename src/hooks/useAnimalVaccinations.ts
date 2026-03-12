// path: frontend/src/hooks/useAnimalVaccinations.ts

"use client";

import { useEffect, useState } from "react";
import {
  fetchAnimalVaccinations,
  VaccinationDTO,
} from "@/services/animalVaccinations";

function sortVaccinations(data: VaccinationDTO[]): VaccinationDTO[] {
  return [...data].sort((a, b) => {
    const aDate = new Date(a.created_at ?? 0).getTime();
    const bDate = new Date(b.created_at ?? 0).getTime();
    return bDate - aDate;
  });
}

function normalizeVaccination(v: VaccinationDTO): VaccinationDTO {
  return {
    ...v,
    doses: (v.doses ?? []).sort((a, b) => {
      const aDate = new Date(a.applied_at ?? a.scheduled_at ?? 0).getTime();
      const bDate = new Date(b.applied_at ?? b.scheduled_at ?? 0).getTime();
      return aDate - bDate;
    }),
    events: (v.events ?? []).sort((a, b) => {
      const aDate = new Date(a.created_at).getTime();
      const bDate = new Date(b.created_at).getTime();
      return aDate - bDate;
    }),
  };
}

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

      const normalized = data.map(normalizeVaccination);

      setVaccinations(sortVaccinations(normalized));

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