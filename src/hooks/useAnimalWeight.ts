"use client";

import { useEffect, useState } from "react";
import { fetchAnimalWeightRecords } from "@/services/animalWeight";

type WeightRecord = {
  public_id: string;
  weight_value: number;
  weight_unit: "kg" | "g";
  recorded_at: string;
};

export function useAnimalWeight(animalId: string) {

  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {

    try {

      const data = await fetchAnimalWeightRecords(animalId);

      setRecords(data);

    } catch (err) {

      console.error(err);
      setError("Erro ao carregar pesos");

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    if (!animalId) return;

    load();

  }, [animalId]);

  return {
    records,
    loading,
    error,
    reload: load
  };
}

