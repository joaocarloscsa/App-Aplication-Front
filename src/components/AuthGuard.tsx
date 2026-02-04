// /var/www/GSA/animal/frontend/src/components/AuthGuard.tsx

"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/components/MeContext";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { me, loading } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (!loading && me === null) {
      router.replace("/login");
    }
  }, [me, loading, router]);

  if (loading || me === null) {
    return null;
  }

  return <>{children}</>;
}


