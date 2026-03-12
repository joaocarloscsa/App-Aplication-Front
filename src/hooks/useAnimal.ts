"use client";

import { useEffect, useState } from "react";
import { http } from "@/services/http";

type Animal = {
  public_id: string;
  type: string;
};

export function useAnimal(animalId: string) {

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {

    try {

      const data = await http<any>(
        `/api/v1/animals/${animalId}`
      );

      console.log("animal response", data);

      setAnimal({
        public_id: data.public_id,
        type: data.type
      });

    } catch (err) {

      console.error(err);
      setError("Erro ao carregar animal.");

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {
    if (!animalId) return;
    load();
  }, [animalId]);

  return {
    animal,
    loading,
    error,
    reload: load
  };
}