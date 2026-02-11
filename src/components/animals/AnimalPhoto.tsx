// /var/www/GSA/animal/frontend/src/components/animals/AnimalPhoto.tsx

"use client";

import { useEffect, useState } from "react";
import { ENV } from "@/lib/env";
import { getAccessToken } from "@/stores/auth";

type PhotoRef =
  | {
      url?: string;
      read_url?: string;
    }
  | null;

type Props = {
  photo: PhotoRef;
  alt: string;
  size?: "sm" | "md";
  shape?: "square" | "circle";
};

type ReadResponse = {
  url: string;
  expires_in: number;
  created_at: string;
};

export function AnimalPhoto({
  photo,
  alt,
  size = "md",
  shape = "square",
}: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dimensions = size === "sm" ? "h-10 w-10" : "h-32 w-32";
  const radius = shape === "circle" ? "rounded-full" : "rounded-lg";

  useEffect(() => {
    // Contrato novo: URL pronta
    if (photo?.url && photo.url.trim().length > 0) {
      setUrl(photo.url);
      setLoading(false);
      return;
    }

    // Compat legado
    if (!photo?.read_url) {
      setUrl(null);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const token = getAccessToken();

        const res = await fetch(`${ENV.API_BASE_URL}${photo.read_url}`, {
          credentials: "include",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) return;

        const data = (await res.json()) as ReadResponse;

        if (!cancelled) {
          setUrl(data.url);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [photo?.url, photo?.read_url]);

  return (
    <div
      className={`
        ${dimensions}
        ${radius}
        bg-zinc-200
        overflow-hidden
        flex items-center justify-center
        shrink-0
      `}
    >
      {loading && (
        <span className="text-xs text-zinc-400">Carregando…</span>
      )}

      {!loading && url && (
        <img
          src={url}
          alt={alt}
          className="h-full w-full object-cover"
        />
      )}

      {!loading && !url && (
        <span className="text-zinc-400 text-sm select-none">
          Sem foto
        </span>
      )}
    </div>
  );
}
