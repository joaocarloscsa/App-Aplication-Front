"use client";

import { useCallback, useEffect, useState } from "react";
import { http } from "@/services/http";
import { useModal } from "@/components/ui/modal/ModalProvider";

type Contact = {
  public_id: string;
  contact_type: string;
  value: string;
  created_at?: string | null;
};

const PRESETS = [
  { value: "phone_mobile", label: "Telemóvel" },
  { value: "phone_home", label: "Telefone fixo" },
  { value: "phone_work", label: "Trabalho" },
  { value: "__other__", label: "Outro…" },
];

function formatDate(d?: string | null) {
  if (!d) return null;
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  return dt.toLocaleString();
}

function renderType(type: string) {
  if (type === "phone_mobile") return "Telemóvel";
  if (type === "phone_home") return "Telefone fixo";
  if (type === "phone_work") return "Trabalho";
  return type;
}

export function UserContactsForm() {
  const { confirm } = useModal();

  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    preset: "phone_mobile",
    customType: "",
    value: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await http<Contact[]>("/api/v1/me/contacts", {
        method: "GET",
      });
      setItems(Array.isArray(list) ? list : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function resetForm() {
    setForm({
      preset: "phone_mobile",
      customType: "",
      value: "",
    });
  }

  async function handleCreate() {
    setError(null);

    const contact_type =
      form.preset === "__other__"
        ? form.customType.trim()
        : form.preset.trim();

    if (!contact_type) {
      setError("Informe o tipo do telefone (Outro…).");
      return;
    }

    if (!form.value.trim()) {
      setError("Informe o número.");
      return;
    }

    setSaving(true);
    try {
      const created = await http<Contact>("/api/v1/me/contacts", {
        method: "POST",
        body: {
          contact_type,
          value: form.value.trim(),
        },
      });

      setItems((prev) => [...prev, created]);
      resetForm();
    } catch {
      setError("Erro ao adicionar telefone.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(contactPublicId: string) {
    const ok = await confirm({
      title: "Remover telefone?",
      message: "Tem certeza que deseja remover este telefone?",
      confirmLabel: "Remover",
      cancelLabel: "Cancelar",
    });

    if (!ok) return;

    setError(null);
    try {
      await http(`/api/v1/me/contacts/${contactPublicId}`, {
        method: "DELETE",
      });

      setItems((prev) =>
        prev.filter((c) => c.public_id !== contactPublicId)
      );
    } catch {
      setError("Erro ao remover telefone.");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900">Telefones</h2>
        {loading && (
          <span className="text-xs text-zinc-500">Atualizando…</span>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((c) => (
            <div key={c.public_id} className="rounded-xl border p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-zinc-900 truncate">
                    {renderType(c.contact_type)}
                  </div>
                  {c.created_at && (
                    <div className="text-xs text-zinc-500">
                      Criado em: {formatDate(c.created_at) ?? "—"}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(c.public_id)}
                  className="shrink-0 text-xs text-red-600 hover:underline"
                >
                  Remover
                </button>
              </div>

              <div className="text-sm font-medium text-zinc-900 break-words">
                {c.value}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-sm text-zinc-500">
            Nenhum telefone cadastrado.
          </div>
        )
      )}

      <div className="pt-6 border-t space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900">
          Adicionar telefone
        </h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">
              Tipo do telefone
            </label>
            <select
              value={form.preset}
              onChange={(e) =>
                setForm((f) => ({ ...f, preset: e.target.value }))
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            >
              {PRESETS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {form.preset === "__other__" && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700">
                Nome do tipo (Outro)
              </label>
              <input
                value={form.customType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, customType: e.target.value }))
                }
                placeholder="Ex: Casa de férias"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>
          )}

          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-medium text-zinc-700">
              Número
            </label>
            <input
              value={form.value}
              onChange={(e) =>
                setForm((f) => ({ ...f, value: e.target.value }))
              }
              placeholder="+351 912 345 678"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCreate}
            disabled={saving}
            className="h-10 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {saving ? "Adicionando…" : "Adicionar telefone"}
          </button>
        </div>
      </div>
    </div>
  );
}