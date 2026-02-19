// path: /var/www/GSA/animal/frontend/src/mock/tasks.ts

export type TaskStatus = "PLANNED" | "done" | "canceled";

export type TaskActionType =
  | "created"
  | "marked_done"
  | "reopened"
  | "canceled";

export type TaskActionLog = {
  type: TaskActionType;
  at: string; // ISO
  comment?: string | null;
};

export type Task = {
  id: number;
  title: string;
  scheduled_at: string; // ISO (sem timezone ok p/ mock)
  status: TaskStatus;
  created_at: string; // ISO
  actions: TaskActionLog[]; // histórico local (mock)
};

export const mockTasks: Task[] = [
  {
    id: 1,
    title: "Dar banho",
    scheduled_at: "2026-02-15T10:00:00",
    status: "PLANNED",
    created_at: "2026-02-15T07:30:00",
    actions: [{ type: "created", at: "2026-02-15T07:30:00" }],
  },
  {
    id: 2,
    title: "Trocar coleira antipulga",
    scheduled_at: "2026-02-14T09:00:00",
    status: "PLANNED",
    created_at: "2026-02-10T09:00:00",
    actions: [{ type: "created", at: "2026-02-10T09:00:00" }],
  },
  {
    id: 3,
    title: "Dar remédio",
    scheduled_at: "2026-02-20T08:00:00",
    status: "PLANNED",
    created_at: "2026-02-12T12:00:00",
    actions: [{ type: "created", at: "2026-02-12T12:00:00" }],
  },
];

