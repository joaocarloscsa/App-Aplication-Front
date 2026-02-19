// path: src/services/api.ts

import { ENV } from "@/lib/env";
import { getAccessToken } from "@/stores/auth";

type ApiOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch(
  path: string,
  options: ApiOptions = {}
) {
  const token = getAccessToken();

  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");

  if (options.auth !== false && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${ENV.API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    // tenta extrair erro JSON, se existir
    let message = `HTTP ${res.status}`;

    try {
      const text = await res.text();
      if (text) {
        message = text;
      }
    } catch {
      // ignora
    }

    throw new Error(message);
  }

  // ✅ 204 = sem corpo
  if (res.status === 204) {
    return null;
  }

  // proteção extra: corpo vazio
  const text = await res.text();
  if (!text) {
    return null;
  }

  return JSON.parse(text);
}
