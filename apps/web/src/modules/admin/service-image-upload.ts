import { serviceImageSchema } from "../services/service-editor-contract";
import {
  SERVICE_IMAGE_MAX_DIMENSION,
  SERVICE_IMAGE_MAX_PIXELS,
  SERVICE_IMAGE_SOURCE_MAX_BYTES,
  SERVICE_IMAGE_UPLOAD_MAX_BYTES,
} from "../services/service-image-policy";

export async function prepareServiceImage(file: File): Promise<Blob> {
  if (file.size > SERVICE_IMAGE_SOURCE_MAX_BYTES)
    throw new Error("Har bir rasm 12 MB dan kichik bo‘lsin.");
  if (
    !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)
  )
    throw new Error("JPEG, PNG, WebP yoki AVIF rasm tanlang.");
  const url = URL.createObjectURL(file);
  const canvas = document.createElement("canvas");
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () =>
        reject(new Error("Rasmni ochib bo‘lmadi. Boshqa rasm tanlang."));
      image.src = url;
    });
    if (
      !image.naturalWidth ||
      !image.naturalHeight ||
      image.naturalWidth * image.naturalHeight > SERVICE_IMAGE_MAX_PIXELS
    )
      throw new Error("Rasm o‘lchami juda katta. Kichikroq rasm tanlang.");
    const scale = Math.min(
      1,
      SERVICE_IMAGE_MAX_DIMENSION /
        Math.max(image.naturalWidth, image.naturalHeight),
    );
    const context = canvas.getContext("2d");
    if (!context)
      throw new Error("Rasmni tayyorlab bo‘lmadi. Brauzerni yangilang.");
    for (let attempt = 0; attempt < 5; attempt++) {
      canvas.width = Math.max(
        1,
        Math.round(image.naturalWidth * scale * 0.8 ** attempt),
      );
      canvas.height = Math.max(
        1,
        Math.round(image.naturalHeight * scale * 0.8 ** attempt),
      );
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/webp", 0.86),
      );
      if (blob?.size && blob.size <= SERVICE_IMAGE_UPLOAD_MAX_BYTES)
        return blob;
    }
    throw new Error(
      "Rasmni yetarlicha kichraytirib bo‘lmadi. Boshqa rasm tanlang.",
    );
  } finally {
    URL.revokeObjectURL(url);
    canvas.width = canvas.height = 0;
  }
}

export async function uploadServiceImage(file: File) {
  const image = await prepareServiceImage(file);
  const response = await fetch("/api/admin/services/images", {
    method: "POST",
    headers: { "Content-Type": image.type },
    body: image,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(
      response.status === 413
        ? "Rasm hajmi juda katta. Kichikroq rasm tanlang."
        : data?.error?.message || "Rasm yuklanmadi. Qayta urinib ko‘ring.",
    );
  const parsed = serviceImageSchema.safeParse(data?.image);
  if (!parsed.success)
    throw new Error(
      "Rasm yuklanganini tasdiqlab bo‘lmadi. Qayta urinib ko‘ring.",
    );
  return parsed.data;
}
