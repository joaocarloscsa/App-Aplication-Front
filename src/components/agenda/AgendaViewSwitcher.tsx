// path: frontend/src/components/agenda/AgendaViewSwitcher.tsx

"use client";

export type AgendaView = "day" | "week" | "month" | "year";

type Props = {
  value: AgendaView;
  onChange: (v: AgendaView) => void;
};

export function AgendaViewSwitcher({ value, onChange }: Props) {
  const options: { key: AgendaView; label: string }[] = [
    { key: "day", label: "Dia" },
    { key: "week", label: "Semana" },
    { key: "month", label: "Mês" },
    { key: "year", label: "Ano" },
  ];

  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={[
            "px-3 py-1.5 rounded-md text-sm transition-colors",
            value === opt.key
              ? "bg-zinc-900 text-white"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
          ].join(" ")}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

