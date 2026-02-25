export const DomainErrorMessages: Record<string, string> = {
  treatment_not_active:
    "Não é possível retomar a medicação enquanto o tratamento estiver suspenso.",

  treatment_has_active_schedules:
    "O tratamento só pode ser finalizado após todas as medicações serem concluídas.",

  invalid_status_transition:
    "Essa alteração de estado não é permitida no momento.",

  notes_required:
    "É obrigatório informar uma observação para essa ação.",

  schedule_not_paused:
    "A medicação precisa estar suspensa para ser retomada.",

  schedule_not_active:
    "A medicação precisa estar ativa para ser suspensa.",
};
