"use client"

import { AnimalVaccination } from "@/types/vaccination"
import { VaccinationCard } from "./VaccinationCard"

type Props = {
  vaccinations: AnimalVaccination[]
  onReload(): void
}

export function AnimalVaccinationHistory({
  vaccinations,
  onReload
}: Props) {

  if (!vaccinations.length) {

    return (

      <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-500">

        Nenhuma vacinação registrada.

      </div>

    )

  }

  return (

    <div className="space-y-3">

      {vaccinations.map(v => (

        <VaccinationCard
          key={v.vaccination_public_id}
          vaccination={v}
          onReload={onReload}
        />

      ))}

    </div>

  )

}