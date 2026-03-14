"use client";

import { useEffect, useState } from "react";

import {
  listAnimalWeightFeedingRecords,
  createAnimalWeightFeedingRecord,
  updateAnimalWeightFeedingRecord,
  deleteAnimalWeightFeedingRecord,
  AnimalWeightFeedingRecord,
  CreateWeightFeedingPayload,
  UpdateWeightFeedingPayload,
} from "@/services/animalWeightFeeding";

function sortRecords(records: AnimalWeightFeedingRecord[]) {
  return [...records].sort(
    (a, b) =>
      new Date(b.recorded_at).getTime() -
      new Date(a.recorded_at).getTime()
  );
}

export function useAnimalWeightFeeding(animalId: string) {
  const [records, setRecords] = useState<AnimalWeightFeedingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const data = await listAnimalWeightFeedingRecords(animalId);
      setRecords(sortRecords(data));
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar histórico.");
    } finally {
      setLoading(false);
    }
  }

  async function create(payload: CreateWeightFeedingPayload) {
    const record = await createAnimalWeightFeedingRecord(
      animalId,
      payload
    );

    setRecords((prev) => sortRecords([record, ...prev]));
    return record;
  }

  async function update(
    recordId: string,
    payload: UpdateWeightFeedingPayload
  ) {
    const updated = await updateAnimalWeightFeedingRecord(
      animalId,
      recordId,
      payload
    );

    setRecords((prev) =>
      sortRecords(
        prev.map((r) =>
          r.public_id === recordId ? updated : r
        )
      )
    );

    return updated;
  }

  async function remove(recordId: string) {
    await deleteAnimalWeightFeedingRecord(animalId, recordId);

    setRecords((prev) =>
      prev.filter((r) => r.public_id !== recordId)
    );
  }

  useEffect(() => {
    if (!animalId) return;
    load();
  }, [animalId]);

  return {
    records,
    loading,
    error,
    reload: load,
    create,
    update,
    remove,
  };
}

