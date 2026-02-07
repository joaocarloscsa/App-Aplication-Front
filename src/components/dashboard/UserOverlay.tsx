"use client";

import { useDashboardOverlay } from "./DashboardOverlayContext";
import { useMe } from "@/components/MeContext";
import { CopyId } from "./CopyId";


export function UserOverlay() {
  const { activeOverlay, closeOverlay } = useDashboardOverlay();
  const { me } = useMe();

  if (activeOverlay !== "user" || !me) return null;

  const person = (me as any).person ?? {};
  const user = (me as any).user ?? {};
  const contacts = (me as any).person?.contacts ?? [];
  const addresses = (me as any).person?.addresses ?? [];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[80vh] overflow-hidden">
        {/* Close */}
        <button
          onClick={closeOverlay}
          className="absolute right-4 top-4 z-10 text-zinc-500 hover:text-zinc-900"
        >
          ✕
        </button>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {/* HEADER */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-zinc-200 overflow-hidden">
            {person?.profile_photo?.url ? (
              <img
                src={person.profile_photo.url}
                alt="Foto do usuário"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-bold text-zinc-600">
                {user.email[0].toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-900">{user.email}</p>
            <CopyId id={person.public_id} label="User ID" />
          </div>
        </div>


          {/* CONTATOS */}
          {contacts.length > 0 && (
            <section className="mt-6">
              <h3 className="text-sm font-semibold text-zinc-600 mb-2">
                Contatos
              </h3>
              <ul className="space-y-1 text-sm">
                {contacts.map((c: any) => (
                  <li key={c.public_id}>
                    {c.type}: {c.value}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ENDEREÇO */}
          {addresses.length > 0 && (
            <section className="mt-6">
              <h3 className="text-sm font-semibold text-zinc-600 mb-2">
                Endereços
              </h3>

              <ul className="space-y-2 text-sm text-zinc-700">
                {addresses.map((a: any) => (
                  <li key={a.public_id}>
                    <span className="font-medium capitalize">
                      {a.address_type ?? "Endereço"}:
                    </span>{" "}
                    {[a.street, a.city, a.region, a.country]
                      .filter(Boolean)
                      .join(", ")}
                  </li>
                ))}
              </ul>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
