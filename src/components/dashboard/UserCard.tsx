// /var/www/GSA/animal/frontend/src/components/dashboard/UserCard.tsx

"use client";

import { useMe } from "@/components/MeContext";
import { Card } from "./Card";
import { useDashboardOverlay } from "./DashboardOverlayContext";

function getInitials(name: string): string {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return (parts[0][0] ?? "U").toUpperCase();
  return ((parts[0][0] ?? "") + (parts[parts.length - 1][0] ?? "")).toUpperCase();
}

function getPersonDisplayName(me: any): string {
  const email: string = me?.user?.email ?? "";
  // Quando você tiver person.name no backend, priorizamos aqui.
  const personName: string = (me?.person?.name ?? "").trim();
  if (personName) return personName;

  return email ? email.split("@")[0] : "Usuário";
}

export function UserCard() {
  const { me } = useMe();
  const { openOverlay } = useDashboardOverlay();

  if (!me) return null;

  const personId: string = (me as any)?.person?.public_id ?? "";
  const displayName = getPersonDisplayName(me);

  const profilePhotoUrl: string | null =
    (me as any)?.person?.profile_photo?.url ?? null;

  const phone: string | null =
    (me as any)?.person?.contacts?.[0]?.value ?? null;

  const address: string | null = (() => {
    const a = (me as any)?.person?.addresses?.[0];
    if (!a) return null;
    const parts = [a.street, a.city, a.region, a.country, a.postal_code].filter(Boolean);
    return parts.join(", ");
  })();

  return (
    <Card title="Usuário">
      <button
        type="button"
        onClick={() => openOverlay("user")}
        className="w-full text-left"
      >
        <div className="flex items-center gap-4">
          {profilePhotoUrl ? (
            <img
              src={profilePhotoUrl}
              alt={displayName}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-300 text-sm font-semibold text-zinc-700">
              {getInitials(displayName)}
            </div>
          )}

          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-zinc-900">
              {displayName}
            </div>

            {(me as any)?.user?.email ? (
              <div className="truncate text-xs text-zinc-500">
                {(me as any).user.email}
              </div>
            ) : null}

            {personId ? (
              <div className="mt-1 font-mono text-xs text-zinc-600">
                ID: {personId}
              </div>
            ) : null}
          </div>
        </div>

        {(phone || address) ? (
          <div className="mt-3 space-y-1 text-xs text-zinc-600">
            {phone ? <div>📞 {phone}</div> : null}
            {address ? <div className="truncate">📍 {address}</div> : null}
          </div>
        ) : null}
      </button>
    </Card>
  );
}

