"use client";

import Image, { type ImageLoaderProps } from "next/image";
import { useState, type CSSProperties } from "react";
import type { ServiceImage } from "./services-utils";
import { SERVICE_PHOTO_WIDTHS, servicePhotoUrl } from "./service-photo-url";

function photoLoader({ src, width }: ImageLoaderProps) {
  const selected = SERVICE_PHOTO_WIDTHS.find((size) => size >= width) ?? 1600;
  return `${src}&w=${selected}`;
}

export function ServicePhoto({
  slug,
  image,
  name,
  sizes,
  loading = "lazy",
  style,
  draggable,
}: {
  slug: string;
  image: ServiceImage;
  name: string;
  sizes: string;
  loading?: "lazy" | "eager";
  style?: CSSProperties;
  draggable?: boolean;
}) {
  const src = servicePhotoUrl(slug, image.src);
  const [failedSrc, setFailedSrc] = useState("");
  return (
    <Image
      key={src}
      src={src}
      loader={photoLoader}
      alt={image.alt || name}
      fill
      sizes={sizes}
      loading={loading}
      style={{
        ...style,
        ...(failedSrc === src ? { visibility: "hidden" } : {}),
      }}
      draggable={draggable}
      onError={() => setFailedSrc(src)}
    />
  );
}
