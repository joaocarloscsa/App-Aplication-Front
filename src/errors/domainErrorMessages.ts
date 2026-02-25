// /src/errors/domainErrorMessages.ts

export function translateDomainError(code: string): string {
  switch (code) {
    case "treatment_has_active_schedules":
      return "Não é possível finalizar o tratamento enquanto existirem medicações ativas.";

    case "invalid_status_transition":
      return "Essa ação não é permitida no estado atual.";

    case "notes_required":
      return "É obrigatório informar uma observação.";

    case "unauthenticated":
      return "Sua sessão expirou. Faça login novamente.";

    default:
      return "Não foi possível concluir a ação.";
  }
}
