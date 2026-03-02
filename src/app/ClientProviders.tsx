"use client";

import { ReactNode } from "react";
import { MeProvider } from "@/components/MeContext";
import { ModalProvider } from "@/components/ui/modal/ModalProvider";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ModalProvider>
      <MeProvider>{children}</MeProvider>
    </ModalProvider>
  );
}