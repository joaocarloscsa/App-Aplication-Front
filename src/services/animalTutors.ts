import { http } from "@/services/http";

export function revokeTutorFromAnimal(
  animalPublicId: string,
  personPublicId: string
) {
  return http(
    `/api/v1/animals/${animalPublicId}/tutors/${personPublicId}`,
    {
      method: "DELETE",
    }
  );
}

