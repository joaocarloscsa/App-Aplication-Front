"use client"

import { useEffect, useState } from "react"
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

  useEffect(() => {

    async function load() {

      try {

        const result =
          await http<Recommendation[]>(
            `/api/v1/animals/${animalId}/vaccination-recommendations`
          )

        setData(result)

      } catch (e) {

        console.error(e)
        setError("Erro ao carregar recomendações")

      } finally {

        setLoading(false)

      }

    }

    load()

  }, [animalId])

  return { data, loading, error }

}