// /var/www/GSA/animal/frontend/src/components/profile/UserProfileIdentityForm.tsx

"use client";

import { useEffect, useState } from "react";
import { http } from "@/services/http";

type Props = {
  me: any;
  onChanged: () => void;
};

type IdentityState = {
  national_identity_number: string;
  national_identity_country: string;

  // ⚠️ você disse: "documento nacional também tem vencimento"
  // hoje NÃO existe no JSON que você mostrou, mas você pediu.
  // se o backend ainda não tem, esse campo fica no front e não é enviado.
  national_identity_expiration_date: string;
};

const EMPTY: IdentityState = {
  national_identity_number: "",
  national_identity_country: "",
  national_identity_expiration_date: "",
};

function toInputDate(v: any): string {
  if (!v) return "";
  if (typeof v === "string") return v.slice(0, 10);
  return "";
}

export function UserProfileIdentityForm({ me, onChanged }: Props) {
  const profile = me?.person?.profile ?? {};

  const [form, setForm] = useState<IdentityState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm({
      national_identity_number: profile.national_identity_number ?? "",
      national_identity_country: profile.national_identity_country ?? "",
      national_identity_expiration_date: toInputDate(profile.national_identity_expiration_date),
    });
  }, [profile]);

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      // NOTE: só enviamos o que EXISTE no backend
      await http("/api/v1/me/profile", {
        method: "PATCH",
        body: {
          national_identity_number: form.national_identity_number || null,
          national_identity_country: form.national_identity_country || null,

          // ⚠️ só envie se o backend suportar; se não, REMOVA essa linha.
          national_identity_expiration_date: form.national_identity_expiration_date || null,
        },
      });

      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
      onChanged();
    } catch {
      setError("Erro ao salvar documento nacional.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">Documento nacional (número)</label>
          <input
            value={form.national_identity_number}
            onChange={(e) => setForm((s) => ({ ...s, national_identity_number: e.target.value }))}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">País emissor (ISO-2)</label>
          <input
            placeholder="PT, BR, DE…"
            value={form.national_identity_country}
            onChange={(e) =>
              setForm((s) => ({ ...s, national_identity_country: e.target.value.toUpperCase() }))
            }
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">Vencimento do documento</label>
          <input
            type="date"
            value={form.national_identity_expiration_date}
            onChange={(e) =>
              setForm((s) => ({ ...s, national_identity_expiration_date: e.target.value }))
            }
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          <div className="text-[11px] text-zinc-500">
            Se o backend ainda não suportar esse campo, ele deve ser adicionado antes de manter aqui.
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saved ? "Salvo" : saving ? "Salvando…" : "Salvar documento nacional"}
        </button>
      </div>
    </div>
  );
}

