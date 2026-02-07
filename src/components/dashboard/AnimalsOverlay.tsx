// /var/www/GSA/animal/frontend/src/components/dashboard/AnimalsOverlay.tsx

"use client";

import { useDashboardOverlay } from "./DashboardOverlayContext";
import { useMe } from "@/components/MeContext";
import { CopyId } from "./CopyId";
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}


type Animal = {
  public_id: string;
  call_name: string | null;
  type: string | null;
  photo?: {
    url?: string;
  };
};

export function AnimalsOverlay() {
  const { activeOverlay, closeOverlay } = useDashboardOverlay();
  const { me } = useMe();

  if (activeOverlay !== "animals") return null;

  const animals: Animal[] = me?.animals?.items ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
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

        {/* Lista */}
        <div className="px-6 py-4">
          {animals.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Nenhum animal encontrado.
            </p>
          ) : (
            <ul
              className="
                space-y-3
                overflow-y-auto
                max-h-[360px]
              "
            >
              {animals.map((a) => (
                <li
                  key={a.public_id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="h-12 w-12 shrink-0 rounded-full bg-zinc-200 overflow-hidden">
                    {a.photo?.url && (
                      <img
                        src={a.photo.url}
                        alt={a.call_name ?? a.public_id}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {a.call_name ?? "Sem nome"}
                      {a.type && (
                        <span className="ml-1 text-xs text-zinc-500">
                          ({a.type})
                        </span>
                      )}
                    </p>

                    <CopyId id={a.public_id} label="Animal ID" />

                    <div
                        className="flex items-center gap-1 font-mono text-xs text-zinc-400 cursor-pointer hover:text-zinc-700"
                        title="Clique para copiar o ID do animal"
                        onClick={() => copyToClipboard(a.public_id)}
                      >
                        <span>{a.public_id}</span>
                        <span>📋</span>
                      </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
