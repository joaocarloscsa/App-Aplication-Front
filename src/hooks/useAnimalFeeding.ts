"use client";

import { useEffect, useState } from "react";
import {
  fetchAnimalFeedingRecords,
  FeedingRecord,
} from "@/services/animalWeightFeeding";

export function useAnimalFeeding(animalId: string) {

  const [records, setRecords] = useState<FeedingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {

    try {

      const data = await fetchAnimalFeedingRecords(animalId);

      setRecords(data);

    } catch (err) {

      console.error(err);
      setError("Erro ao carregar alimentação");

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
