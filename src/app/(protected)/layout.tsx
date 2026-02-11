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
        <div className="flex min-h-screen flex-col bg-zinc-50">
          <TopBar />

          <div className="flex flex-1">
            {/* Desktop side menu */}
            <SideMenu />

            {/* Main content */}
            <main className="relative flex-1 overflow-x-hidden">
              {children}
            </main>
          </div>

          <DashboardOverlays />
        </div>
      </DashboardOverlayProvider>
    </AuthGuard>
  );
}

