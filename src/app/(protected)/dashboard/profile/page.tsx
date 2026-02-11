// src/app/(protected)/dashboard/profile/page.tsx

"use client";

import { useMe } from "@/components/MeContext";
import { UserProfileForm } from "@/components/profile/UserProfileForm";

export default function ProfilePage() {
  const { me, reloadMe } = useMe();

  if (!me) {
    return (
      <div className="p-6 text-sm text-zinc-500">
        Carregando perfil…
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <h1 className="text-xl font-semibold text-zinc-900">
        Perfil do usuário
      </h1>

      <UserProfileForm
        person={me.person}
        user={me.user}
        onUpdated={reloadMe}
      />
    </section>
  );
}

