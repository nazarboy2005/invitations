import sharp from "sharp";
import { parseBuffer } from "music-metadata";
import { sanitizeReceiptPdf } from "./pdf-validation";
import { ApiError } from "./api";

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
export const MAX_RECEIPT_BYTES = 5 * 1024 * 1024;
const PIXEL_LIMIT = 64_000_000;
function invalid(message = "Fayl buzilgan yoki turi qo‘llanmaydi."): never {
  throw new ApiError(400, "INVALID_FILE", message);
}

/** Decode the whole first image, orient it, and discard metadata/other frames. */
export async function normalizeImage(bytes: Buffer, mime?: string) {
  try {
    const image = sharp(bytes, {
      limitInputPixels: PIXEL_LIMIT,
      failOn: "error",
      pages: 1,
    }).timeout({ seconds: 10 });
    const meta = await image.metadata();
    const types: Record<string, string> = {
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
      heif: "image/avif",
      tiff: "image/tiff",
    };
    if (
      !meta.format ||
      !types[meta.format] ||
      !meta.width ||
      !meta.height ||
      meta.width * meta.height > PIXEL_LIMIT ||
      (mime && types[meta.format] !== mime)
    )
      invalid();
    const pipeline = image.rotate();
    const output =
      mime === "image/png"
        ? pipeline.png()
        : mime === "image/jpeg"
          ? pipeline.jpeg({ quality: 95 })
          : pipeline.webp({ quality: 95 });
    const content = await output.toBuffer();
    if (content.length > (mime ? MAX_UPLOAD_BYTES : MAX_RECEIPT_BYTES))
      invalid("Rasm hajmi juda katta. Kichikroq rasm tanlang.");
    return {
      content,
      mime: mime ?? "image/webp",
      extension:
        mime === "image/png" ? "png" : mime === "image/jpeg" ? "jpg" : "webp",
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    invalid(
      "Rasmni ochib bo‘lmadi. JPG, PNG, WebP, GIF, AVIF yoki TIFF rasm tanlang.",
    );
  }
}

export async function validateCreatorMedia(bytes: Buffer, mime: string) {
  if (bytes.length < 16 || bytes.length > MAX_UPLOAD_BYTES) invalid();
  if (mime.startsWith("image/")) return normalizeImage(bytes, mime);
  try {
    const metadata = await parseBuffer(
      bytes,
      { mimeType: mime, size: bytes.length },
      {
        duration: true,
        skipCovers: true,
        maxMemoryAllocation: MAX_UPLOAD_BYTES,
      },
    );
    const { duration, sampleRate, numberOfChannels, container } =
      metadata.format;
    const matches =
      mime === "audio/mpeg"
        ? /MPEG/.test(container ?? "")
        : mime === "audio/wav"
          ? /WAVE/.test(container ?? "")
          : mime === "audio/mp4" &&
            /M4A|mp4|isom|ISO|QuickTime/i.test(container ?? "");
    if (
      !matches ||
      !duration ||
      !Number.isFinite(duration) ||
      duration <= 0 ||
      !sampleRate ||
      !numberOfChannels
    )
      invalid();
    return { content: bytes, mime };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    invalid("Audio faylni ochib bo‘lmadi. MP3, WAV yoki M4A fayl tanlang.");
  }
}

export async function normalizeReceipt(bytes: Buffer) {
  if (bytes.length < 16 || bytes.length > MAX_RECEIPT_BYTES) invalid();
  if (bytes.subarray(0, 5).toString() !== "%PDF-") return normalizeImage(bytes);
  try {
    const content = await sanitizeReceiptPdf(bytes);
    return { content, mime: "application/pdf", extension: "pdf" };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    invalid("PDF faylni ochib bo‘lmadi. Parolsiz PDF yoki rasm tanlang.");
  }
}
