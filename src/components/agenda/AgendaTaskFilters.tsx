// path: frontend/src/components/agenda/AgendaTaskFilters.tsx

"use client";

import { useMemo } from "react";
import type { TreatmentDTO } from "@/services/animalTreatments";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

type TaskStatusFilter = "PLANNED" | "DONE" | "LATE" | "ALL";

type Props = {
  todayOnly: boolean;
  expanded: boolean;

  year: number;
  month: number;

  from?: string;
  to?: string;

  status: TaskStatusFilter;

  treatments: TreatmentDTO[];
  selectedTreatment?: string;
  selectedSchedule?: string;

  onToggleToday(value: boolean): void;
  onToggleExpanded(): void;

  onChangeYear(year: number): void;
  onChangeMonth(month: number): void;

  onChangeFrom(value: string): void;
  onChangeTo(value: string): void;

  onChangeStatus(status: TaskStatusFilter): void;

  onChangeTreatment(value?: string): void;
  onChangeSchedule(value?: string): void;
};

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function AgendaTaskFilters({
  todayOnly,
  expanded,
  year,
  month,
  from,
  to,
  status,
  treatments,
  selectedTreatment,
  selectedSchedule,
  onToggleToday,
  onToggleExpanded,
  onChangeYear,
  onChangeMonth,
  onChangeFrom,
  onChangeTo,
  onChangeStatus,
  onChangeTreatment,
  onChangeSchedule,
}: Props) {
  const currentYear = new Date().getFullYear();

  const selectedTreatmentObj = useMemo(
    () =>
      treatments.find(
        (t) => t.treatment_public_id === selectedTreatment
      ),
    [treatments, selectedTreatment]
  );

  const treatmentOptions = useMemo(() => {
    return [
      { value: "", label: "Todos tratamentos" },
      ...treatments.map((t) => ({
        value: t.treatment_public_id,
        label: `${t.name} — ${t.treatment_public_id}`,
      })),
    ];
  }, [treatments]);

  const scheduleOptions = useMemo(() => {
    if (!selectedTreatmentObj) return [];

    return [
      { value: "", label: "Todas medicações" },
      ...selectedTreatmentObj.schedules.map((s) => ({
        value: s.schedule_public_id,
        label: `${s.medication_name ?? "Sem nome"} — ${s.schedule_public_id}`,
      })),
    ];
  }, [selectedTreatmentObj]);

  return (
    <div className="space-y-4 border rounded-md p-4 bg-zinc-50">

      {/* LINHA 1 — CONTROLES PRINCIPAIS */}
      <div className="flex flex-wrap items-end gap-4">

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={todayOnly}
            onChange={(e) => onToggleToday(e.target.checked)}
          />
          Hoje
        </label>

        {!todayOnly && (
          <>
            <select
              value={month}
              onChange={(e) => onChangeMonth(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              {months.map((label, i) => (
                <option key={i} value={i + 1}>{label}</option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => onChangeYear(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              {Array.from({ length: 10 }).map((_, i) => {
                const y = currentYear - 5 + i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </>
        )}

        <select
          value={status}
          onChange={(e) =>
            onChangeStatus(e.target.value as TaskStatusFilter)
          }
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="PLANNED">A fazer</option>
          <option value="DONE">Concluídas</option>
          <option value="LATE">Atrasadas</option>
          <option value="ALL">Todas</option>
        </select>

        <SearchableSelect
          value={selectedTreatment}
          options={treatmentOptions}
          placeholder="Selecionar tratamento"
          onChange={(v) => onChangeTreatment(v)}
          className="min-w-[260px]"
        />

        {selectedTreatmentObj && (
          <SearchableSelect
            value={selectedSchedule}
            options={scheduleOptions}
            placeholder="Selecionar medicação"
            onChange={(v) => onChangeSchedule(v)}
            className="min-w-[260px]"
          />
        )}

        <button
          type="button"
          onClick={onToggleExpanded}
          className="text-xs text-blue-700 underline ml-auto"
        >
          Filtro avançado
        </button>
      </div>

      {/* LINHA 2 — AVANÇADO */}
      {expanded && (
        <div className="flex gap-4">
          <input
            type="date"
            value={from ?? ""}
            onChange={(e) => onChangeFrom(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
          <input
            type="date"
            value={to ?? ""}
            onChange={(e) => onChangeTo(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
      )}

    </div>
  );
}