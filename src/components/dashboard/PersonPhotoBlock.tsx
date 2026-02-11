"use client";

import { PhotoBlockBase } from "@/components/common/PhotoBlockBase";

type Props = {
  readUrl?: string | null;
  name: string;
  onUploaded?: () => void;
};

export function PersonPhotoBlock({
  readUrl,
  name,
  onUploaded,
}: Props) {
  return (
    <PhotoBlockBase
      uploadPath="/api/v1/me/profile-photo"
      readUrl={readUrl}
      name={name}
      shape="square"
      aspect={1}
      onUploaded={onUploaded}
    />
  );
}

