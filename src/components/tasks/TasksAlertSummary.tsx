// path: /var/www/GSA/animal/frontend/src/components/tasks/TasksAlertSummary.tsx

"use client";

import { summarizeAlerts } from "@/utils/tasks-alerts";

type TaskLike = {
  id: number;
  title: string;
  scheduled_at: string | null;
  status: string;
};

type Props = {
  tasks: TaskLike[];
  onClick?: () => void;
};

export function TasksAlertSummary({ tasks, onClick }: Props) {
  const alerts = summarizeAlerts(tasks);

  if (alerts.overdue === 0 && alerts.today === 0 && alerts.tomorrow === 0) {
    return null;
  }

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border bg-white px-4 py-3 space-y-1 hover:bg-zinc-50"
    >
      <h3 className="text-sm font-semibold text-zinc-900">Tarefas pendentes</h3>

      {alerts.overdue > 0 && (
        <div className="text-sm text-red-700">⚠️ {alerts.overdue} atrasada(s)</div>
      )}

      {alerts.today > 0 && (
        <div className="text-sm text-yellow-700">🕒 {alerts.today} para hoje</div>
      )}

      {alerts.tomorrow > 0 && (
        <div className="text-sm text-blue-700">📅 {alerts.tomorrow} para amanhã</div>
      )}
    </div>
  );
}

