"use client"

import { useEffect, useState } from "react"

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export function useAnimalImmunityMap(animalId: string) {

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {

    async function load() {

      try {

        const res = await fetch(
          `${API}/api/v1/animals/${animalId}/immunity-map`,
          {
            credentials: "include"
          }
        )

        if (!res.ok) {
          throw new Error(await res.text())
        }

        const json = await res.json()

        setData(json)

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