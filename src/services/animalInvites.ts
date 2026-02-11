// src/services/animalInvites.ts

import { http } from "@/services/http";

export function inviteTutorToAnimal(
  animalPublicId: string,
  personPublicId: string
) {
  return http(`/api/v1/animals/${animalPublicId}/tutor-invites`, {
    method: "POST",
    body: {
      person_public_id: personPublicId,
    },
  });
}

