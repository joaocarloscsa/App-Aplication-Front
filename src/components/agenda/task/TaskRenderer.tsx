"use client";

import type { AnimalTaskItem } from "@/types/agenda";

type Props = {
  task: AnimalTaskItem;
  header: React.ReactNode;
  footer?: React.ReactNode;
  expanded?: boolean;
  children?: React.ReactNode;
};

export function TaskRenderer({
  task,
  header,
  footer,
  expanded,
  children,
}: Props) {
  return (
    <li className="rounded-md border bg-white px-4 py-3 space-y-2">
      {header}

      {task.description && (
        <p className="text-sm text-zinc-800 whitespace-pre-line">
          {task.description}
        </p>
      )}

      <p className="text-xs text-zinc-500">
        {task.scheduled_at
          ? new Date(task.scheduled_at).toLocaleString()
          : "Sem data"}
      </p>

      {expanded && children}

      {footer}
    </li>
  );
}
