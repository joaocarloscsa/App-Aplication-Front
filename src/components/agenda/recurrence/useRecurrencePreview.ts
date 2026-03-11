"use client";

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/services/api";

export type RecurrencePreview = {
  summary: string;
  first_dates: string[];
  last_date: string | null;
  hidden_count: number;
  total: number;
  ends_at: string | null;
};

export function useRecurrencePreview(
  animalId: string | undefined,
  payload: any
) {
  const [preview, setPreview] = useState<RecurrencePreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!animalId || !payload) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    debounceRef.current = window.setTimeout(() => {
      const controller = new AbortController();
      abortRef.current = controller;

      async function load() {
        try {
          setLoading(true);

          const res = await apiFetch(
            `/api/v1/animals/${animalId}/tasks/preview`,
            {
              method: "POST",
              body: payload,
              headers: { "Content-Type": "application/json" },
              signal: controller.signal,
            }
          );

          setPreview(res as RecurrencePreview);
          setError(null);
        } catch (e: any) {
          if (e?.name !== "AbortError") {
            setError("Erro ao gerar preview");
          }
        } finally {
          setLoading(false);
        }
      }

      load();
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [animalId, payload]);

  return { preview, error, loading };
}