// /var/www/GSA/animal/frontend/src/components/dashboard/UserCard.tsx

"use client";

import { useMe } from "@/components/MeContext";
import { Card } from "./Card";
import { useDashboardOverlay } from "./DashboardOverlayContext";

function getPersonDisplayName(me: any): string {
  const email: string = me?.user?.email ?? "";
  const personName: string = (me?.person?.name ?? "").trim();
  if (personName) return personName;
  return email ? email.split("@")[0] : "Usuário";
}

export function UserCard() {
  const { me } = useMe();
  const { openOverlay } = useDashboardOverlay();

  if (!me) return null;

  const displayName = getPersonDisplayName(me);

  const photoUrl: string | null =
    me?.person?.profile_photo?.url ?? null;

  const personId: string | null =
    me?.person?.public_id ?? null;

  const phone: string | null =
    me?.person?.contacts?.[0]?.value ?? null;

  const address: string | null = (() => {
    const a = me?.person?.addresses?.[0];
    if (!a) return null;
    const parts = [
      a.street,
      a.city,
      a.region,
      a.country,
      a.postal_code,
    ].filter(Boolean);
    return parts.join(", ");
  })();

  return (
    <Card title="Usuário">
      <div className="flex items-start gap-4">
        {/* FOTO — SOMENTE VISUAL */}
        <div className="h-20 w-20 rounded-lg bg-zinc-200 overflow-hidden shrink-0">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-zinc-500">
              Sem foto
            </div>
          )}
        </div>

        {/* DADOS — ABRE OVERLAY */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => openOverlay("user")}
          onKeyDown={(e) => {
            if (e.key === "Enter") openOverlay("user");
          }}
          className="flex-1 min-w-0 cursor-pointer"
        >
          <div className="truncate text-sm font-semibold text-zinc-900">
            {displayName}
          </div>

          {me?.user?.email && (
            <div className="truncate text-xs text-zinc-500">
              {me.user.email}
            </div>
          )}

          {personId && (
            <div className="mt-1 font-mono text-xs text-zinc-600">
              {personId}
            </div>
          )}

          {(phone || address) && (
            <div className="mt-3 space-y-1 text-xs text-zinc-600">
              {phone && <div>📞 {phone}</div>}
              {address && (
                <div className="truncate">📍 {address}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

