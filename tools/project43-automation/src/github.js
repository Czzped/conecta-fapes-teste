import { SignJWT, importPKCS8 } from "jose";

const GITHUB_API_URL = "https://api.github.com/graphql";

function toUint8Array(value) {
  return new TextEncoder().encode(value);
}

function bufferToHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  let mismatch = 0;

  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return mismatch === 0;
}

function normalizePrivateKey(privateKey) {
  return privateKey.replace(/\\n/g, "\n").trim();
}

export async function verifyWebhookSignature(secret, signatureHeader, body) {
  if (!secret || !signatureHeader?.startsWith("sha256=")) {
    return false;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    toUint8Array(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, toUint8Array(body));
  const expected = `sha256=${bufferToHex(signature)}`;

  return timingSafeEqual(expected, signatureHeader);
}

async function createAppJwt(appId, privateKey) {
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

export async function createInstallationToken(env, installationId) {
  const jwt = await createAppJwt(env.GITHUB_APP_ID, env.GITHUB_APP_PRIVATE_KEY);

  const response = await fetch(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${jwt}`,
        "User-Agent": "project43-status-dates",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`failed to create installation token: ${response.status} ${body}`);
  }

  const payload = await response.json();
  return payload.token;
}

export async function githubGraphql(token, query, variables = {}) {
  const response = await fetch(GITHUB_API_URL, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "project43-status-dates",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json();

  if (!response.ok || payload.errors?.length) {
    throw new Error(
      `github graphql failed: ${response.status} ${JSON.stringify(payload.errors ?? payload)}`
    );
  }

  return payload.data;
}

export async function getProjectFieldMetadata(token, projectId) {
  const query = `
    query ProjectFields($projectId: ID!) {
      node(id: $projectId) {
        ... on ProjectV2 {
          id
          fields(first: 50) {
            nodes {
              __typename
              ... on ProjectV2Field {
                id
                name
                dataType
              }
              ... on ProjectV2SingleSelectField {
                id
                name
                dataType
                options {
                  id
                  name
                }
              }
              ... on ProjectV2IterationField {
                id
                name
                dataType
              }
            }
          }
        }
      }
    }
  `;

  const data = await githubGraphql(token, query, { projectId });
  const fields = new Map();

  for (const node of data.node.fields.nodes) {
    fields.set(node.name, node);
  }

  return {
    fields,
    statusField: fields.get("Status"),
  };
}

export async function getProjectItemState(token, itemId) {
  const query = `
    query ProjectItem($itemId: ID!) {
      node(id: $itemId) {
        ... on ProjectV2Item {
          id
          fieldValues(first: 50) {
            nodes {
              __typename
              ... on ProjectV2ItemFieldDateValue {
                date
                field {
                  ... on ProjectV2Field {
                    id
                    name
                  }
                }
              }
              ... on ProjectV2ItemFieldSingleSelectValue {
                name
                optionId
                field {
                  ... on ProjectV2SingleSelectField {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await githubGraphql(token, query, { itemId });
  const item = data.node;
  const result = {
    statusName: null,
    startedAt: null,
    completedAt: null,
  };

  for (const node of item.fieldValues.nodes) {
    if (node.__typename === "ProjectV2ItemFieldSingleSelectValue" && node.field?.name === "Status") {
      result.statusName = node.name;
    }

    if (node.__typename === "ProjectV2ItemFieldDateValue" && node.field?.name === "Iniciado em") {
      result.startedAt = node.date;
    }

    if (
      node.__typename === "ProjectV2ItemFieldDateValue" &&
      ["Data de Conclusão", "Data de Conclusao"].includes(node.field?.name)
    ) {
      result.completedAt = node.date;
    }
  }

  return result;
}

function resolveField(metadata, fieldName) {
  if (metadata.fields.has(fieldName)) {
    return metadata.fields.get(fieldName);
  }

  if (fieldName === "Data de Conclusão" && metadata.fields.has("Data de Conclusao")) {
    return metadata.fields.get("Data de Conclusao");
  }

  return null;
}

export async function applyDateMutations(token, projectId, itemId, metadata, mutations) {
  const updateMutation = `
    mutation SetProjectDate(
      $projectId: ID!
      $itemId: ID!
      $fieldId: ID!
      $date: Date!
    ) {
      updateProjectV2ItemFieldValue(
        input: {
          projectId: $projectId
          itemId: $itemId
          fieldId: $fieldId
          value: { date: $date }
        }
      ) {
        projectV2Item {
          id
        }
      }
    }
  `;

  const clearMutation = `
    mutation ClearProjectDate(
      $projectId: ID!
      $itemId: ID!
      $fieldId: ID!
    ) {
      clearProjectV2ItemFieldValue(
        input: {
          projectId: $projectId
          itemId: $itemId
          fieldId: $fieldId
        }
      ) {
        projectV2Item {
          id
        }
      }
    }
  `;

  for (const mutation of mutations) {
    const field = resolveField(metadata, mutation.fieldName);

    if (!field) {
      throw new Error(`field not found: ${mutation.fieldName}`);
    }

    if (mutation.op === "set_date") {
      await githubGraphql(token, updateMutation, {
        projectId,
        itemId,
        fieldId: field.id,
        date: mutation.date,
      });
      continue;
    }

    if (mutation.op === "clear") {
      await githubGraphql(token, clearMutation, {
        projectId,
        itemId,
        fieldId: field.id,
      });
    }
  }
}
