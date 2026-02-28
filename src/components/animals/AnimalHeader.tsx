"use client";

import { useState } from "react";
import { CopyId } from "@/components/dashboard/CopyId";
import { AnimalPhotoBlock } from "@/components/animals/AnimalPhotoBlock";
import { inviteTutorToAnimal } from "@/services/animalInvites";

type Props = {
  animal: any;
  onRevokeTutor?: (personPublicId: string) => void;
  onReload?: () => Promise<void> | void; // 🔹 importante para refletir o convite
};

export function AnimalHeader({ animal, onRevokeTutor, onReload }: Props) {
  // 🔹 estado do convite
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invitePersonId, setInvitePersonId] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);

  async function handleInvite() {
    if (!invitePersonId || sendingInvite) return;

    try {
      setSendingInvite(true);

      await inviteTutorToAnimal(
        animal.public_id,
        invitePersonId
      );

      setInvitePersonId("");
      setInviteOpen(false);

      if (onReload) {
        await onReload();
      }
    } catch (err: any) {
      const code = err?.body?.error?.code;
      if (code === "person_already_tutor") {
        alert("Esta pessoa já é tutora deste animal.");
        return;
      }
      alert("Erro ao enviar convite.");
    } finally {
      setSendingInvite(false);
    }
  }

  return (
    <header className="space-y-6">
      {/* IDENTIDADE */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        <AnimalPhotoBlock
          animalPublicId={animal.public_id}
          photo={animal.photo}
          name={animal.call_name || animal.public_id}
        />

        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-xl font-semibold truncate">
              {animal.call_name || animal.public_id}
            </h1>

            {animal.my_role === "invited_tutor" && (
              <span className="text-xs text-zinc-500">
                🤝 Tutor convidado
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <span className="font-mono"><CopyId id={animal.public_id} /></span>
            
          </div>

          {/* ✅ convite só para tutor principal (via permissão do backend) */}
          {animal.permissions?.invite && (
            <button
              type="button"
              onClick={() => setInviteOpen(true)}
              className="text-xs font-medium text-zinc-900 hover:underline"
            >
              + Convidar tutor
            </button>
          )}
        </div>
      </div>

      {/* TUTORES */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900">
          Tutores deste animal
        </h2>

        {animal.tutors?.primary && (
          <div className="rounded-lg border px-4 py-3">
            <div className="text-xs font-semibold text-zinc-600 mb-1">
              👑 Tutor principal
            </div>
            <div className="text-sm font-medium flex items-center gap-2">
              <span>{animal.tutors.primary.name}</span>
              <span className="text-xs font-mono text-zinc-500">
                <CopyId id={animal.tutors.primary.person_public_id} />
              </span>
              
            </div>
          </div>
        )}

        {animal.tutors?.invited?.length > 0 && (
          <div className="rounded-lg border px-4 py-3 space-y-2">
            <div className="text-xs font-semibold text-zinc-600">
              🤝 Tutores convidados
            </div>

            {animal.tutors.invited.map((t: any) => (
              <div
                key={t.person_public_id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span>{t.name}</span>
                  <span className="text-xs font-mono text-zinc-500">
                    ({t.person_public_id})
                  </span>
                  <CopyId id={t.person_public_id} />
                </div>

                {animal.permissions?.edit && onRevokeTutor && (
                  <button
                    onClick={() => onRevokeTutor(t.person_public_id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remover acesso
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL — CONVIDAR TUTOR */}
      {inviteOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setInviteOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-zinc-900">
              Convidar tutor
            </h3>

            <input
              type="text"
              placeholder="ID público do tutor (PER_...)"
              value={invitePersonId}
              onChange={(e) => setInvitePersonId(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setInviteOpen(false)}
                className="text-sm"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={sendingInvite}
                onClick={handleInvite}
                className="rounded bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                {sendingInvite ? "Enviando…" : "Enviar convite"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}