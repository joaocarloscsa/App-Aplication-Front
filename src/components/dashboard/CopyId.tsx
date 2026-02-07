"use client";


import { copyToClipboard } from "@/utils/clipboard";
import { useState } from "react";

type Props = {
  id: string;
  label?: string;
};

export function CopyId({ id, label = "ID" }: Props) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    copyToClipboard(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 font-mono text-xs text-zinc-600 hover:text-zinc-900"
      title="Clique para copiar"
    >
      <span>{label}:</span>
      <span className="truncate">{id}</span>
      {copied && <span className="text-green-600">copiado</span>}
    </button>
  );
}
