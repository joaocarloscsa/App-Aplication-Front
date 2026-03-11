"use client";

import type { ClinicalProblemSummaryDTO } from "@/services/clinicalProblems";

type Props = {
  items: ClinicalProblemSummaryDTO[];
  selected: string[];
  onChange(next: string[]): void;
};

export function ProblemSelector({ items, selected, onChange }: Props) {
  function toggle(problemId: string) {
    if (selected.includes(problemId)) {
      onChange(selected.filter((id) => id !== problemId));
      return;
    }

    onChange([...selected, problemId]);
  }

  if (items.length === 0) {
    return (
      <div className="rounded border bg-zinc-50 px-3 py-2 text-xs text-zinc-500">
        Nenhum problema clínico disponível para vincular.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const checked = selected.includes(item.public_id);

        return (
          <label
            key={item.public_id}
            className="flex cursor-pointer items-start gap-3 rounded border bg-white px-3 py-2"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(item.public_id)}
              className="mt-1"
            />

            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-900">
                {item.title}
              </p>

              <p className="text-xs text-zinc-500">
                {item.status.label}
              </p>

              {item.current_diagnosis ? (
                <p className="text-xs text-zinc-600">
                  {item.current_diagnosis}
                </p>
              ) : null}
            </div>
          </label>
        );
      })}
    </div>
  );
}
