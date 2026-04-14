function toBufferSource(value: string): BufferSource {
  return Uint8Array.from(new TextEncoder().encode(value)) as unknown as BufferSource;
}

function bufferToHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let mismatch = 0;

  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return mismatch === 0;
}

export async function verifyWebhookSignature(
  secret: string,
  signatureHeader: string | null,
  body: string
): Promise<boolean> {
  if (!secret || !signatureHeader?.startsWith("sha256=")) {
    return false;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    toBufferSource(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, toBufferSource(body));
  const expected = `sha256=${bufferToHex(signature)}`;

  return timingSafeEqual(expected, signatureHeader);
}
