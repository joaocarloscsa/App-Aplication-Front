"use client"

import { useEffect, useState } from "react"
import { http } from "@/services/http"

export function useAnimalImmunityMap(animalId: string) {

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {

    async function load() {

      try {

        const result =
          await http<any[]>(
            `/api/v1/animals/${animalId}/immunity-map`
          )

        setData(result)

      } catch (e) {

        console.error(e)
        setError(true)

      } finally {

        setLoading(false)

      }

    }

    load()

  }, [animalId])

  return { data, loading, error }

}