"use client"

import { useCallback, useEffect, useState } from "react"
import { http } from "@/services/http"

export type Recommendation = {
  product_code: string
  vaccine: string
  manufacturer: string
  disease: string
  immune_until: string | null
  status: string
}

export function useVaccinationRecommendations(animalId: string) {
  const [data, setData] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (!animalId) {
      setData([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      const result = await http<Recommendation[]>(
        `/api/v1/animals/${animalId}/vaccination-recommendations`
      )

      setData(result)
      setError(null)
    } catch (e) {
      console.error(e)
      setError("Erro ao carregar recomendações")
    } finally {
      setLoading(false)
    }
  }, [animalId])

  useEffect(() => {
    void reload()
  }, [reload])

  return {
    data,
    loading,
    error,
    reload,
    setData
  }
}