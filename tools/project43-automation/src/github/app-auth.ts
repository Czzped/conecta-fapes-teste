import { SignJWT, importPKCS8 } from "jose";

interface InstallationTokenConfig {
  appId: string;
  privateKey: string;
  userAgent: string;
}

function encodeDerLength(length: number): Uint8Array {
  if (length < 0x80) {
    return Uint8Array.of(length);
  }

  const bytes: number[] = [];
  let value = length;

  while (value > 0) {
    bytes.unshift(value & 0xff);
    value >>= 8;
  }

  return Uint8Array.of(0x80 | bytes.length, ...bytes);
}

function concatBytes(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;

  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }

  return output;
}

function derSequence(parts: Uint8Array[]): Uint8Array {
  const body = concatBytes(parts);
  return concatBytes([Uint8Array.of(0x30), encodeDerLength(body.length), body]);
}

function derOctetString(value: Uint8Array): Uint8Array {
  return concatBytes([Uint8Array.of(0x04), encodeDerLength(value.length), value]);
}

function decodePemBody(pem: string): Uint8Array {
  const base64 = pem
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "")
    .replace(/\s+/g, "");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function encodePem(label: string, bytes: Uint8Array): string {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  const base64 = btoa(binary);
  const lines = base64.match(/.{1,64}/g) ?? [];

  return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----`;
}

function convertRsaPrivateKeyToPkcs8(privateKey: string): string {
  const rsaPrivateKey = decodePemBody(privateKey);
  const privateKeyInfo = derSequence([
    Uint8Array.of(0x02, 0x01, 0x00),
    Uint8Array.of(
      0x30,
      0x0d,
      0x06,
      0x09,
      0x2a,
      0x86,
      0x48,
      0x86,
      0xf7,
      0x0d,
      0x01,
      0x01,
      0x01,
      0x05,
      0x00
    ),
    derOctetString(rsaPrivateKey),
  ]);

  return encodePem("PRIVATE KEY", privateKeyInfo);
}

export function normalizePrivateKey(privateKey: string): string {
  const normalized = privateKey.replace(/\\n/g, "\n").trim();

  if (normalized.includes("-----BEGIN RSA PRIVATE KEY-----")) {
    return convertRsaPrivateKeyToPkcs8(normalized);
  }

  return normalized;
}

async function createAppJwt(appId: string, privateKey: string): Promise<string> {
  const algorithm = "RS256";
  const now = Math.floor(Date.now() / 1000);
  const key = await importPKCS8(normalizePrivateKey(privateKey), algorithm);

  return new SignJWT({})
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt(now - 60)
    .setExpirationTime(now + 9 * 60)
    .setIssuer(String(appId))
    .sign(key);
}

export async function createInstallationToken(
  config: InstallationTokenConfig,
  installationId: string | number
): Promise<string> {
  const jwt = await createAppJwt(config.appId, config.privateKey);
  const response = await fetch(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${jwt}`,
        "User-Agent": config.userAgent,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `failed to create installation token: ${response.status} ${body}`
    );
  }

  const payload = (await response.json()) as { token?: string };

  if (!payload.token) {
    throw new Error("failed to create installation token: missing token");
  }

  return payload.token;
}
