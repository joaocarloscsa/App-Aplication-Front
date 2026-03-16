"use client"

import { useEffect, useState } from "react"
import { http } from "@/services/http"

type Immunity = {
  disease: string
  immune_until: string | null
  vaccine: string | null
  manufacturer: string | null
}

export default function ImmunityStatus({
  animalId
}: {
  animalId: string
}) {

  const [data, setData] = useState<Immunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function load() {

      try {

        const result =
          await http<Immunity[]>(
            `/api/v1/animals/${animalId}/immunity-map`
          )

        setData(result)

      } catch (e) {

        console.error(e)

      } finally {

        setLoading(false)

      }

    }

    load()

  }, [animalId])

  if (loading) {
    return <p>Carregando imunidade...</p>
  }

  return (

    <div className="border rounded-lg p-4 mt-4">

      <h3 className="font-semibold mb-3">
        Imunidade do animal
      </h3>

      {data.map((d, i) => {

        let status = "❌ não protegido"

        if (d.immune_until) {

          const date = new Date(d.immune_until)

          status =
            "✔ protegido até " +
            date.toLocaleDateString()

        }

        return (

          <div
            key={i}
            className="flex justify-between text-sm py-1"
          >

            <span>{d.disease}</span>

            <span>{status}</span>

          </div>

        )

      })}

    </div>

  )

}