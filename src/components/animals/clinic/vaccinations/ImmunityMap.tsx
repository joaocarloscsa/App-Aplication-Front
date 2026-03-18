"use client"

import {
  useAnimalImmunityMap,
  type VaccinationImmunityItem
} from "@/hooks/useAnimalImmunityMap"

type Props = {
  animalId: string
  overrideData?: VaccinationImmunityItem[]
}

export function ImmunityMap({ animalId, overrideData }: Props) {
  const {
    data: hookData = [],
    loading,
    error
  } = useAnimalImmunityMap(animalId)
const rawData = overrideData ?? hookData
  const data = rawData.filter(d => d.immune_until)

  if (loading && !overrideData) {
    return <p>Carregando imunidade...</p>
  }

  if (error && !overrideData) {
    return (
      <p className="text-red-600 text-sm">
        Erro ao carregar mapa de imunidade
      </p>
    )
  }

  if (!data.length) {
    return (
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-2">
          Mapa de Imunidade
        </h3>

        <p className="text-sm text-zinc-500">
          Nenhuma imunidade registrada ainda.
        </p>
      </div>
    )
  }

  return (
    <div className="border rounded p-4 space-y-2">
      <h3 className="font-semibold">
        Mapa de Imunidade
      </h3>

      {data.map((d, i: number) => {
        let status = "❌ não protegido"

        if (d.immune_until) {
          const exp = new Date(d.immune_until)
          const now = new Date()

          if (exp > now) {
            status = `✔ protegido até ${exp.toLocaleDateString("pt-PT")}`
          }
        }

return (
  <div
    key={`${d.disease}-${i}`}
    className="flex justify-between text-sm"
  >
    <span>{d.disease}</span>
    <span>{status}</span>
  </div>
)
      })}
    </div>
  )
}