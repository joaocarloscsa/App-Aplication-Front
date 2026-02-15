// src/services/medicationCatalog.ts

import { apiFetch } from "./api";

export type MedicationCatalogItem = {
  id: number;
  label: string;
  category: string;
  administration_type: string;
  is_system: boolean;
};

export async function getMedicationCatalog(): Promise<{
  items: MedicationCatalogItem[];
}> {
  return apiFetch("/api/v1/medication-catalog");
}


