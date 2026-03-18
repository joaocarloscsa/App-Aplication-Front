"use client"

import {
  useVaccinationRecommendations,
  type Recommendation
} from "@/hooks/useVaccinationRecommendations"

type Props = {
  animalId: string
  overrideData?: Recommendation[]
}

export function VaccinationRecommendations({
  animalId,
  overrideData
}: Props) {
  const {
    data: hookData,
    loading,
    error
  } = useVaccinationRecommendations(animalId)

  const data = overrideData ?? hookData

  if (loading && !overrideData) {
    return <p>Carregando recomendações…</p>
  }

  if (error && !overrideData) {
    return <p className="text-red-600 text-sm">{error}</p>
  }

  if (!data.length) {
    return (
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-2">
          Recomendações
        </h3>
        <p className="text-sm text-zinc-500">
          Nenhuma recomendação no momento.
        </p>
      </div>
    )
  }

  return (
    <div className="border rounded p-4 space-y-2">
      <h3 className="font-semibold">
        Recomendações
      </h3>

      {data.map((r, i: number) => (
        <div
          key={`${r.product_code}-${i}`}
          className="flex justify-between text-sm"
        >
          <span>{r.disease}</span>

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