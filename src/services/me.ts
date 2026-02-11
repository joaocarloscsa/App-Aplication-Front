// src/services/me.ts

import { http } from "@/services/http";

export type MeResponse = {
  user: {
    email: string;
  };
  person: {
    public_id: string;
    profile_photo: {
      url?: string;
    } | null;
    contacts: any[];
    addresses: any[];
  };
  animals: {
    total: number;
    items: {
      public_id: string;
      call_name: string | null;
      type: string | null;
      photo: {
        url?: string;
      } | null;
      my_role: string;
      permissions: {
        edit: boolean;
        invite: boolean;
      };
      links: {
        self: string;
        files: string;
      };
    }[];
    has_more: boolean;
  };
  storage: {
    person_used_bytes: number;
    animals_used_bytes: number;
    total_used_bytes: number;
    by_animal: {
      total: number;
      items: any[];
      has_more: boolean;
    };
  };
  alerts: {
    decisions: {
      pending: any[];
      resolved: any[];
    };
    communications: {
      unread: any[];
      acknowledged: any[];
    };
  };
};

/**
 * Carrega o contexto do usuário autenticado
 */
export async function fetchMe(): Promise<MeResponse> {
  return http<MeResponse>("/api/v1/me", {
    method: "GET",
    credentials: "include",
  });
}
