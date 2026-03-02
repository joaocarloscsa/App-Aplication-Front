"use client";

import { useState } from "react";
import { BaseModal } from "./BaseModal";
import { PromptOptions } from "./types";

export function PromptModal({
  options,
  resolve,
  onClose,
}: {
  options: PromptOptions;
  resolve: (value: string | null) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState(options.defaultValue ?? "");

  return (
    <BaseModal
      onClose={() => {
        resolve(null);
        onClose();
      }}
    >
      <h3 className="text-lg font-semibold">
        {options.title ?? "Entrada"}
      </h3>

      <label className="text-sm text-zinc-700">
        {options.label}
      </label>

      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border rounded px-3 py-2 text-sm"
      />

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={() => {
            resolve(null);
            onClose();
          }}
          className="px-4 py-2 text-sm"
        >
          {options.cancelLabel ?? "Cancelar"}
        </button>

        <button
          onClick={() => {
            resolve(value.trim() || null);
            onClose();
          }}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm rounded"
        >
          {options.confirmLabel ?? "Confirmar"}
        </button>
      </div>
    </BaseModal>
  );
}
