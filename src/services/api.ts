// /var/www/GSA/animal/frontend/src/services/api.ts

import { http } from "@/services/http";

type ApiOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch(
  path: string,
  options: ApiOptions = {}
) {
  const method = (options.method ?? "GET") as
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";

  try {
    return await http(path, {
      method,
      body: options.body,
      headers: options.headers as Record<string, string> | undefined,
      credentials: options.credentials,
    });
  } catch (err: any) {
    if (err?.body) {
      throw new Error(JSON.stringify(err.body));
    }

    throw err;
  }
}