"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { getAnimal } from "@/services/animals";
import { inviteTutorToAnimal } from "@/services/animalInvites";
import { AnimalBasicForm } from "@/components/animals/AnimalBasicForm";
import { AnimalParentsForm } from "@/components/animals/AnimalParentsForm";
import { AnimalPhotoBlock } from "@/components/animals/AnimalPhotoBlock";
import { CopyId } from "@/components/dashboard/CopyId";
import { revokeTutorFromAnimal } from "@/services/animalTutors";
type RawAnimal = any;
export default function AnimalPage() {
  const params = useParams();
  const publicId = params?.animalId as string;
  const [animal, setAnimal] = useState<RawAnimal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // convite
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invitePersonId, setInvitePersonId] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);
  const reloadAnimal = useCallback(async () => {
    if (!publicId) return;
    try {
      setLoading(true);
      const data = await getAnimal(publicId);
      setAnimal(data);
    } catch {
      setError("Erro ao carregar o animal.");
    } finally {
      setLoading(false);
    }
  }, [publicId]);
  useEffect(() => {
    reloadAnimal();
  }, [reloadAnimal]);
  async function handleInvite(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();

    if (!invitePersonId || !animal || sendingInvite) return;
    try {
      setSendingInvite(true);

      await inviteTutorToAnimal(
        animal.public_id,
        invitePersonId
      );
      setInvitePersonId("");
      setInviteOpen(false);
      await reloadAnimal();
    } catch (err: any) {
      const code = err?.body?.error?.code;
      if (code === "person_already_tutor") {
        alert("Esta pessoa já é tutora deste animal.");
        return;
    }
    alert("Erro inesperado.");
    }
      finally {
      setSendingInvite(false);
      }
  }
  async function handleRevokeTutor(personPublicId: string) {
  if (!animal) return;
  const confirmed = window.confirm(
    "Tem certeza que deseja remover o acesso deste tutor?"
  );
  if (!confirmed) return;
  try {
    await revokeTutorFromAnimal(
      animal.public_id,
      personPublicId
    );

    await reloadAnimal();
  } catch (err) {
    console.error(err);
    alert("Erro ao remover tutor.");
  }
}
  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }
  if (loading || !animal) {
    return <div className="p-6 text-zinc-500">Carregando animal…</div>;
  }
  return (
    <section className="mx-auto max-w-5xl px-4 py-6 space-y-10">
      {/* TOPO */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        <AnimalPhotoBlock
          animalPublicId={animal.public_id}
          photo={animal.photo}
          name={animal.call_name || animal.public_id}
          onUploaded={reloadAnimal}
        />
        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-xl font-semibold truncate">
              {animal.call_name || animal.public_id}
            </h1>

            {animal.my_role === "invited_tutor" && (
              <span
                title="Você é tutor convidado"
                className="text-xs text-zinc-500"
              >
                🤝 Tutor convidado
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <span className="font-mono">{animal.public_id}</span>
            <CopyId id={animal.public_id} />
          </div>
          {animal.permissions?.invite && (
            <button
              type="button"
              onClick={() => setInviteOpen(true)}
              className="text-sm font-medium text-zinc-700 hover:underline"
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
            <div className="text-sm font-medium text-zinc-900 flex items-center gap-2">
              <span>{animal.tutors.primary.name}</span>
              <span className="text-xs font-mono text-zinc-500">
                ({animal.tutors.primary.person_public_id})
              </span>
              <CopyId id={animal.tutors.primary.person_public_id} />
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
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate">{t.name}</span>
                    <span className="text-xs font-mono text-zinc-500">
                      ({t.person_public_id})
                    </span>
                    <CopyId id={t.person_public_id} />
                  </div>
                  {animal.permissions?.edit && (
                    <button
                      type="button"
                      onClick={() =>
                        handleRevokeTutor(t.person_public_id)
                      }
                      className="text-xs text-red-600 hover:underline shrink-0"
                    >
                      Remover acesso
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
      </section>
      <AnimalBasicForm
        publicId={animal.public_id}
        initialData={animal}
      />
      <AnimalParentsForm
        publicId={animal.public_id}
        animal={animal}
        onChanged={reloadAnimal}
      />
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
    </section>
  );
}