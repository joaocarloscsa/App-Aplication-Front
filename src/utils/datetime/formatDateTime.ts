// path: frontend/src/utils/datetime/formatDateTime.ts

export function formatDateTime(value?: string | null): string {
  if (!value) return "Sem data";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return "Sem data";
  }
}
