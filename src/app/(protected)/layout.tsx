// src/app/(protected)/layout.tsx

import { ReactNode } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import TopBar from "@/components/layout/TopBar";
import { DashboardOverlayProvider } from "@/components/dashboard/DashboardOverlayContext";
import { DashboardOverlays } from "@/components/dashboard/DashboardOverlays";
import { SideMenu } from "@/components/layout/SideMenu";

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardOverlayProvider>
        <div className="min-h-screen bg-zinc-50 flex flex-col">
          <TopBar />

          {/* CONTAINER PRINCIPAL */}
          <div className="mx-auto w-full max-w-7xl flex flex-col md:flex-row flex-1">
            {/* SIDEBAR — APENAS DESKTOP */}
            <div className="hidden md:block shrink-0">
              <SideMenu />
            </div>

            {/* CONTEÚDO */}
            <main className="relative flex-1 w-full overflow-x-hidden px-4 py-6">
              {children}
            </main>
          </div>

          <DashboardOverlays />
        </div>
      </DashboardOverlayProvider>
    </AuthGuard>
  );
}
