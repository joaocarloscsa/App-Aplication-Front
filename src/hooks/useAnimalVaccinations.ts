"use client"

import { useEffect, useState } from "react"
import { fetchAnimalVaccinations } from "@/services/animalVaccinations"
import { AnimalVaccination } from "@/types/vaccination"

export function useAnimalVaccinations(animalId?: string) {

  const [vaccinations, setVaccinations] = useState<AnimalVaccination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function reload() {

    if (!animalId) {
      setVaccinations([])
      return
    }

    try {

      const data = await fetchAnimalVaccinations(animalId)

      setVaccinations(data)

      setError(null)

    } catch {

      setError("Erro ao carregar vacinas.")

    }

  }

  useEffect(() => {

    setLoading(true)

    reload()
      .finally(() => setLoading(false))

  }, [animalId])

  return {

    vaccinations,
    loading,
    error,
    reload

  }

}