"use client";

import { useState } from "react";

type Props = {
  text: string;
  label?: string; // ex: "Obs", "Observações"
  limit?: number; // caracteres antes de colapsar
};

export function CollapsibleNotes({
  text,
  label = "Obs",
  limit = 120,
}: Props) {
  const [open, setOpen] = useState(false);

  const isLong = text.length > limit;

  if (!isLong) {
    return (
      <p className="text-xs text-zinc-600 italic">
        {label}: {text}
      </p>
    );
  }

  return (
    <div className="text-xs text-zinc-600 italic space-y-1">
      <p>
        {label}: {open ? text : `${text.slice(0, limit)}…`}
      </p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-[11px] text-zinc-500 hover:underline"
      >
        {open ? "ver menos" : "ver mais"}
      </button>
    </div>
  );
}
