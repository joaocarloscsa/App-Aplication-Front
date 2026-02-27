// /var/www/GSA/animal/frontend/src/components/dashboard/CopyId.tsx

"use client";

import { useState } from "react";
import { copyToClipboard } from "@/utils/clipboard";

type Props = {
  id: string;
  showValue?: boolean; // permite esconder o texto e deixar só o ícone
  className?: string;
};

export function CopyId({
  id,
  showValue = true,
  className = "",
}: Props) {
  const [copied, setCopied] = useState(false);

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation(); // 🔒 ESSENCIAL para não expandir colapsáveis
    copyToClipboard(id);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copiar ID"
      title="Copiar ID"
      className={`
        inline-flex items-center gap-1
        select-none
        text-[11px] leading-none
        font-mono
        text-zinc-500 hover:text-zinc-900
        cursor-pointer
        ${className}
      `}
    >
      {showValue && <span>{id}</span>}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 24 24"
        className="opacity-80"
      >
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 18H8V7h11v16z" />
      </svg>

      {copied && (
        <span className="text-green-600 text-[10px] ml-1">
          ✓
        </span>
      )}
    </button>
  );
}