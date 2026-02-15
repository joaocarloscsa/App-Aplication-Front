"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_ITEMS, MenuItem } from "./menu.config";
import { useState } from "react";

type SideMenuProps = {
  mobile?: boolean;
};

export function SideMenu({ mobile = false }: SideMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  function isActive(href?: string) {
    if (!href) return false;

    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(href + "/");
  }

  function renderItem(item: MenuItem, level = 0) {
    const active = isActive(item.href);

    const showChildren =
      item.children?.length &&
      (active || hoveredKey === item.key);

    return (
      <div
        key={item.key}
        onMouseEnter={() => !mobile && setHoveredKey(item.key)}
        onMouseLeave={() => !mobile && setHoveredKey(null)}
      >
        {item.href && (
          <Link
            href={item.href}
            onClick={() => mobile && setOpen(false)}
            className={[
              "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
              level === 0 ? "font-medium" : "ml-4 text-zinc-600",
              active
                ? "text-zinc-900"
                : "text-zinc-600 hover:text-zinc-900",
            ].join(" ")}
          >
            <span className="w-4 text-xs">
              {active ? "🐾" : ""}
            </span>

            <span>{item.label}</span>
          </Link>
        )}

        {showChildren &&
          item.children?.map((child) =>
            renderItem(child, level + 1)
          )}
      </div>
    );
  }

  const content = (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {MENU_ITEMS.map((item) => renderItem(item))}
    </nav>
  );

  if (!mobile) {
    return (
      <aside className="sticky top-14 h-[calc(100vh-56px)] w-52 shrink-0 border-r border-zinc-200 bg-white">
        {content}
      </aside>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md p-2 hover:bg-zinc-100"
        aria-label="Abrir menu"
      >
        ☰
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative h-full w-52 bg-white shadow-xl">
            <div className="border-b px-4 py-3 text-sm font-semibold">
              Menu
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
