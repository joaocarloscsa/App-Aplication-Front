import { http } from "@/services/http";

export type WeightRecord = {
  public_id: string;
  weight_value: number;
  weight_unit: "kg" | "g";
  recorded_at: string;
};

export async function fetchAnimalWeightRecords(
  animalId: string
): Promise<WeightRecord[]> {

  const res = await http<WeightRecord[]>(
    `/api/v1/animals/${animalId}/weights`,
    { method: "GET" }
  );

  return res ?? [];
}

export async function createAnimalWeightRecord(
  animalId: string,
  payload: {
    weight_value: number;
    weight_unit: "kg" | "g";
    recorded_at: string;
  }
) {

  return http(
    `/api/v1/animals/${animalId}/weights`,
    {
      method: "POST",
      body: payload,
    }
  );

}
