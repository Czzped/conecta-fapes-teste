import { ExpiringValueCache } from "../cache/expiring-value-cache.js";
import { loadWorkerConfig, type WorkerEnvironment } from "../config/worker-config.js";
import { buildDateMutations, formatToday } from "../domain/date-mutations.js";
import {
  shouldHandleStatusChange,
  type ProjectsV2ItemWebhookPayload,
} from "../domain/project-webhook.js";
import { createInstallationToken } from "../github/app-auth.js";
import { GitHubGraphqlClient } from "../github/github-graphql-client.js";
import { GitHubProjectRepository } from "../github/project-repository.js";
import type { ProjectFieldMetadata } from "../github/project-types.js";
import { verifyWebhookSignature } from "../github/webhook-signature.js";

const METADATA_CACHE_TTL_MS = 5 * 60 * 1000;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}

export class ProjectStatusDateWorker {
  private readonly metadataCache = new ExpiringValueCache<ProjectFieldMetadata>(
    METADATA_CACHE_TTL_MS
  );

  async fetch(request: Request, env: WorkerEnvironment): Promise<Response> {
    const config = loadWorkerConfig(env);

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const body = await request.text();
    const signatureIsValid = await verifyWebhookSignature(
      config.secrets.webhookSecret,
      request.headers.get("x-hub-signature-256"),
      body
    );

    if (!signatureIsValid) {
      return new Response("Invalid signature", { status: 401 });
    }

    let payload: ProjectsV2ItemWebhookPayload;

    try {
      payload = JSON.parse(body) as ProjectsV2ItemWebhookPayload;
    } catch {
      return json({ ignored: true, reason: "invalid_json" }, 400);
    }

    const installationId =
      payload.installation?.id ?? config.secrets.installationId;

    if (!installationId) {
      return json({ ignored: true, reason: "missing_installation_id" }, 202);
    }

    const accessToken = await createInstallationToken(
      {
        appId: config.secrets.appId,
        privateKey: config.secrets.appPrivateKey,
        userAgent: config.userAgent,
      },
      installationId
    );

    const repository = new GitHubProjectRepository(
      new GitHubGraphqlClient(accessToken, config.userAgent)
    );

    const metadata = await this.metadataCache.getOrLoad(() =>
      repository.getFieldMetadata(config.project.projectId, config.project.fieldNames)
    );

    if (!metadata.statusField) {
      throw new Error("status field not found in project");
    }

    const eventName = request.headers.get("x-github-event");

    if (
      !shouldHandleStatusChange({
        eventName,
        payload,
        projectId: config.project.projectId,
        statusFieldId: metadata.statusField.id,
      })
    ) {
      return new Response(null, { status: 204 });
    }

    const itemId = payload.projects_v2_item?.node_id;

    if (!itemId) {
      return json({ ignored: true, reason: "missing_item_id" }, 202);
    }

    const itemState = await repository.getItemState(
      itemId,
      config.project.fieldNames
    );
    const mutations = buildDateMutations({
      statusName: itemState.statusName,
      startedAt: itemState.startedAt,
      doneAt: itemState.doneAt,
      today: formatToday(),
      fieldNames: config.project.fieldNames,
      statusNames: config.project.statusNames,
    });

    if (mutations.length === 0) {
      return json({ applied: 0, statusName: itemState.statusName });
    }

    await repository.applyDateMutations(
      config.project.projectId,
      itemId,
      metadata,
      mutations
    );

    return json({
      applied: mutations.length,
      statusName: itemState.statusName,
      operations: mutations,
    });
  }
}
