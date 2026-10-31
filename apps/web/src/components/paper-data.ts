import { publicAsset } from "../lib/public-asset";
async function readBytes(path: string) {
  const response = await fetch(path);
  if (!response.ok) throw new Error("Paper data unavailable");
  return new Uint8Array(await response.arrayBuffer());
}

async function decompress(bytes: Uint8Array) {
  const stream = new Blob([bytes as BlobPart])
    .stream()
    .pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** Older browsers can use the same geometry without the compression-stream API. */
export async function loadPaperBytes(read = readBytes, inflate = decompress) {
  try {
    return await inflate(await read(publicAsset("/images/home/paper/crumple.bin")));
  } catch {
    return read(publicAsset("/images/home/paper/crumple.raw.bin"));
  }
}
