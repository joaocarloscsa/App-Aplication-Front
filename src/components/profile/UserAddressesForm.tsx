// /var/www/GSA/animal/frontend/src/components/profile/UserAddressesForm.tsx

"use client";

import { useState } from "react";
import { http } from "@/services/http";

type Props = {
  me: any;
  onChanged?: () => void;
};

type Address = {
  public_id: string;
  address_type: string;
  street?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country?: string;
};

const ADDRESS_TYPE_LABELS: Record<string, string> = {
  home: "Residencial",
  work: "Trabalho",
  other: "Outro",
};

export function UserAddressesForm({ me, onChanged }: Props) {
  const addresses: Address[] = me?.person?.addresses ?? [];

  const [form, setForm] = useState<Partial<Address>>({
    address_type: "home",
    street: "",
    city: "",
    region: "",
    postal_code: "",
    country: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    field: keyof Address,
    value: string
  ) {
    setForm((f) => ({
      ...f,
      [field]: value,
    }));
  }

  async function handleAdd() {
    if (!form.street || !form.city || !form.country) {
      setError("Preencha pelo menos rua, cidade e país.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await http("/api/v1/me/addresses", {
        method: "POST",
        body: {
          address_type: form.address_type,
          street: form.street,
          city: form.city,
          region: form.region,
          postal_code: form.postal_code,
          country: form.country,
        },
      });

      setForm({
        address_type: "home",
        street: "",
        city: "",
        region: "",
        postal_code: "",
        country: "",
      });

      onChanged?.();
    } catch {
      setError("Erro ao adicionar endereço.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(
    addressId: string,
    field: keyof Address,
    value: string
  ) {
    try {
      await http(`/api/v1/me/addresses/${addressId}`, {
        method: "PATCH",
        body: { [field]: value },
      });
      onChanged?.();
    } catch {
      setError("Erro ao atualizar endereço.");
    }
  }

  async function handleDelete(addressId: string) {
    if (!confirm("Remover este endereço?")) return;

    try {
      await http(`/api/v1/me/addresses/${addressId}`, {
        method: "DELETE",
      });
      onChanged?.();
    } catch {
      setError("Erro ao remover endereço.");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
      <h2 className="text-lg font-semibold text-zinc-900">
        Endereços
      </h2>

      {/* LISTA */}
      {addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map((a) => (
            <div
              key={a.public_id}
              className="rounded-lg border p-4 space-y-3"
            >
              <div className="text-xs text-zinc-600 font-medium">
                {ADDRESS_TYPE_LABELS[a.address_type] ??
                  a.address_type}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  defaultValue={a.street ?? ""}
                  placeholder="Rua"
                  onBlur={(e) =>
                    e.target.value !== a.street &&
                    handleUpdate(
                      a.public_id,
                      "street",
                      e.target.value
                    )
                  }
                  className="rounded-lg border px-3 py-2 text-sm"
                />

                <input
                  defaultValue={a.city ?? ""}
                  placeholder="Cidade"
                  onBlur={(e) =>
                    e.target.value !== a.city &&
                    handleUpdate(
                      a.public_id,
                      "city",
                      e.target.value
                    )
                  }
                  className="rounded-lg border px-3 py-2 text-sm"
                />

                <input
                  defaultValue={a.region ?? ""}
                  placeholder="Região / Estado"
                  onBlur={(e) =>
                    e.target.value !== a.region &&
                    handleUpdate(
                      a.public_id,
                      "region",
                      e.target.value
                    )
                  }
                  className="rounded-lg border px-3 py-2 text-sm"
                />

                <input
                  defaultValue={a.postal_code ?? ""}
                  placeholder="Código postal"
                  onBlur={(e) =>
                    e.target.value !== a.postal_code &&
                    handleUpdate(
                      a.public_id,
                      "postal_code",
                      e.target.value
                    )
                  }
                  className="rounded-lg border px-3 py-2 text-sm"
                />

                <input
                  defaultValue={a.country ?? ""}
                  placeholder="País"
                  onBlur={(e) =>
                    e.target.value !== a.country &&
                    handleUpdate(
                      a.public_id,
                      "country",
                      e.target.value
                    )
                  }
                  className="rounded-lg border px-3 py-2 text-sm sm:col-span-2"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  handleDelete(a.public_id)
                }
                className="text-xs text-red-600 hover:underline"
              >
                Remover endereço
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-zinc-500">
          Nenhum endereço cadastrado.
        </div>
      )}

      {/* ADICIONAR */}
      <div className="pt-6 border-t space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900">
          Adicionar endereço
        </h3>

        <select
          value={form.address_type}
          onChange={(e) =>
            handleChange("address_type", e.target.value)
          }
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="home">Residencial</option>
          <option value="work">Trabalho</option>
          <option value="other">Outro</option>
        </select>

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            placeholder="Rua"
            value={form.street ?? ""}
            onChange={(e) =>
              handleChange("street", e.target.value)
            }
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <input
            placeholder="Cidade"
            value={form.city ?? ""}
            onChange={(e) =>
              handleChange("city", e.target.value)
            }
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <input
            placeholder="Região / Estado"
            value={form.region ?? ""}
            onChange={(e) =>
              handleChange("region", e.target.value)
            }
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <input
            placeholder="Código postal"
            value={form.postal_code ?? ""}
            onChange={(e) =>
              handleChange(
                "postal_code",
                e.target.value
              )
            }
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <input
            placeholder="País"
            value={form.country ?? ""}
            onChange={(e) =>
              handleChange("country", e.target.value)
            }
            className="rounded-lg border px-3 py-2 text-sm sm:col-span-2"
          />
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={saving}
          className="
            h-10 rounded-lg
            bg-zinc-900 px-4
            text-sm font-medium text-white
            hover:bg-zinc-800
            disabled:opacity-50
          "
        >
          Adicionar endereço
        </button>

        {error && (
          <div className="text-xs text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

