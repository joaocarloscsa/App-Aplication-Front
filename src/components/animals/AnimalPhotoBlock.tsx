// /var/www/GSA/animal/frontend/src/components/animals/AnimalPhotoBlock.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { http } from "@/services/http";
import { ImageCropModal } from "@/components/common/ImageCropModal";

type Props = {
  animalPublicId: string;
  photo: { read_url: string } | null;
  name: string;
  onUploaded?: () => void;
};

export function AnimalPhotoBlock({
  animalPublicId,
  photo,
  name,
  onUploaded,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Resolve URL assinada da imagem
   * NUNCA usar read_url direto no <img>
   */
  useEffect(() => {
    let active = true;

    if (!photo?.read_url) {
      setPreview(null);
      return;
    }

    http<{ url: string }>(photo.read_url)
      .then((res) => {
        if (active) {
          setPreview(res.url);
        }
      })
      .catch(() => {
        if (active) {
          setPreview(null);
        }
      });

    return () => {
      active = false;
    };
  }, [photo]);

  function openFilePicker() {
    inputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setRawImage(URL.createObjectURL(file));

    // permite reescolher o mesmo arquivo
    e.target.value = "";
  }

  async function handleCropped(file: File) {
    try {
      setUploading(true);
      setError(null);

      const form = new FormData();
      form.append("file", file);

      await http(
        `/api/v1/animals/${animalPublicId}/photo`,
        {
          method: "POST",
          body: form,
        }
      );

      setRawImage(null);
      onUploaded?.();
    } catch {
      setError("Erro ao enviar foto.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col items-start gap-3">
        <div className="relative h-40 w-40 rounded-lg bg-zinc-200 overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-xs text-zinc-500 h-full flex items-center justify-center">
              Sem foto
            </div>
          )}

          <button
            type="button"
            onClick={openFilePicker}
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
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {rawImage && (
        <ImageCropModal
          imageSrc={rawImage}
          aspect={1} // animal = quadrado
          onCancel={() => setRawImage(null)}
          onConfirm={handleCropped}
        />
      )}
    </>
  );
}
