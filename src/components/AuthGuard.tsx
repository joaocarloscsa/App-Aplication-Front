// /var/www/GSA/animal/frontend/src/components/AuthGuard.tsx

"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/components/MeContext";

type Props = {
  children: ReactNode;
};

export function AuthGuard({ children }: Props) {
  const { me, loading } = useMe();
  const router = useRouter();

  // Redirecionamento é efeito colateral → useEffect
  useEffect(() => {
    if (!loading && me === null) {
      router.replace("/login");
    }
  }, [loading, me, router]);

  // Enquanto carrega, estado explícito
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-sm text-zinc-500">Carregando…</span>
      </div>
    );
  }

  // Não autenticado → bloqueia render enquanto redireciona
  if (me === null) {
    return null;
  }

  // Autenticado
  return <>{children}</>;
}

