"use client";

type TaskStatusFilter = "PLANNED" | "DONE" | "LATE" | "ALL";

type Props = {
  todayOnly: boolean;
  expanded: boolean;

  year: number;
  month: number;

  from?: string;
  to?: string;

  status: TaskStatusFilter;

  onToggleToday(value: boolean): void;
  onToggleExpanded(): void;

  onChangeYear(year: number): void;
  onChangeMonth(month: number): void;

  onChangeFrom(value: string): void;
  onChangeTo(value: string): void;

  onChangeStatus(status: TaskStatusFilter): void;
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
  onToggleToday,
  onToggleExpanded,
  onChangeYear,
  onChangeMonth,
  onChangeFrom,
  onChangeTo,
  onChangeStatus,
}: Props) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-3 border rounded-md p-3 bg-zinc-50">
      {/* Linha principal */}
      <div className="flex flex-wrap gap-4 items-end">
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

        <button
          type="button"
          onClick={onToggleExpanded}
          className="text-xs text-blue-700 underline"
        >
          Filtro avançado
        </button>
      </div>

      {/* Avançado */}
      {expanded && (
        <div className="flex gap-3 text-sm">
          <input
            type="date"
            value={from ?? ""}
            onChange={(e) => onChangeFrom(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <input
            type="date"
            value={to ?? ""}
            onChange={(e) => onChangeTo(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
      )}
    </div>
  );
}
