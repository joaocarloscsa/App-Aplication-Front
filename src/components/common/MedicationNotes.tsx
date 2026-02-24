"use client";

import { useState } from "react";

type Props = {
  text: string;
};

export function MedicationNotes({ text }: Props) {
  const [open, setOpen] = useState(false);

  const isLong = text.length > 100;

  if (!isLong) {
    return (
      <p className="text-xs italic text-zinc-600">
        Obs: {text}
      </p>
    );
  }

  return (
    <div className="text-xs italic text-zinc-600 space-y-1">
      <p>
        Obs: {open ? text : `${text.slice(0, 100)}…`}
      </p>

      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="text-[11px] text-zinc-500 hover:underline"
      >
        {open ? "ver menos" : "ver mais"}
      </button>
    </div>
  );
}
