"use client";

import { getValidSession } from "@/lib/auth-client";

const BUCKET = "pet-media";
const MAX_INPUT_BYTES = 10 * 1024 * 1024;
const MAX_EDGE = 2400;
const INPUT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function config() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !key) throw new Error("Supabase Storage is not configured");
  return { url, key };
}

function encodePath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function publicUrl(path: string) {
  const { url } = config();
  return `${url}/storage/v1/object/public/${BUCKET}/${encodePath(path)}`;
}

async function decodeImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // Fallback below for browsers/files that ImageBitmap cannot decode.
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Não foi possível ler esta imagem."));
      image.src = objectUrl;
    });
    return image;
  } finally {
    // The image has been decoded by this point; browsers keep its pixels available.
    URL.revokeObjectURL(objectUrl);
  }
}

function dimensions(image: ImageBitmap | HTMLImageElement) {
  return "naturalWidth" in image
    ? { width: image.naturalWidth, height: image.naturalHeight }
    : { width: image.width, height: image.height };
}

async function normalizeImage(file: File): Promise<{ blob: Blob; extension: "webp" | "jpg" }> {
  if (!INPUT_TYPES.has(file.type)) throw new Error("Use uma imagem JPG, PNG ou WebP.");
  if (file.size > MAX_INPUT_BYTES) throw new Error("A imagem original deve ter no máximo 10 MB.");

  const image = await decodeImage(file);
  const source = dimensions(image);
  if (!source.width || !source.height) throw new Error("A imagem não tem dimensões válidas.");

  const scale = Math.min(1, MAX_EDGE / Math.max(source.width, source.height));
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) throw new Error("O navegador não conseguiu preparar a imagem.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, width, height);
  if ("close" in image && typeof image.close === "function") image.close();

  const webp = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
  if (webp) return { blob: webp, extension: "webp" };

  const jpeg = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
  if (!jpeg) throw new Error("Não foi possível processar a imagem.");
  return { blob: jpeg, extension: "jpg" };
}

export async function uploadPetImage(petId: string, file: File) {
  const session = await getValidSession();
  if (!session) throw new Error("AUTH_REQUIRED");
  const { url, key } = config();
  const normalized = await normalizeImage(file);
  const path = `${session.user.id}/${petId}/${crypto.randomUUID()}.${normalized.extension}`;
  const response = await fetch(`${url}/storage/v1/object/${BUCKET}/${encodePath(path)}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": normalized.blob.type,
      "x-upsert": "false",
      "Cache-Control": "3600",
    },
    body: normalized.blob,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((body as { message?: string; error?: string }).message ?? (body as { error?: string }).error ?? `Storage ${response.status}`);
  }
  return { bucket: BUCKET, path, publicUrl: publicUrl(path) };
}

export async function deletePetStorageObject(path: string) {
  const session = await getValidSession();
  if (!session) throw new Error("AUTH_REQUIRED");
  const { url, key } = config();
  const response = await fetch(`${url}/storage/v1/object/${BUCKET}/${encodePath(path)}`, {
    method: "DELETE",
    headers: {
      apikey: key,
      Authorization: `Bearer ${session.access_token}`,
    },
  });
  if (!response.ok && response.status !== 404) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `Storage ${response.status}`);
  }
}
