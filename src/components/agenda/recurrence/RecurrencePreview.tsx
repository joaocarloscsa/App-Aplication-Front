"use client";

type Props = {
  loading: boolean;
  preview: {
    summary: string;
    first_dates: string[];
    last_date: string | null;
    hidden_count: number;
    total: number;
    ends_at: string | null;
  } | null;
  error: string | null;
};

function formatDate(d: string) {
  const date = new Date(d);

  const day = date.toLocaleDateString("pt-PT");

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");

  return `${day} — ${hh}:${mm}`;
}

export function RecurrencePreview({
  loading,
  preview,
  error,
}: Props) {

  if (loading) {
    return (
      <div className="text-xs bg-zinc-50 border rounded px-3 py-2">
        <p className="text-zinc-500">Gerando preview…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-xs bg-zinc-50 border rounded px-3 py-2">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!preview) return null;

  return (
    <div className="text-xs bg-zinc-50 border rounded px-3 py-2 space-y-2">

      <p className="text-zinc-700">{preview.summary}</p>

      <div>
        <p className="font-medium mb-1">
          Preview (datas)
        </p>

        <ul className="list-disc pl-4 space-y-0.5">

          {preview.first_dates.map((d) => (
            <li key={d}>{formatDate(d)}</li>
          ))}

          {preview.hidden_count > 0 && (
            <li className="text-zinc-500">
              … (mais {preview.hidden_count} ocorrências)
            </li>
          )}

          {preview.last_date && (
            <li>
              {formatDate(preview.last_date)} (última)
            </li>
          )}

        </ul>
      </div>

      <p className="text-zinc-600">
        Total de ocorrências: {preview.total}
      </p>

      {preview.ends_at && (
        <p className="text-zinc-600">
          Termina em: {new Date(preview.ends_at).toLocaleDateString("pt-PT")}
        </p>
      )}

    </div>
  );
}