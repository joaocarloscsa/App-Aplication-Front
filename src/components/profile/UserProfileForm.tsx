// /var/www/GSA/animal/frontend/src/components/profile/UserProfileForm.tsx

"use client";

import { useMe } from "@/components/MeContext";
import { UserProfileBasicForm } from "@/components/profile/UserProfileBasicForm";
import { UserProfileIdentityForm } from "@/components/profile/UserProfileIdentityForm";
import { UserProfilePassportForm } from "@/components/profile/UserProfilePassportForm";
import { UserContactsForm } from "@/components/profile/UserContactsForm";
import { UserAddressesForm } from "@/components/profile/UserAddressesForm";

export function UserProfileForm() {
  const { me, reloadMe } = useMe();
  if (!me) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      {/* 1) Básico + foto + ID */}
      <UserProfileBasicForm me={me} onChanged={reloadMe} />

      {/* 2) Documentos nacionais (identidade) */}
      <details className="rounded-xl border border-zinc-200 bg-white">
        <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-zinc-900">
          Documentos nacionais
        </summary>
        <div className="px-6 pb-6 pt-2">
          <UserProfileIdentityForm me={me} onChanged={reloadMe} />
        </div>
      </details>

      {/* 3) Passaporte */}
      <details className="rounded-xl border border-zinc-200 bg-white">
        <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-zinc-900">
          Passaporte
        </summary>
        <div className="px-6 pb-6 pt-2">
          <UserProfilePassportForm me={me} onChanged={reloadMe} />
        </div>
      </details>

      {/* 4) Telefones */}
      <details className="rounded-xl border border-zinc-200 bg-white">
        <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-zinc-900">
          Telefones
        </summary>
        <div className="px-6 pb-6 pt-2">
          <UserContactsForm me={me} onChanged={reloadMe} />
        </div>
      </details>

      {/* 5) Endereços */}
      <details className="rounded-xl border border-zinc-200 bg-white">
        <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-zinc-900">
          Endereços
        </summary>
        <div className="px-6 pb-6 pt-2">
          <UserAddressesForm me={me} onChanged={reloadMe} />
        </div>
      </details>
    </div>
  );
}
