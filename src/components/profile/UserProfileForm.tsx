"use client";

import { useEffect, useState } from "react";
import { useMe } from "@/components/MeContext";
import { http } from "@/services/http";
import { PersonPhotoBlock } from "@/components/profile/PersonPhotoBlock";



type ProfilePayload = Record<string, any>;

function Field({
  label,
  value,
  onChange,
  type = "text",
  help,
  disabled = false,
}: {
  label: string;
  value: any;
  onChange?: (v: any) => void;
  type?: string;
  help?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-zinc-700">
        {label}
      </label>
      <input
        type={type}
        value={value ?? ""}
        disabled={disabled}
        onChange={
          onChange
            ? (e) => onChange(e.target.value || null)
            : undefined
        }
        className="w-full rounded-md border px-3 py-2 text-sm disabled:bg-zinc-100"
      />
      {help && (
        <div className="text-[11px] text-zinc-500">
          {help}
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  options: { label: string; value: string | null }[];
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-zinc-700">
        {label}
      </label>
      <select
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value || null)
        }
        className="w-full rounded-md border px-3 py-2 text-sm"
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o.label} value={o.value ?? ""}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Section({
  title,
  children,
  collapsible = false,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  if (!collapsible) {
    return (
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900">
          {title}
        </h3>
        {children}
      </section>
    );
  }

  return (
    <details
      className="rounded-lg border p-4"
      open={defaultOpen}
    >
      <summary className="cursor-pointer text-sm font-semibold text-zinc-900">
        {title}
      </summary>
      <div className="mt-4 space-y-4">
        {children}
      </div>
    </details>
  );
}

export function UserProfileForm() {
  const { me, reloadMe } = useMe();
  const profile = me?.person?.profile ?? {};

  const [data, setData] = useState<ProfilePayload>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setData(profile);
  }, [profile]);

  function set<K extends string>(key: K, value: any) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function save() {
    setSaving(true);
    await http("/api/v1/me/profile", {
      method: "PATCH",
      body: data,
    });
    await reloadMe();
    setSaving(false);
  }

  if (!me) return null;

  const fullName =
    [data.first_name, data.last_name]
      .filter(Boolean)
      .join(" ") || null;

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-6">
      {/* FOTO DE PERFIL DA PESSOA */}
      <Section title="Foto de perfil">
<PersonPhotoBlock
  photo={
    me.person.profile_photo
      ? { read_url: me.person.profile_photo.url }
      : null
  }
  name={me.user.email}
  onUploaded={reloadMe}
/>

      </Section>

      {/* DADOS BÁSICOS */}
      <Section title="Dados básicos">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Primeiro nome"
            value={data.first_name}
            onChange={(v) => set("first_name", v)}
          />
          <Field
            label="Último nome"
            value={data.last_name}
            onChange={(v) => set("last_name", v)}
          />
        </div>

        <Field
          label="Nome completo"
          value={fullName}
          disabled
          help="Gerado automaticamente a partir do primeiro e último nome."
        />

        <Field
          label="Data de nascimento"
          type="date"
          value={data.date_of_birth}
          onChange={(v) => set("date_of_birth", v)}
        />

        <Field
          label="Identificador fiscal"
          value={data.tax_identification_number}
          onChange={(v) =>
            set("tax_identification_number", v)
          }
        />
      </Section>

      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? "Salvando…" : "Salvar alterações"}
        </button>
      </div>
    </div>
  );
}

