"use client"

import { useParams } from "next/navigation"

import { useAnimal } from "@/hooks/useAnimal"
import { useAnimalVaccinations } from "@/hooks/useAnimalVaccinations"

import { ImmunityMap } from "@/components/animals/clinic/vaccinations/ImmunityMap"
import { VaccinationRecommendations } from "@/components/animals/clinic/vaccinations/VaccinationRecommendations"
import { VaccinationCreateForm } from "@/components/animals/clinic/vaccinations/VaccinationCreateForm"
import { AnimalVaccinationHistory } from "@/components/animals/clinic/vaccinations/AnimalVaccinationHistory"
import type { CreateAnimalVaccinationResponse } from "@/services/animalVaccinations"

export default function VaccinationsPage() {

  const { animalId } =
    useParams<{ animalId: string }>()

  const {
    animal,
    loading: loadingAnimal
  } = useAnimal(animalId)

  const {
    vaccinations,
    loading: loadingVaccinations,
    reload
  } = useAnimalVaccinations(animalId)

  if (loadingAnimal || loadingVaccinations) {
    return <p>Carregando…</p>
  }

  if (!animal) {
    return <p>Animal não encontrado.</p>
  }

  return (

    <div className="space-y-4">

      <VaccinationCreateForm
        animalPublicId={animalId}
        animalType={animal.type}
        onCreated={(response: CreateAnimalVaccinationResponse) => {

  // 1. Atualiza lista principal
  reload()

  // 2. (IMPORTANTE) — aqui você poderia evitar refetch completo
  // se quiser evoluir depois:
  // - atualizar estado local com response.vaccination
  // - atualizar imunidade com response.immunity
  // - injetar task no estado de agenda

}}
        onCancel={() => {}}
      />

      <ImmunityMap
        animalId={animalId}
      />

      <VaccinationRecommendations
        animalId={animalId}
      />

      <AnimalVaccinationHistory
        vaccinations={vaccinations}
        onReload={reload}
      />

    </div>

  )

}