// src/services/api.ts

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
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json();
}

