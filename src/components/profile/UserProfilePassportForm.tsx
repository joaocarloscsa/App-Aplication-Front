// /var/www/GSA/animal/frontend/src/components/profile/UserProfilePassportForm.tsx

"use client";

import { useEffect, useState } from "react";
import { http } from "@/services/http";

type Props = {
  me: any;
  onChanged: () => void;
};

type PassportState = {
  passport_number: string;
  passport_country: string;
  passport_expiration_date: string;
};

const EMPTY: PassportState = {
  passport_number: "",
  passport_country: "",
  passport_expiration_date: "",
};

function toInputDate(v: any): string {
  if (!v) return "";
  if (typeof v === "string") return v.slice(0, 10);
  return "";
}

export function UserProfilePassportForm({ me, onChanged }: Props) {
  const profile = me?.person?.profile ?? {};

  const [form, setForm] = useState<PassportState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm({
      passport_number: profile.passport_number ?? "",
      passport_country: profile.passport_country ?? "",
      passport_expiration_date: toInputDate(profile.passport_expiration_date),
    });
  }, [profile]);

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      await http("/api/v1/me/profile", {
        method: "PATCH",
        body: {
          passport_number: form.passport_number || null,
          passport_country: form.passport_country || null,
          passport_expiration_date: form.passport_expiration_date || null,
        },
      });

      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
      onChanged();
    } catch {
      setError("Erro ao salvar passaporte.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">Número do passaporte</label>
          <input
            value={form.passport_number}
            onChange={(e) => setForm((s) => ({ ...s, passport_number: e.target.value }))}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">País emissor (ISO-2)</label>
          <input
            placeholder="PT, BR, DE…"
            value={form.passport_country}
            onChange={(e) => setForm((s) => ({ ...s, passport_country: e.target.value.toUpperCase() }))}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">Data de vencimento</label>
          <input
            type="date"
            value={form.passport_expiration_date}
            onChange={(e) => setForm((s) => ({ ...s, passport_expiration_date: e.target.value }))}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
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
          {saved ? "Salvo" : saving ? "Salvando…" : "Salvar passaporte"}
        </button>
      </div>
    </div>
  );
}

