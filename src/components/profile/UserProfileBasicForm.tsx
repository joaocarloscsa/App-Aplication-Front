// /var/www/GSA/animal/frontend/src/components/profile/UserProfileBasicForm.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { http } from "@/services/http";
import { PersonPhotoFormBlock } from "@/components/profile/PersonPhotoFormBlock";
import { CopyId } from "@/components/dashboard/CopyId";

type Props = {
  me: any;
  onChanged: () => void;
};

type BasicState = {
  first_name: string;
  last_name: string;
  tax_identification_number: string;
  tax_identification_country: string;
  date_of_birth: string;
  gender: string;
};

const EMPTY: BasicState = {
  first_name: "",
  last_name: "",
  tax_identification_number: "",
  tax_identification_country: "",
  date_of_birth: "",
  gender: "",
};

const GENDER_OPTIONS: { label: string; value: string }[] = [
  { label: "—", value: "" },
  { label: "Masculino", value: "male" },
  { label: "Feminino", value: "female" },
  { label: "Outro", value: "other" },
  { label: "Prefiro não dizer", value: "prefer_not_to_say" },
];

function toInputDate(v: any): string {
  if (!v) return "";
  if (typeof v === "string") return v.slice(0, 10);
  return "";
}

export function UserProfileBasicForm({ me, onChanged }: Props) {
  const profile = me?.person?.profile ?? {};
  const personId = me?.person?.public_id ?? "";
  const email = me?.user?.email ?? "";
  const photoUrl = me?.person?.profile_photo?.url ?? null;

  const [form, setForm] = useState<BasicState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fullName = useMemo(() => {
    const fn = (form.first_name || "").trim();
    const ln = (form.last_name || "").trim();
    const v = [fn, ln].filter(Boolean).join(" ");
    return v || "";
  }, [form.first_name, form.last_name]);

  useEffect(() => {
    setForm({
      first_name: profile.first_name ?? "",
      last_name: profile.last_name ?? "",
      tax_identification_number: profile.tax_identification_number ?? "",
      tax_identification_country: profile.tax_identification_country ?? "",
      date_of_birth: toInputDate(profile.date_of_birth),
      gender: profile.gender ?? "",
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
          first_name: form.first_name || null,
          last_name: form.last_name || null,
          tax_identification_number: form.tax_identification_number || null,
          tax_identification_country: form.tax_identification_country || null,
          date_of_birth: form.date_of_birth || null,
          gender: form.gender || null,
        },
      });

      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
      onChanged();
    } catch {
      setError("Erro ao salvar dados básicos.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
      <div className="flex items-start gap-4">
        <div className="space-y-2">
          <PersonPhotoFormBlock readUrl={photoUrl} name={email} onUploaded={onChanged} />

          {personId && (
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <span className="font-mono">{personId}</span>
              <CopyId id={personId} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <h2 className="text-lg font-semibold text-zinc-900">
            Dados básicos
          </h2>

          {email && (
            <div className="text-sm text-zinc-600 truncate">
              {email}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">Primeiro nome</label>
          <input
            value={form.first_name}
            onChange={(e) => setForm((s) => ({ ...s, first_name: e.target.value }))}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">Último nome</label>
          <input
            value={form.last_name}
            onChange={(e) => setForm((s) => ({ ...s, last_name: e.target.value }))}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-medium text-zinc-700">Nome completo</label>
          <input
            value={fullName}
            disabled
            className="w-full rounded-md border px-3 py-2 text-sm disabled:bg-zinc-100"
          />
          <div className="text-[11px] text-zinc-500">
            Gerado automaticamente a partir do primeiro e último nome.
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">Data de nascimento</label>
          <input
            type="date"
            value={form.date_of_birth}
            onChange={(e) => setForm((s) => ({ ...s, date_of_birth: e.target.value }))}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">Sexo</label>
          <select
            value={form.gender}
            onChange={(e) => setForm((s) => ({ ...s, gender: e.target.value }))}
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            {GENDER_OPTIONS.map((o) => (
              <option key={o.label} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">Identificador fiscal (NIF/CPF/etc.)</label>
          <input
            value={form.tax_identification_number}
            onChange={(e) => setForm((s) => ({ ...s, tax_identification_number: e.target.value }))}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">País do identificador fiscal (ISO-2)</label>
          <input
            placeholder="PT, BR, DE…"
            value={form.tax_identification_country}
            onChange={(e) => setForm((s) => ({ ...s, tax_identification_country: e.target.value.toUpperCase() }))}
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
          {saved ? "Salvo" : saving ? "Salvando…" : "Salvar dados básicos"}
        </button>
      </div>
    </div>
  );
}

