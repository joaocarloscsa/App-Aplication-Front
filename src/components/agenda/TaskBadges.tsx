"use client";

import {
  statusBadgeClasses,
  statusLabel,
  TaskStatus,
} from "@/utils/task-actions";

type Props = {
  status: TaskStatus;
  isTreatment: boolean;
  dueSoon: boolean;
};

export function TaskBadges({
  status,
  isTreatment,
  dueSoon,
}: Props) {
  return (
    <>
      <span
        className={[
          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
          statusBadgeClasses(status),
        ].join(" ")}
      >
        {statusLabel(status)}
      </span>

      {isTreatment && (
        <span className="inline-flex items-center rounded-full bg-blue-600 text-white px-2 py-0.5 text-xs font-semibold">
          Tratamento
        </span>
      )}

      {dueSoon && status === "PLANNED" && (
        <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-medium">
          Atrasada
        </span>
      )}
    </>
  );
}
