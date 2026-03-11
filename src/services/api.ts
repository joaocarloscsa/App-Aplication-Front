// /var/www/GSA/animal/frontend/src/services/api.ts

import { http } from "@/services/http";

type ApiOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {

  const method = (options.method ?? "GET") as
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";

  let body = options.body;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // 🔧 SERIALIZA JSON automaticamente
  if (
    body &&
    typeof body === "object" &&
    !(body instanceof FormData)
  ) {
    body = JSON.stringify(body);

    if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }
  }

  try {
    return await http(path, {
      method,
      body,
      headers,
      credentials: options.credentials,
    });
  } catch (err: any) {
    if (err?.body) {
      throw new Error(JSON.stringify(err.body));
    }

    throw err;
  }
}