import {
  applyDateMutations,
  createInstallationToken,
  getProjectFieldMetadata,
  getProjectItemState,
  verifyWebhookSignature,
} from "./github.js";
import {
  buildDateMutations,
  formatToday,
  shouldHandleStatusChange,
} from "./logic.js";

const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedMetadata = null;
let cachedMetadataAt = 0;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function getRequiredEnv(env, key) {
  const value = env[key];

  if (!value) {
    throw new Error(`missing env: ${key}`);
  }

  return value;
}

async function getMetadata(token, env) {
  const now = Date.now();

  if (cachedMetadata && now - cachedMetadataAt < CACHE_TTL_MS) {
    return cachedMetadata;
  }

  const metadata = await getProjectFieldMetadata(token, env.GITHUB_PROJECT_ID);

  if (!metadata.statusField) {
    throw new Error("status field not found in project");
  }

  cachedMetadata = metadata;
  cachedMetadataAt = now;

  return metadata;
}

export default {
  async fetch(request, env) {
    getRequiredEnv(env, "GITHUB_APP_ID");
    getRequiredEnv(env, "GITHUB_APP_PRIVATE_KEY");
    getRequiredEnv(env, "GITHUB_WEBHOOK_SECRET");
    getRequiredEnv(env, "GITHUB_PROJECT_ID");

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const body = await request.text();
    const signature = request.headers.get("x-hub-signature-256");
    const eventName = request.headers.get("x-github-event");

    const signatureIsValid = await verifyWebhookSignature(
      env.GITHUB_WEBHOOK_SECRET,
      signature,
      body
    );

    if (!signatureIsValid) {
      return new Response("Invalid signature", { status: 401 });
    }

    const payload = JSON.parse(body);
    const installationId = payload?.installation?.id ?? env.GITHUB_APP_INSTALLATION_ID;

    if (!installationId) {
      return json({ ignored: true, reason: "missing_installation_id" }, 202);
    }

    const token = await createInstallationToken(env, installationId);
    const metadata = await getMetadata(token, env);

    if (
      !shouldHandleStatusChange({
        eventName,
        payload,
        projectId: env.GITHUB_PROJECT_ID,
        statusFieldId: metadata.statusField.id,
      })
    ) {
      return new Response(null, { status: 204 });
    }

    const itemId = payload?.projects_v2_item?.node_id;

    if (!itemId) {
      return json({ ignored: true, reason: "missing_item_id" }, 202);
    }

    const itemState = await getProjectItemState(token, itemId);
    const mutations = buildDateMutations({
      statusName: itemState.statusName,
      startedAt: itemState.startedAt,
      completedAt: itemState.completedAt,
      today: formatToday(),
      startedAtFieldName: env.STARTED_AT_FIELD_NAME ?? "Iniciado em",
      completedAtFieldName: env.DONE_AT_FIELD_NAME ?? "Data de Conclusão",
      inProgressStatusName: env.IN_PROGRESS_OPTION_NAME ?? "In Progress",
      doneStatusName: env.DONE_OPTION_NAME ?? "Done",
    });

    if (mutations.length === 0) {
      return json({ applied: 0, statusName: itemState.statusName });
    }

    await applyDateMutations(token, env.GITHUB_PROJECT_ID, itemId, metadata, mutations);

    return json({
      applied: mutations.length,
      statusName: itemState.statusName,
      operations: mutations,
    });
  },
};
