// /var/www/GSA/animal/frontend/src/services/animals.ts

import { http } from "@/services/http";

/* =========================
   TYPES
========================= */

export type ParentByPublicId = {
  public_id: string;
};

export type ParentExternal = {
  microchip_number?: string;
  registry_issuer?: string;
  registry_number?: string;
  name?: string;
};

export type ParentPayload = ParentByPublicId | ParentExternal;

/* =========================
   LIST / SEARCH TYPES
========================= */

export type AnimalListItem = {
  public_id: string;
  call_name: string | null;
  official_name?: string | null;
  type: string | null;
  photo?: {
    url?: string;
  };
};

/* =========================
   CREATE TYPES
========================= */

export type CreateAnimalBasicPayload = {
  type?: string;
  sex?: "male" | "female" | "unknown";
  coat_color?: string;
  coat_type?: string;
  breed?: string;
  call_name?: string;
  official_name?: string;
  birth_date?: string;
  registry_issuer?: string;
};

export type CreateSingleAnimalPayload = {
  basic?: CreateAnimalBasicPayload;
  father?: ParentPayload;
  mother?: ParentPayload;
};

export type CreateLitterPayload = {
  count: number;
} & CreateAnimalBasicPayload & {
    father?: ParentPayload;
    mother?: ParentPayload;
  };

/* =========================
   LIST
========================= */

export async function fetchAnimals(): Promise<AnimalListItem[]> {
  const res = await http<{ items: AnimalListItem[] }>(
    "/api/v1/animals",
    { method: "GET" }
  );
  return res.items ?? [];
}

/* =========================
   SEARCH
========================= */

export async function searchAnimals(
  query: string
): Promise<AnimalListItem[]> {
  if (!query || query.length < 2) return [];

  const res = await http<{ items: AnimalListItem[] }>(
    `/api/v1/animals/search?q=${encodeURIComponent(query)}`,
    { method: "GET" }
  );

  return res.items ?? [];
}

/* =========================
   CREATE (DECISÃO CANÔNICA)
========================= */

export async function createAnimal(
  params:
    | {
        mode: "single";
        data: CreateSingleAnimalPayload;
      }
    | {
        mode: "litter";
        data: CreateLitterPayload;
      }
) {
  if (params.mode === "litter") {
    return http("/api/v1/litters", {
      method: "POST",
      body: params.data,
    });
  }

  return http("/api/v1/animals", {
    method: "POST",
    body: params.data,
  });
}

/* =========================
   UPDATE BASIC
========================= */

export type UpdateAnimalBasicPayload = {
  call_name?: string;
  official_name?: string;
  type?: string;
  sex?: "male" | "female";
  breed?: string;
  coat_color?: string;
  coat_type?: string;
  birth_date?: string;
  microchip_number?: string;
  registry_issuer?: string;
  registry_number?: string;
};

export async function updateAnimal(
  publicId: string,
  basic: UpdateAnimalBasicPayload
): Promise<void> {
  await http(`/api/v1/animals/${publicId}`, {
    method: "PATCH",
    body: { basic },
  });
}

/* =========================
   UPDATE PARENTS
========================= */

export type ParentPatch =
  | { public_id: string }
  | {
      official_name?: string;
      microchip_number?: string;
      registry_issuer?: string;
      registry_number?: string;
    };

export async function updateAnimalParents(
  publicId: string,
  payload: {
    father?: ParentPatch;
    mother?: ParentPatch;
  }
): Promise<void> {
  await http(`/api/v1/animals/${publicId}`, {
    method: "PATCH",
    body: {
      parents: payload,
    },
  });
}

/* =========================
   GET ONE
========================= */

export async function getAnimal<T = any>(publicId: string): Promise<T> {
  return http<T>(`/api/v1/animals/${publicId}`, {
    method: "GET",
  });
}

