// /var/www/GSA/animal/frontend/src/app/(protected)/layout.tsx

import { ReactNode } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import TopBar from "@/components/layout/TopBar";
import { DashboardOverlayProvider } from "@/components/dashboard/DashboardOverlayContext";
import { DashboardOverlays } from "@/components/dashboard/DashboardOverlays";

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardOverlayProvider>
        <TopBar />
        <main className="relative">
          {children}
          <DashboardOverlays />
        </main>
      </DashboardOverlayProvider>
    </AuthGuard>
  );
}

