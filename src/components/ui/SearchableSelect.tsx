// path: frontend/src/components/ui/SearchableSelect.tsx

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Option = {
  value: string;
  label: string;
};

type Props = {
  value?: string;
  options: Option[];
  placeholder?: string;
  onChange(value?: string): void;
  className?: string;
};

export function SearchableSelect({
  value,
  options,
  placeholder = "Selecionar...",
  onChange,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    if (!search) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, options]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full border rounded px-3 py-2 text-sm text-left bg-white"
      >
        {selected ? selected.label : placeholder}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full border rounded bg-white shadow-lg">
          <div className="p-2 border-b">
            <input
              autoFocus
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onChange(undefined);
                setOpen(false);
                setSearch("");
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-100"
            >
              Limpar seleção
            </button>

            {filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setSearch("");
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-100"
              >
                {opt.label}
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="px-3 py-2 text-sm text-zinc-400">
                Nenhum resultado
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
