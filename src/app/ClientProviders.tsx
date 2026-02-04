// /var/www/GSA/animal/frontend/src/app/ClientProviders.tsx

"use client";

import { ReactNode } from "react";
import { MeProvider } from "@/components/MeContext";

export function ClientProviders({ children }: { children: ReactNode }) {
  return <MeProvider>{children}</MeProvider>;
}

