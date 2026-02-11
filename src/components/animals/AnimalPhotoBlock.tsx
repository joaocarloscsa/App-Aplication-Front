"use client";

import { PhotoBlockBase } from "@/components/common/PhotoBlockBase";

type Props = {
  animalPublicId: string;
  photo: { url?: string } | null;
  name: string;
  onUploaded?: () => void;
};

export function AnimalPhotoBlock({
  animalPublicId,
  photo,
  name,
  onUploaded,
}: Props) {
  return (
    <PhotoBlockBase
  readUrl={`/api/v1/animals/${animalPublicId}/photo/read`}
  uploadPath={`/api/v1/animals/${animalPublicId}/photo`}
  name={name}
  aspect={1}
  shape="square"
  onUploaded={onUploaded}
/>

  );
}
