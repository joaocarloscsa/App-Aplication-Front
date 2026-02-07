// src/components/AuthGuard.tsx

"use client";

import { ReactNode } from "react";
import { useMe } from "@/components/MeContext";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { me, loading } = useMe();

  // Enquanto está carregando, bloqueia tudo
  if (loading) {
    return null;
  }

  // Não autenticado → NÃO renderiza, mas também NÃO redireciona
  if (me === null) {
    return null;
  }

  return <>{children}</>;
}

