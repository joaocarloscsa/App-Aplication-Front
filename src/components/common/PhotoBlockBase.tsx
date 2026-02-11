"use client";

import { useEffect, useRef, useState } from "react";
import { http } from "@/services/http";
import { ImageCropModal } from "@/components/common/ImageCropModal";
import { getAccessToken } from "@/stores/auth";

type Props = {
  readUrl: string | null;
  uploadPath: string;
  name: string;
  aspect: number;
  shape?: "square" | "circle";
  onUploaded?: () => void;
};

type ReadResponse = {
  url: string;
  expires_in: number;
  created_at: string;
};

export function PhotoBlockBase({
  readUrl,
  uploadPath,
  name,
  aspect,
  shape = "square",
  onUploaded,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!readUrl) {
      setPreview(null);
      return;
    }

    // ✅ URL FINAL (CDN / S3 / ABSOLUTA)
    if (readUrl.startsWith("http")) {
      setPreview(readUrl);
      return;
    }

    let cancelled = false;

    async function resolvePhoto() {
      try {
        // 🔑 USA O MESMO PADRÃO DO RESTO DO SISTEMA
        const data = await http<ReadResponse>(readUrl, {
          method: "GET",
          credentials: "include",
        });

        if (!cancelled) {
          setPreview(data.url);
        }
      } catch {
        if (!cancelled) setPreview(null);
      }
    }

    resolvePhoto();

    return () => {
      cancelled = true;
    };
  }, [readUrl]);

  function openPicker() {
    inputRef.current?.click();
  }

  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setRawImage(URL.createObjectURL(file));
  }

  async function onCropConfirm(file: File) {
    try {
      setUploading(true);
      setError(null);

      const form = new FormData();
      form.append("file", file);

      await http(uploadPath, {
        method: "POST",
        body: form,
      });

      setRawImage(null);
      onUploaded?.();
    } catch {
      setError("Erro ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col items-start gap-2">
        <div
          className={[
            "relative h-40 w-40 bg-zinc-200 overflow-hidden",
            shape === "square" ? "rounded-lg" :"rounded-full",
          ].join(" ")}
        >
          {preview ? (
            <img
              src={preview}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-zinc-500">
              Sem foto
            </div>
          )}

          <button
            type="button"
            onClick={openPicker}
            className="
              absolute bottom-2 right-2
              text-xs px-2 py-1
              bg-white/90 rounded-md
              hover:bg-white
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
          onChange={onFileSelected}
          className="hidden"
        />
      </div>

      {rawImage && (
        <ImageCropModal
          imageSrc={rawImage}
          aspect={aspect}
          onCancel={() => setRawImage(null)}
          onConfirm={onCropConfirm}
        />
      )}
    </>
  );
}
