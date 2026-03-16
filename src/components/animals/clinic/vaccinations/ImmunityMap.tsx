"use client"

import { useAnimalImmunityMap } from "@/hooks/useAnimalImmunityMap"

type Props = {
  animalId: string
}

export function ImmunityMap({ animalId }: Props) {

  const { data = [], loading, error } =
    useAnimalImmunityMap(animalId)

  if (loading) {
    return <p>Carregando imunidade...</p>
  }

  if (error) {
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

      {data.map((d, i) => {

        let status = "❌ não protegido"

        if (d.immune_until) {

          const exp = new Date(d.immune_until)
          const now = new Date()

          if (exp > now) {
            status =
              `✔ protegido até ${exp.toLocaleDateString()}`
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