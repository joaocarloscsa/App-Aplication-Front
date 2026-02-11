// /var/www/GSA/animal/frontend/src/components/dashboard/AnimalsOverlay.tsx

"use client";

import Link from "next/link";
import { useDashboardOverlay } from "./DashboardOverlayContext";
import { useMe } from "@/components/MeContext";
import { CopyId } from "@/components/dashboard/CopyId";


export function AnimalsOverlay() {
  const { activeOverlay, closeOverlay } = useDashboardOverlay();
  const { me } = useMe();

  if (activeOverlay !== "animals" || !me) return null;

  const animals = me.animals?.items ?? [];

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeOverlay} >
  <div className="w-full max-w-lg rounded-xl bg-white shadow-xl" >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          
          
          <h2 className="text-lg font-semibold">Animais</h2> 
          
          <button
              onClick={closeOverlay}
            className="text-sm text-zinc-500 hover:text-zinc-900"
          >
            Fechar
          </button>
        </div>
        {/* List */}
        <div className="px-6 py-4 space-y-3 max-h-[360px] overflow-y-auto">
          {animals.length === 0 && (
            <p className="text-sm text-zinc-500">
              Nenhum animal encontrado.
            </p>
          )}
          {animals.map((a) => (
            <div
              key={a.public_id}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              {/* FOTO — quadrada, somente exibição */}
              <div className="h-10 w-10 rounded-lg bg-zinc-200 overflow-hidden shrink-0 flex items-center justify-center">
                {a.photo?.url ? (
                  <img
                    src={a.photo.url}
                    alt={a.call_name ?? a.public_id}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-zinc-400 select-none">
                    Sem foto
                  </span>
                )}
              </div>
              {/* Dados */}


                <div className="flex items-center gap-3 w-full">
                  {/* ESQUERDA — Foto + texto */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Foto (se houver) fica antes disso */}

                    <div className="min-w-0 space-y-0.5">


                        {/* Linha 1 — Nome + Tipo + Role */}
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="font-semibold truncate">
                            {a.call_name ?? "Sem nome"}
                          </div>

                          {a.type && (
                            <span className="text-xs font-medium uppercase text-zinc-500">
                              {a.type}
                            </span>
                          )}

                          {a.my_role === "invited_tutor" && (
                            <span
                              title="Você é tutor convidado deste animal"
                              className="text-xs text-zinc-400 cursor-default"
                            >
                              🤝
                            </span>
                          )}
                        </div>





                      {/* Linha 2 — ID + copiar */}
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span className="font-mono truncate">{a.public_id}</span>
                        <CopyId id={a.public_id} />
                      </div>
                    </div>
                  </div>

                  {/* DIREITA — Link Editar */}
                  <Link
                    href={`/dashboard/animals/${a.public_id}`}
                    onClick={closeOverlay}
                    className="shrink-0 text-sm font-medium text-zinc-700 hover:underline"
                  >
                    Editar
                  </Link>
                </div>


            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
