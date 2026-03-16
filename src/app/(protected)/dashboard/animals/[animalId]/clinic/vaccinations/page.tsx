"use client"

import { useParams } from "next/navigation"

import { useAnimalVaccinations } from "@/hooks/useAnimalVaccinations"
import { useAnimal } from "@/hooks/useAnimal"

import { VaccinationCreateForm } from "@/components/animals/clinic/vaccinations/VaccinationCreateForm"
import { AnimalVaccinationHistory } from "@/components/animals/clinic/vaccinations/AnimalVaccinationHistory"

export default function VaccinationsPage() {

  const { animalId } =
    useParams<{ animalId: string }>()

  const {
    vaccinations,
    loading,
    reload
  } = useAnimalVaccinations(animalId)

  const {
    animal,
    loading: loadingAnimal
  } = useAnimal(animalId)

  if (loading || loadingAnimal)
    return <p>Carregando vacinas…</p>

  if (!animal)
    return <p>Animal não encontrado.</p>

  return (

    <div className="space-y-4">

      <VaccinationCreateForm

        animalPublicId={animalId}

        animalType={animal.type}

        onCreated={reload}

        onCancel={() => {}}

      />

      <AnimalVaccinationHistory
        vaccinations={vaccinations}
        onReload={reload}
      />

    </div>

  )

}