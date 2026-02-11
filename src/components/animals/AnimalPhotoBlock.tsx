"use client";

import { useEffect, useRef, useState } from "react";
import { http } from "@/services/http";

type Props = {
  animalPublicId: string;
  photo: { read_url: string } | null;
  name: string;
  onUploaded?: () => void;
};

type SignedPhotoResponse = {
  url: string;
  expires_in: number;
};

export function AnimalPhotoBlock({
  animalPublicId,
  photo,
  name,
  onUploaded,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function resolveImage() {
      if (!photo?.read_url) {
        setImageUrl(null);
        return;
      }

      try {
        setLoadingImage(true);
        const data = await http<SignedPhotoResponse>(photo.read_url);

        if (!cancelled) {
          setImageUrl(data.url);
        }
      } catch {
        if (!cancelled) {
          setImageUrl(null);
        }
      } finally {
        if (!cancelled) {
          setLoadingImage(false);
        }
      }
    }

    resolveImage();
    return () => {
      cancelled = true;
    };
  }, [photo]);

  function openFilePicker() {
    inputRef.current?.click();
  }

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    try {
      setUploading(true);

      const form = new FormData();
      form.append("file", file);

      await http(`/api/v1/animals/${animalPublicId}/photo`, {
        method: "POST",
        body: form,
      });

      onUploaded?.();
    } catch {
      setError("Erro ao enviar foto.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* FOTO */}
      <div className="relative h-40 w-40 rounded-lg bg-zinc-200 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : loadingImage ? (
          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
            Carregando…
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
            Sem foto
          </div>
        )}

        {/* BOTÃO ALTERAR FOTO — menor */}
        <button
          type="button"
          onClick={openFilePicker}
          disabled={uploading}
          className="
            absolute bottom-1 right-1
            rounded bg-white/90 px-2 py-0.5
            text-[11px] font-medium text-zinc-800
            shadow hover:bg-white
            disabled:opacity-60
            cursor-pointer
          "
        >
          Alterar
        </button>
      </div>

      {uploading && (
        <div className="text-xs text-zinc-500">
          Enviando imagem…
        </div>
      )}

      {error && (
        <div className="text-xs text-red-600">
          {error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
