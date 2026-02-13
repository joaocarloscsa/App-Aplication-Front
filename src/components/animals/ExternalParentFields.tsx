"use client";

type ExternalParent = {
  call_name?: string;
  official_name?: string;
  provisional_name?: string;
  microchip_number?: string;
  registry_issuer?: string;
  registry_number?: string;
  breed?: string;
  notes?: string;
};

type Props = {
  value: ExternalParent;
  onChange: (v: ExternalParent) => void;
};

export function ExternalParentFields({ value, onChange }: Props) {
  function setField<K extends keyof ExternalParent>(k: K, v: string) {
    onChange({
      ...value,
      [k]: v === "" ? undefined : v,
    });
  }

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <div>
        <label className="block text-xs text-zinc-600">Nome de chamada</label>
        <input
          type="text"
          value={value.call_name ?? ""}
          onChange={(e) => setField("call_name", e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-zinc-600">Nome oficial</label>
        <input
          type="text"
          value={value.official_name ?? ""}
          onChange={(e) => setField("official_name", e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-zinc-600">Nome provisório</label>
        <input
          type="text"
          value={value.provisional_name ?? ""}
          onChange={(e) => setField("provisional_name", e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-zinc-600">Raça</label>
        <input
          type="text"
          value={value.breed ?? ""}
          onChange={(e) => setField("breed", e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-zinc-600">Microchip</label>
        <input
          type="text"
          value={value.microchip_number ?? ""}
          onChange={(e) => setField("microchip_number", e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-zinc-600">Órgão registrador</label>
        <input
          type="text"
          value={value.registry_issuer ?? ""}
          onChange={(e) => setField("registry_issuer", e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-xs text-zinc-600">Número de registro</label>
        <input
          type="text"
          value={value.registry_number ?? ""}
          onChange={(e) => setField("registry_number", e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-xs text-zinc-600">Observações</label>
        <textarea
          rows={3}
          value={value.notes ?? ""}
          onChange={(e) => setField("notes", e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}

