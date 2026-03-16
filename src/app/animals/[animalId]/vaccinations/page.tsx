"use client"

import { useParams } from "next/navigation"

import { useAnimal } from "@/hooks/useAnimal"
import { useAnimalVaccinations } from "@/hooks/useAnimalVaccinations"

import { ImmunityMap } from "@/components/animals/clinic/vaccinations/ImmunityMap"
import { VaccinationRecommendations } from "@/components/animals/clinic/vaccinations/VaccinationRecommendations"
import { VaccinationCreateForm } from "@/components/animals/clinic/vaccinations/VaccinationCreateForm"
import { AnimalVaccinationHistory } from "@/components/animals/clinic/vaccinations/AnimalVaccinationHistory"

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
        onCreated={reload}
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