// /var/www/GSA/animal/frontend/src/components/profile/UserAddressesForm.tsx

"use client";

import { useCallback, useEffect, useState } from "react";
import { http } from "@/services/http";

type Address = {
  public_id: string;
  address_type: string;
  street: string;
  city: string;
  region?: string | null;
  postal_code?: string | null;
  country: string;
  created_at?: string | null;
};

const PRESETS = [
  { value: "home", label: "Residência" },
  { value: "work", label: "Trabalho" },
  { value: "billing", label: "Cobrança" },
  { value: "__other__", label: "Outro…" },
];

function formatDate(d?: string | null) {
  if (!d) return null;
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  return dt.toLocaleString();
}

export function UserAddressesForm() {
  const [items, setItems] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    preset: "home",
    customType: "",
    street: "",
    city: "",
    region: "",
    postal_code: "",
    country: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await http<Address[]>("/api/v1/me/addresses", {
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
      preset: "home",
      customType: "",
      street: "",
      city: "",
      region: "",
      postal_code: "",
      country: "",
    });
  }

  function renderType(type: string) {
    if (type === "home") return "Residência";
    if (type === "work") return "Trabalho";
    if (type === "billing") return "Cobrança";
    return type;
  }

  async function handleCreate() {
    setError(null);

    const address_type =
      form.preset === "__other__"
        ? form.customType.trim()
        : form.preset.trim();

    if (!address_type) {
      setError("Informe o tipo do endereço (Outro…).");
      return;
    }

    if (!form.street.trim() || !form.city.trim() || !form.country.trim()) {
      setError("Rua, cidade e país são obrigatórios.");
      return;
    }

    setSaving(true);
    try {
      const created = await http<Address>("/api/v1/me/addresses", {
        method: "POST",
        body: {
          address_type,
          street: form.street.trim(),
          city: form.city.trim(),
          region: form.region.trim() || null,
          postal_code: form.postal_code.trim() || null,
          country: form.country.trim(),
        },
      });

      setItems((prev) => [...prev, created]);
      resetForm();
    } catch {
      setError("Erro ao criar endereço.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(addressPublicId: string) {
    if (!confirm("Remover este endereço?")) return;

    setError(null);
    try {
      await http(`/api/v1/me/addresses/${addressPublicId}`, {
        method: "DELETE",
      });

      setItems((prev) =>
        prev.filter((a) => a.public_id !== addressPublicId)
      );
    } catch {
      setError("Erro ao remover endereço.");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900">Endereços</h2>
        {loading && <span className="text-xs text-zinc-500">Atualizando…</span>}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((a) => (
            <div key={a.public_id} className="rounded-xl border p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-zinc-900 truncate">
                    {renderType(a.address_type)}
                  </div>
                  {a.created_at && (
                    <div className="text-xs text-zinc-500">
                      Criado em: {formatDate(a.created_at) ?? "—"}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(a.public_id)}
                  className="shrink-0 text-xs text-red-600 hover:underline"
                >
                  Remover
                </button>
              </div>

              <div className="text-sm text-zinc-700">
                <div className="font-medium">{a.street}</div>
                <div>
                  {a.city}
                  {a.region ? `, ${a.region}` : ""}{" "}
                  {a.postal_code ? `— ${a.postal_code}` : ""}
                </div>
                <div>{a.country}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-sm text-zinc-500">Nenhum endereço cadastrado.</div>
        )
      )}

      <div className="pt-6 border-t space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900">
          Adicionar endereço
        </h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">
              Tipo do endereço
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
            <label className="text-xs font-medium text-zinc-700">Rua</label>
            <input
              value={form.street}
              onChange={(e) =>
                setForm((f) => ({ ...f, street: e.target.value }))
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Cidade</label>
            <input
              value={form.city}
              onChange={(e) =>
                setForm((f) => ({ ...f, city: e.target.value }))
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Região</label>
            <input
              value={form.region}
              onChange={(e) =>
                setForm((f) => ({ ...f, region: e.target.value }))
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">
              Código postal
            </label>
            <input
              value={form.postal_code}
              onChange={(e) =>
                setForm((f) => ({ ...f, postal_code: e.target.value }))
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">País</label>
            <input
              value={form.country}
              onChange={(e) =>
                setForm((f) => ({ ...f, country: e.target.value }))
              }
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
            {saving ? "Adicionando…" : "Adicionar endereço"}
          </button>
        </div>
      </div>
    </div>
  );
}
