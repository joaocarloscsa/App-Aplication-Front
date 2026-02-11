// src/components/layout/TopBar.tsx

"use client";

import { useState } from "react";
import { useMe } from "@/components/MeContext";
import { logout } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useDashboardOverlay } from "@/components/dashboard/DashboardOverlayContext";
import { SideMenu } from "@/components/layout/SideMenu";

function getPersonDisplayName(me: any): string {
  const email: string = me?.user?.email ?? "";
  const personName: string = (me?.person?.name ?? "").trim();
  const { reloadMe } = useMe();

  if (personName) return personName;
  return email ? email.split("@")[0] : "Usuário";
}

function countAlerts(me: any): number {
  const decisions = me?.alerts?.decisions?.pending?.length ?? 0;
  const communications =
    me?.alerts?.communications?.unread?.length ?? 0;
  return decisions + communications;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

export default function TopBar() {
  const { reloadMe } = useMe();

  const { me, resetMe } = useMe();
  const router = useRouter();
  const { openOverlay } = useDashboardOverlay();

  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayName = getPersonDisplayName(me);
  const profilePhotoUrl: string | null =
    me?.person?.profile_photo?.url ?? null;

  const personId: string | null =
    me?.person?.public_id ?? null;

  const alertCount = countAlerts(me);

  async function handleLogout() {
    await logout();
    resetMe();
    router.replace("/login");
  }

  async function handleCopyId() {
    if (!personId) return;
    await copyToClipboard(personId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4">
        {/* Mobile menu */}
        <div className="md:hidden">
          <SideMenu mobile />
        </div>
        {/* Logo / title */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-xs font-semibold text-white">
            GSA
          </div>

          <div className="leading-tight">
            <div className="text-sm font-semibold text-zinc-900">
              GSA Animal
            </div>
            {personId && (
              <button
                type="button"
                onClick={handleCopyId}
                className="flex items-center gap-1 font-mono text-[11px] text-zinc-600 hover:text-zinc-900"
                title="Clique para copiar o ID do usuário"
              >
                <span> {personId}</span>
                <span>📋</span>
                {copied && (
                  <span className="text-green-600">copiado</span>
                )}
              </button>
            )}
          </div>
        </div>
        <div className="flex-1" />
              <button
        type="button"
        onClick={reloadMe}
        title="Atualizar dashboard"
        className="relative rounded-full p-2 hover:bg-zinc-100"
      >
        🔄
      </button>
        {/* Right actions */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => openOverlay("alerts")}
            className="relative rounded-full p-2 hover:bg-zinc-100"
            aria-label="Alertas"
          >
            🔔
            {alertCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white">
                {alertCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(v => !v)}
              className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-zinc-100"
            >
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt={displayName}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-300 text-xs font-semibold">
                  {displayName[0]?.toUpperCase() ?? "U"}
                </div>
              )}

              <span className="hidden sm:block text-sm">
                {displayName}
              </span>
            </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border bg-white shadow-lg">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/dashboard/profile");
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-zinc-100"
                  >
                    Editar perfil
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-zinc-100"
                  >
                    Sair
                  </button>
                </div>
              )}

          </div>
        </div>
      </div>
    </header>
  );
}

