import { SignJWT, importPKCS8 } from "jose";

interface InstallationTokenConfig {
  appId: string;
  privateKey: string;
  userAgent: string;
}

function normalizePrivateKey(privateKey: string): string {
  return privateKey.replace(/\\n/g, "\n").trim();
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
