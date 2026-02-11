// /var/www/GSA/animal/frontend/src/components/animals/AnimalBasicForm.tsx

"use client";

import { useEffect, useState } from "react";
import { updateAnimal } from "@/services/animals";
import { http } from "@/services/http";

type AnimalType = {
  code: string;
  label: string;
};

type AnimalBasicFormProps = {
  publicId: string;
  initialData?: {
    notes?: string;
    call_name?: string;
    official_name?: string;
    provisional_name?: string;
    type?: string;
    sex?: "male" | "female";
    breed?: string;
    coat_color?: string;
    coat_type?: string;
    birth_date?: string;
    microchip_number?: string;
    registry_issuer?: string;
    registry_number?: string;
    created_at?: string;
    updated_at?: string;
  };
};

export function AnimalBasicForm({
  publicId,
  initialData = {},
}: AnimalBasicFormProps) {
  const [form, setForm] = useState(initialData);
  const [types, setTypes] = useState<AnimalType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTypes() {
      try {
        const data = await http<AnimalType[]>("/api/v1/animal-types");
        setTypes(data);
      } catch {
        // silencioso
      } finally {
        setLoadingTypes(false);
      }
    }

    loadTypes();
  }, []);

  function handleChange(
    field: keyof typeof form,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
    setSaved(false);
  }

  async function handleSubmit() {
    setSaving(true);
    setError(null);

    const {
      created_at,
      updated_at,
      ...payload
    } = form;

    try {
      await updateAnimal(publicId, payload);
      setSaved(true);
    } catch {
      setError("Erro ao salvar dados do animal.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold text-zinc-900">
        Dados básicos
      </h2>

      {/* Identificação */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs text-zinc-600">
            Nome de chamada
          </label>
          <input
            type="text"
            value={form.call_name ?? ""}
            onChange={(e) =>
              handleChange("call_name", e.target.value)
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-600">
            Nome oficial
          </label>
          <input
            type="text"
            value={form.official_name ?? ""}
            onChange={(e) =>
              handleChange("official_name", e.target.value)
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-600">
            Nome provisório
          </label>
          <input
            type="text"
            value={form.provisional_name ?? ""}
            onChange={(e) =>
              handleChange("provisional_name", e.target.value)
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Classificação */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-zinc-600">
            Tipo
          </label>
          <select
            value={form.type ?? ""}
            disabled={loadingTypes}
            onChange={(e) =>
              handleChange("type", e.target.value)
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm disabled:bg-zinc-100"
          >
            <option value="">—</option>
            {types.map((t) => (
              <option key={t.code} value={t.code}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-zinc-600">
            Sexo
          </label>
          <select
            value={form.sex ?? ""}
            onChange={(e) =>
              handleChange("sex", e.target.value)
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="">—</option>
            <option value="male">Macho</option>
            <option value="female">Fêmea</option>
          </select>
        </div>
      </div>

      {/* Características */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-zinc-600">
            Raça
          </label>
          <input
            type="text"
            value={form.breed ?? ""}
            onChange={(e) =>
              handleChange("breed", e.target.value)
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-600">
            Data de nascimento
          </label>
          <input
            type="date"
            value={form.birth_date ?? ""}
            onChange={(e) =>
              handleChange("birth_date", e.target.value)
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-zinc-600">
            Cor da pelagem
          </label>
          <input
            type="text"
            value={form.coat_color ?? ""}
            onChange={(e) =>
              handleChange("coat_color", e.target.value)
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-600">
            Tipo de pelagem
          </label>
          <input
            type="text"
            value={form.coat_type ?? ""}
            onChange={(e) =>
              handleChange("coat_type", e.target.value)
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Registro */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs text-zinc-600">
            Microchip
          </label>
          <input
            type="text"
            value={form.microchip_number ?? ""}
            onChange={(e) =>
              handleChange("microchip_number", e.target.value)
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-600">
            Órgão registrador
          </label>
          <input
            type="text"
            value={form.registry_issuer ?? ""}
            onChange={(e) =>
              handleChange("registry_issuer", e.target.value)
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-600">
            Número de registro
          </label>
          <input
            type="text"
            value={form.registry_number ?? ""}
            onChange={(e) =>
              handleChange("registry_number", e.target.value)
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Observações */}
      <div>
        <label className="block text-xs text-zinc-600">
          Observações
        </label>
        <textarea
          rows={4}
          value={form.notes ?? ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      {/* Metadados (somente leitura) */}
      <div className="grid gap-4 sm:grid-cols-2 text-xs text-zinc-500">
        <div>
          <span className="font-medium">Criado em:</span>{" "}
          {form.created_at
            ? new Date(form.created_at).toLocaleString()
            : "—"}
        </div>
        <div>
          <span className="font-medium">Última alteração:</span>{" "}
          {form.updated_at
            ? new Date(form.updated_at).toLocaleString()
            : "—"}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="w-full sm:w-auto rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>

        {saved && (
          <span className="text-sm text-green-600">
            Salvo com sucesso
          </span>
        )}
      </div>
    </div>
  );
}
