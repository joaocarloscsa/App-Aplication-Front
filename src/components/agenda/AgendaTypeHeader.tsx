type Props = {
  color: string;
  label: string;
};

export function AgendaTypeHeader({ color, label }: Props) {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-700">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="font-medium uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

