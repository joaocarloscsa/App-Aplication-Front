"use client"

import { useVaccinationRecommendations } from "@/hooks/useVaccinationRecommendations"

type Props = {
  animalId: string
}

export function VaccinationRecommendations({ animalId }: Props) {

  const { data, loading } =
    useVaccinationRecommendations(animalId)

  if (loading) {
    return <p>Carregando recomendações…</p>
  }

  return (

    <div className="border rounded p-4 space-y-2">

      <h3 className="font-semibold">
        Recomendações
      </h3>

      {data.map((r, i) => (

        <div
          key={i}
          className="flex justify-between text-sm"
        >

          <span>
            {r.disease}
          </span>

          <span>

            {r.status === "protected" && "✔ protegido"}
            {r.status === "expiring" && "⚠ vencendo"}
            {r.status === "recommended" && "❌ precisa vacinar"}

          </span>

        </div>

      ))}

    </div>

  )

}
