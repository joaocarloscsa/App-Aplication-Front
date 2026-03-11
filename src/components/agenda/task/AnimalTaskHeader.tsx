"use client";

import type { AnimalTaskItem } from "@/types/agenda";

type Props = {
  task: AnimalTaskItem;
};

const statusBadge: Record<string, string> = {
  PLANNED: "bg-zinc-100 text-zinc-700",
  DONE: "bg-green-100 text-green-800",
  CANCELED: "bg-red-100 text-red-800",
};

export function AnimalTaskHeader({ task }: Props) {
  const isTreatment = task.source === "TREATMENT";

  return (
    <div className="flex justify-between items-start gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="font-medium text-zinc-900">
          {task.title}
        </p>

        {isTreatment && (
          <span className="inline-flex items-center rounded-md bg-blue-100 text-blue-900 px-2.5 py-1 text-xs font-semibold border border-blue-300">
            🏥
          </span>
        )}
      </div>

      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[task.status]}`}
      >
        {task.status}
      </span>
    </div>
  );
}
