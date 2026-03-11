"use client";

import { statusBadgeClasses, statusLabel } from "@/utils/task-actions";
import type { TaskStatus } from "@/utils/task-actions";

type Props = {
  status: TaskStatus;
};

export function TaskStatusBadge({ status }: Props) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        statusBadgeClasses(status),
      ].join(" ")}
    >
      {statusLabel(status)}
    </span>
  );
}
