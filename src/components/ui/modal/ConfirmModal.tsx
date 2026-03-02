"use client";

import { BaseModal } from "./BaseModal";
import { ConfirmOptions } from "./types";

export function ConfirmModal({
  options,
  resolve,
  onClose,
}: {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
  onClose: () => void;
}) {
  const confirmLabel = options.confirmLabel ?? "Confirmar";
  const cancelLabel = options.cancelLabel ?? "Cancelar";
  const hideCancel = options.hideCancel ?? false;
  const variant = options.variant ?? "default";

  const confirmButtonClass =
    variant === "danger"
      ? "px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
      : "px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm rounded";

  return (
    <BaseModal
      onClose={() => {
        resolve(false);
        onClose();
      }}
    >
      <h3 className="text-lg font-semibold">
        {options.title ?? "Confirmação"}
      </h3>

      <p className="text-sm text-zinc-700 whitespace-pre-line">
        {options.message}
      </p>

      <div className="flex justify-end gap-3 pt-4">
        {!hideCancel && (
          <button
            onClick={() => {
              resolve(false);
              onClose();
            }}
            className="px-4 py-2 text-sm"
          >
            {cancelLabel}
          </button>
        )}

        <button
          onClick={() => {
            resolve(true);
            onClose();
          }}
          className={confirmButtonClass}
        >
          {confirmLabel}
        </button>
      </div>
    </BaseModal>
  );
}
