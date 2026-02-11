"use client";

import CopyId from "@/components/dashboard/CopyId";

type Props = {
  me: any;
};

export function ProfileHeader({ me }: Props) {
  const email = me?.user?.email ?? "";
  const personId = me?.person?.public_id ?? "";

  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Perfil do usuário
      </h1>

      {email && (
        <div className="text-sm text-zinc-600">
          {email}
        </div>
      )}

      {personId && (
        <div className="pt-2">
          <CopyId id={personId} />
        </div>
      )}
    </div>
  );
}

