import { http } from "@/services/http";

export type FeedingRecord = {
  public_id: string;
  recorded_at: string;

  weight_value?: number | null;
  weight_unit?: string | null;

  food_type?: string | null;
  food_brand?: string | null;
  food_name?: string | null;

  meals_per_day?: number | null;
  portion_value?: number | null;
  portion_unit?: string | null;

  daily_total_value?: number | null;
  daily_total_unit?: string | null;

  description?: string | null;

  created_at?: string;
};

export async function fetchAnimalFeedingRecords(
  animalId: string
): Promise<FeedingRecord[]> {

  const res = await http<FeedingRecord[]>(
    `/api/v1/animals/${animalId}/weight-feeding`,
    { method: "GET" }
  );

  return res ?? [];
}

export async function createAnimalFeedingRecord(
  animalId: string,
  payload: {
    recorded_at: string;

    food_type?: string;
    food_brand?: string;
    food_name?: string;

    meals_per_day?: number;
    portion_value?: number;
    portion_unit?: string;

    description?: string;
  }
) {

  return http<FeedingRecord>(
    `/api/v1/animals/${animalId}/weight-feeding`,
    {
      method: "POST",
      body: payload,
    }
  );

}
