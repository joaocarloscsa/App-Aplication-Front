"use client";

type Preview = {
  summary: string;
  next_dates: string[];
  total: number | null;
};

type Props = {
  loading: boolean;
  preview: Preview | null;
  error: string | null;
};

export function RecurrencePreview({
  loading,
  preview,
  error,
}: Props) {
  return (
    <div className="text-xs bg-zinc-50 border rounded px-3 py-2 min-h-[72px]">
      {loading && (
        <p className="text-zinc-500">Gerando preview…</p>
      )}

      {!loading && preview && (
        <>
          <p className="font-medium">{preview.summary}</p>

          <ul className="list-disc pl-4">
            {preview.next_dates.map((d) => (
              <li key={d}>
                {new Date(d).toLocaleDateString()}
              </li>
            ))}
          </ul>

          {preview.total !== null && (
            <p className="text-zinc-500">
              Total: {preview.total}
            </p>
          )}
        </>
      )}

      {!loading && error && (
        <p className="text-red-600">{error}</p>
      )}
    </div>
  );
}
