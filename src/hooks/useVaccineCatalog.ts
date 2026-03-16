"use client"

import { useEffect, useState } from "react"
import {
  fetchVaccineManufacturers,
  fetchManufacturerVaccines,
  VaccineManufacturerDTO,
  VaccineProductDTO
} from "@/services/vaccineCatalog"

export function useVaccineCatalog(species: string) {

  const [manufacturers, setManufacturers] = useState<VaccineManufacturerDTO[]>([])
  const [vaccines, setVaccines] = useState<VaccineProductDTO[]>([])

  const [loadingManufacturers, setLoadingManufacturers] = useState(false)
  const [loadingVaccines, setLoadingVaccines] = useState(false)

  async function loadManufacturers() {

    try {

      setLoadingManufacturers(true)

      const data = await fetchVaccineManufacturers()

      setManufacturers(data)

    } catch (e) {

      console.error("Erro ao carregar fabricantes", e)

    } finally {

      setLoadingManufacturers(false)

    }

  }

  async function loadVaccines(manufacturerId: number) {

    try {

      setLoadingVaccines(true)

      const data = await fetchManufacturerVaccines(
        manufacturerId,
        species
      )

      setVaccines(data)

    } catch (e) {

      console.error("Erro ao carregar vacinas", e)

    } finally {

      setLoadingVaccines(false)

    }

  }

  useEffect(() => {

    loadManufacturers()

  }, [])

  return {

    manufacturers,
    vaccines,

    loadingManufacturers,
    loadingVaccines,

    loadVaccines

  }

}