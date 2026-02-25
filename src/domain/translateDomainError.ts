import { DomainErrorMessages } from "./errors";

export function translateDomainError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    const code = String((error as any).code);
    return DomainErrorMessages[code] ?? "Ocorreu um erro inesperado.";
  }

  return "Ocorreu um erro inesperado.";
}
