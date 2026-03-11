"use client";

import { useState } from "react";

export function useAsyncAction<T extends (...args: any[]) => Promise<any>>(
  action: T,
  onSuccess?: () => void
) {
  const [loading, setLoading] = useState(false);

  async function execute(...args: Parameters<T>) {
    try {
      setLoading(true);
      await action(...args);

      if (onSuccess) {
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    execute,
    loading,
  };
}
