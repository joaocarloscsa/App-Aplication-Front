import { http } from "./http";

export type AnimalMedicationItem = {
  id: number;
  medication: { id: number; label: string };
  commercial_name?: string | null;
  manufacturer?: string | null;
  applied_at: string;
  dosage?: string | null;
  notes?: string | null;
  recorded_by: {
    person_public_id: string;
    name: string;
  } | null;
  user_can_edit: boolean;
};


export async function getAnimalMedications(animalId: string) {
  return http<{ items: AnimalMedicationItem[] }>(
    `/api/v1/animals/${animalId}/care-medications`
  );
}

export async function createAnimalMedication(
  animalId: string,
  data: Record<string, unknown>
) {
  return http(
    `/api/v1/animals/${animalId}/care-medications`,
    {
      method: "POST",
      body: data,
    }
  );
}

export async function updateAnimalMedication(
  animalId: string,
  id: number,
  data: Record<string, unknown>
) {
  return http(
    `/api/v1/animals/${animalId}/care-medications/${id}`,
    {
      method: "PUT",
      body: data,
    }
  );
}

export async function deleteAnimalMedication(
  animalId: string,
  id: number
) {
  return http(
    `/api/v1/animals/${animalId}/care-medications/${id}`,
    {
      method: "DELETE",
    }
  );
}
