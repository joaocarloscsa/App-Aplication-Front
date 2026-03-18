"use client"

import { useState } from "react"
import { useParams } from "next/navigation"

import { useAnimal } from "@/hooks/useAnimal"
import { useAnimalVaccinations } from "@/hooks/useAnimalVaccinations"

import { VaccinationCreateForm } from "@/components/animals/clinic/vaccinations/VaccinationCreateForm"
import { AnimalVaccinationHistory } from "@/components/animals/clinic/vaccinations/AnimalVaccinationHistory"
import { ImmunityMap } from "@/components/animals/clinic/vaccinations/ImmunityMap"
import { VaccinationRecommendations } from "@/components/animals/clinic/vaccinations/VaccinationRecommendations"

import type {
  CreateAnimalVaccinationResponse
} from "@/services/animalVaccinations"

export default function VaccinationsPage() {
  const { animalId } = useParams<{ animalId: string }>()

  const {
    animal,
    loading: loadingAnimal
  } = useAnimal(animalId)

  const {
    vaccinations,
    reload,
    loading: loadingVaccinations
  } = useAnimalVaccinations(animalId)

  const [refreshKey, setRefreshKey] = useState(0)

  async function handleVaccinationCreated(
    _response: CreateAnimalVaccinationResponse
  ) {
    await reload()
    setRefreshKey((prev) => prev + 1)
  }

  if (loadingAnimal || loadingVaccinations) {
    return <p>Carregando...</p>
  }

  if (!animal) {
    return <p>Animal não encontrado.</p>
  }

  return (
    <div className="space-y-6">
      <VaccinationCreateForm
        animalPublicId={animalId}
        animalType={animal.type}
        onCreated={handleVaccinationCreated}
        onCancel={() => {}}
      />

      <ImmunityMap
        key={`immunity-${refreshKey}`}
        animalId={animalId}
      />

      <VaccinationRecommendations
        key={`recommendations-${refreshKey}`}
        animalId={animalId}
      />

      <AnimalVaccinationHistory
        vaccinations={vaccinations}
        onReload={reload}
      />
    </div>
  )
}