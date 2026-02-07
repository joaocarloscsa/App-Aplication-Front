import { ReactNode } from "react";

export function Card({
  title,
  children,
  clickable = false,
}: {
  title: string;
  children: ReactNode;
  clickable?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow-sm ${
        clickable ? "cursor-pointer hover:bg-zinc-50" : ""
      }`}
    >
      <h3 className="mb-2 text-sm font-semibold text-zinc-600">
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
}

