// /var/www/GSA/animal/frontend/src/stores/auth.ts

const STORAGE_KEY = "access_token";

let accessToken: string | null = null;

// Hidratação imediata (client-only)
if (typeof window !== "undefined") {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    accessToken = stored;
  }
}

export function setAccessToken(token: string): void {
  accessToken = token;

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, token);
  }
}

export function getAccessToken(): string | null {
  if (accessToken) {
    return accessToken;
  }

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      accessToken = stored;
      return stored;
    }
  }

  return null;
}

export function clearAccessToken(): void {
  accessToken = null;

  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
