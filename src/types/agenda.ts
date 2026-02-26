// path: frontend/src/types/agenda.ts

// =====================
// ENUMS / UNIONS
// =====================

export type TaskSource =
  | 'MANUAL'
  | 'TREATMENT'
  | 'SYSTEM'
  | 'BOOKING';

export type TaskStatus =
  | 'PLANNED'
  | 'DONE'
  | 'CANCELED';

export type TaskPriority = 1 | 2 | 3;

// =====================
// RECURRENCE
// =====================

export type RecurrenceUnit =
  | 'DAY'
  | 'MONTH';

export interface TaskRecurrenceInterval {
  unit: RecurrenceUnit;
  every: number;
}

export interface TaskRecurrenceContext {
  group_id: string;

  is_master: boolean;
  is_child: boolean;

  /**
   * Posição desta ocorrência dentro do grupo de recorrência
   * Ex: 1 de 7
   */
  index: number | null;

  /**
   * Total de ocorrências planejadas no grupo
   */
  total: number | null;

  can_cancel_single: boolean;
  can_cancel_group: boolean;

  starts_at: string | null;
  ends_at: string | null;

  interval: TaskRecurrenceInterval | null;

  generated_by: TaskSource;
}

// =====================
// ACTION LOG
// =====================

// =====================
// ACTION LOG
// =====================

export interface TaskLastAction {
  action: 'created' | 'completed' | 'reopened' | 'canceled';
  at: string;
  comment?: string | null;

  by: {
    person_public_id: string;
    name: string;
  };

  source: TaskSource | null;
}


// =====================
// MAIN TASK
// =====================

export interface AnimalTaskItem {
  id: number;

  title: string;
  description: string | null;

  status: TaskStatus;
  priority: TaskPriority;

  scheduled_at: string;
  created_at: string;

  source: TaskSource;

  // 🔗 NOVOS CAMPOS (origem clínica)
  treatment_public_id?: string | null;
  treatment_schedule_public_id?: string | null;

  created_by: {
    person_public_id: string;
    name: string;
  };

  last_action: TaskLastAction | null;
  recurrence_context: TaskRecurrenceContext | null;
}

// =====================
// API RESPONSES
// =====================

export interface AnimalTaskListResponse {
  items: AnimalTaskItem[];
}
