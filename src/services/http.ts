// /var/www/GSA/animal/frontend/src/services/http.ts

import { ENV } from "@/lib/env";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "@/stores/auth";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HttpOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  credentials?: RequestCredentials;
};

export class HttpError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`HTTP Error ${status}`);
    this.status = status;
    this.body = body;
  }
}

/**
 * =========================
 * Refresh token mutex
 * =========================
 */

let refreshPromise: Promise<string | null> | null = null;

async function refreshToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await fetch(
        `${ENV.API_BASE_URL}/api/token/refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        clearAccessToken();
        return null;
      }

      const data = await response.json();
      setAccessToken(data.token);

      return data.token;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

/**
 * =========================
 * HTTP client
 * =========================
 */

export async function http<T>(
  path: string,
  options: HttpOptions = {},
  retry = true
): Promise<T> {
  const token = getAccessToken();
  const isFormData = options.body instanceof FormData;

  const body: BodyInit | undefined =
    options.body instanceof FormData
      ? options.body
      : options.body
      ? JSON.stringify(options.body)
      : undefined;

  const response = await fetch(`${ENV.API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    body,
    credentials: options.credentials ?? "include",
  });

  // 401 → tenta refresh UMA VEZ, coordenado por mutex
  if (response.status === 401 && retry && !isFormData) {
    const newToken = await refreshToken();

    if (!newToken) {
      throw new HttpError(401, null);
    }

    return http<T>(path, options, false);
  }

  if (!response.ok) {
    let errorBody: unknown = null;
    try {
      errorBody = await response.json();
    } catch {}
    throw new HttpError(response.status, errorBody);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

