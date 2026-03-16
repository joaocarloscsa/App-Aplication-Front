"use client"

import { useEffect, useState } from "react"

type Immunity = {
  disease: string
  immune_until: string | null
  vaccine: string | null
  manufacturer: string | null
}

export default function ImmunityStatus({ animalId }: { animalId: string }) {

  const [data, setData] = useState<Immunity[]>([])

  useEffect(() => {

    async function load() {

      const res = await fetch(
        `/api/v1/animals/${animalId}/immunity-map`
      )

      const json = await res.json()

      setData(json)
    }

    load()

  }, [animalId])

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
