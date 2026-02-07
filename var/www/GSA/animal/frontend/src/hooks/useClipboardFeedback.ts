// /var/www/GSA/animal/frontend/src/hooks/useClipboardFeedback.ts

"use client";

import { useState } from "react";

export function useClipboardFeedback(timeoutMs = 1000) {
  const [copied, setCopied] = useState(false);

  function trigger() {
    setCopied(true);
    setTimeout(() => setCopied(false), timeoutMs);
  }

  return { copied, trigger };
}

