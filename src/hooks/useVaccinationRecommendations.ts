import { useEffect, useState } from "react"

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

  useEffect(() => {

    async function load() {

      const res = await fetch(
        `/api/v1/animals/${animalId}/vaccination-recommendations`
      )

      const json = await res.json()

      setData(json)
      setLoading(false)

    }

    load()

  }, [animalId])

  return { data, loading }

}
