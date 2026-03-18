"use client"

import { useCallback, useEffect, useState } from "react"
import { http } from "@/services/http"

export type VaccinationImmunityItem = {
  disease: string // ✅ CORRIGIDO
  immune_until?: string | null
  source_dose_public_id?: string
  source_vaccination_public_id?: string
  source_vaccine_name?: string
  source_manufacturer?: string
  applied_at?: string | null
  vaccination_expiration_date?: string | null
}

export function useAnimalImmunityMap(animalId: string) {
  const [data, setData] = useState<VaccinationImmunityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const reload = useCallback(async () => {
    if (!animalId) {
      setData([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      const result = await http<VaccinationImmunityItem[]>(
        `/api/v1/animals/${animalId}/immunity-map`
      )

      setData(result)
      setError(false)
    } catch (e) {
      console.error(e)
      setError(true)
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
    setData,
    reload
  }
}