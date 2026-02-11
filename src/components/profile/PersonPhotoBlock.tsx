"use client";

import { PhotoBlockBase } from "@/components/common/PhotoBlockBase";

type Props = {
  photo: { read_url?: string } | null;
  name: string;
  onUploaded?: () => void;
};

export function PersonPhotoBlock({
  photo,
  name,
  onUploaded,
}: Props) {
  return (
    <PhotoBlockBase
      readUrl={photo?.read_url ?? null}
      uploadPath="/api/v1/me/profile-photo"
      name={name}
      shape="square"
      aspect={1}
      onUploaded={onUploaded}
    />
  );
}

