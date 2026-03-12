// path: frontend/src/services/vaccineCatalog.ts

import { http } from "@/services/http";

export type VaccineCatalogItem = {
  code: string;
  name: string;
  protocol: string;
};

export async function fetchVaccineCatalog(
  animalType: string
): Promise<VaccineCatalogItem[]> {

  return http<VaccineCatalogItem[]>(
    `/api/v1/vaccine-catalog/${animalType}`
  );

}
