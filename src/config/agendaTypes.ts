export type AgendaType = "overview" | "tasks" | "events" | "appointments";

export const agendaTypeConfig: Record<
  AgendaType,
  {
    label: string;
    color: string;
    description: string;
  }
> = {
  overview: {
    label: "Agenda",
    color: "#71717A", // zinc
    description: "Tarefas, eventos e compromissos relacionados a este animal.",
  },
  tasks: {
    label: "Tarefa",
    color: "#F59E0B", // amber
    description: "Tarefas associadas a este animal.",
  },
  events: {
    label: "Evento",
    color: "#3B82F6", // blue (exemplo)
    description: "Eventos associados a este animal.",
  },
  appointments: {
    label: "Agendamento",
    color: "#10B981", // emerald (exemplo)
    description: "Agendamentos associados a este animal.",
  },
};

