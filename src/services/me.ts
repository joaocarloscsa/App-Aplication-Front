// /var/www/GSA/animal/frontend/src/services/me.ts

import { http } from "@/services/http";

export type MeResponse = {
  user: unknown;
  person: unknown;
  storage: unknown;
  alerts: {
    pending: unknown[];
  };
};

export async function fetchMe(): Promise<MeResponse> {
  return http<MeResponse>("/api/v1/me", {
  method: "GET",
  credentials: "include",
});

}

