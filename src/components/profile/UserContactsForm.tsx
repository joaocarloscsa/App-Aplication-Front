// /var/www/GSA/animal/frontend/src/components/profile/UserContactsForm.tsx

"use client";

import { useState } from "react";
import { http } from "@/services/http";

type Props = {
  me: any;
  onChanged?: () => void;
};

type Contact = {
  public_id: string;
  contact_type: string;
  value: string;
};

const CONTACT_TYPE_LABELS: Record<string, string> = {
  phone_mobile: "Telemóvel",
  phone_home: "Telefone fixo",
  phone_work: "Telefone trabalho",
};

export function UserContactsForm({ me, onChanged }: Props) {
  const contacts: Contact[] = me?.person?.contacts ?? [];

  const [newValue, setNewValue] = useState("");
  const [newType, setNewType] = useState("phone_mobile");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    if (!newValue.trim()) return;

    setSaving(true);
    setError(null);

    try {
      await http("/api/v1/me/contacts", {
        method: "POST",
        body: {
          contact_type: newType,
          value: newValue.trim(),
        },
      });

      setNewValue("");
      onChanged?.();
    } catch {
      setError("Erro ao adicionar telefone.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(
    contactId: string,
    value: string
  ) {
    try {
      await http(`/api/v1/me/contacts/${contactId}`, {
        method: "PATCH",
        body: { value },
      });
      onChanged?.();
    } catch {
      setError("Erro ao atualizar telefone.");
    }
  }

  async function handleDelete(contactId: string) {
    if (!confirm("Remover este telefone?")) return;

    try {
      await http(`/api/v1/me/contacts/${contactId}`, {
        method: "DELETE",
      });
      onChanged?.();
    } catch {
      setError("Erro ao remover telefone.");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
      <h2 className="text-lg font-semibold text-zinc-900">
        Telefones
      </h2>

      {/* LISTA */}
      {contacts.length > 0 ? (
        <div className="space-y-3">
          {contacts.map((c) => (
            <div
              key={c.public_id}
              className="flex items-center gap-3"
            >
              <div className="w-28 text-xs text-zinc-600">
                {CONTACT_TYPE_LABELS[c.contact_type] ??
                  c.contact_type}
              </div>

              <input
                type="tel"
                defaultValue={c.value}
                onBlur={(e) =>
                  e.target.value !== c.value &&
                  handleUpdate(
                    c.public_id,
                    e.target.value
                  )
                }
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              />

              <button
                type="button"
                onClick={() =>
                  handleDelete(c.public_id)
                }
                className="text-xs text-red-600 hover:underline"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-zinc-500">
          Nenhum telefone cadastrado.
        </div>
      )}

      {/* ADICIONAR */}
      <div className="pt-4 border-t space-y-3">
        <div className="flex gap-3">
          <select
            value={newType}
            onChange={(e) =>
              setNewType(e.target.value)
            }
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="phone_mobile">
              Telemóvel
            </option>
            <option value="phone_home">
              Fixo
            </option>
            <option value="phone_work">
              Trabalho
            </option>
          </select>

          <input
            type="tel"
            placeholder="+351912345678"
            value={newValue}
            onChange={(e) =>
              setNewValue(e.target.value)
            }
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
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
          Adicionar telefone
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

