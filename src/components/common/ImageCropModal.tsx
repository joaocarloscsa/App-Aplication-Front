// /var/www/GSA/animal/frontend/src/components/common/ImageCropModal.tsx

"use client";

import Cropper, { Area } from "react-easy-crop";
import { useState } from "react";
import { getCroppedImage } from "@/utils/imageCrop";

type Props = {
  imageSrc: string;
  aspect: number;
  onCancel: () => void;
  onConfirm: (file: File) => void;
};

export function ImageCropModal({
  imageSrc,
  aspect,
  onCancel,
  onConfirm,
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  async function handleConfirm() {
    if (!croppedArea) return;

    const file = await getCroppedImage(
      imageSrc,
      croppedArea,
      "cropped.jpg"
    );

    onConfirm(file);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden">
        <div className="relative h-[400px] bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, areaPixels) =>
              setCroppedArea(areaPixels)
            }
          />
        </div>

        <div className="p-4 space-y-4">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm rounded-lg border"
            >
              Cancelar
            </button>

            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm rounded-lg bg-zinc-900 text-white"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

