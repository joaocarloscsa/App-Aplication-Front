"use client";

import { PhotoBlockBase } from "@/components/common/PhotoBlockBase";

type Props = {
  readUrl: string | null;
  name: string;
  onUploaded?: () => void;
};

export function PersonPhotoFormBlock({
  readUrl,
  name,
  onUploaded,
}: Props) {
  return (
    <PhotoBlockBase
      readUrl={readUrl}
      uploadPath="/api/v1/me/profile-photo"
      name={name}
      aspect={1}        // quadrado no formulário
      shape="square"
      onUploaded={onUploaded}
    />
  );
}

