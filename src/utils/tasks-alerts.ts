// path: /var/www/GSA/animal/frontend/src/utils/tasks-alerts.ts

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

const today = startOfDay(new Date());

function diffInDays(a: Date, b: Date) {
  const ms = startOfDay(a).getTime() - startOfDay(b).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function getAlertLevel(task: {
  scheduled_at: string | null;
  status: string;
}) {
  if (task.status !== "PLANNED") return null;
  if (!task.scheduled_at) return null;

  const taskDate = new Date(task.scheduled_at);
  const daysDiff = diffInDays(taskDate, today);

  if (daysDiff < 0) return "overdue";
  if (daysDiff === 0) return "today";
  if (daysDiff === 1) return "tomorrow";
  return null;
}

export function summarizeAlerts(tasks: Array<{ scheduled_at: string | null; status: string }>) {
  return tasks.reduce(
    (acc, task) => {
      const level = getAlertLevel(task);
      if (!level) return acc;
      acc[level]++;
      return acc;
    },
    { overdue: 0, today: 0, tomorrow: 0 }
  );
}

