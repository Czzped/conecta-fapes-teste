import {
  createGitFlowConfig,
  type GitFlowConfig,
} from "../config/git-flow-config.js";
import type { WorkerEnvironment } from "../config/worker-config.js";
import { planBranchCreation } from "../domain/branch-planning.js";
import type {
  GitFlowAction,
  GitFlowActionResult,
} from "../domain/git-flow-actions.js";
import { planHotfix } from "../domain/hotfix-planning.js";
import { validatePullRequest } from "../domain/pr-validation.js";
import { planProductionMerge } from "../domain/production-merge-planning.js";
import {
  extractPullRequestRefs,
  shouldValidatePullRequest,
  type PullRequestWebhookPayload,
} from "../domain/pull-request-webhook.js";
import { planRelease } from "../domain/release-planning.js";
import { createInstallationToken } from "../github/app-auth.js";
import { GitFlowGateway, type CommitStatusResult } from "../github/git-flow-gateway.js";
import { resolveGitFlowRepositoryToken } from "../github/git-flow-token.js";
import { GitHubGraphqlClient } from "../github/github-graphql-client.js";
import { GitHubRestClient } from "../github/github-rest-client.js";
import { verifyWebhookSignature } from "../github/webhook-signature.js";

const USER_AGENT = "project43-git-flow";

export type GitFlowGatewayFactory = (
  env: WorkerEnvironment,
  installationId?: string | number
) => Promise<GitFlowGateway>;

interface GitFlowWorkerOptions {
  /** Permite injetar um gateway de teste, evitando side-effects reais. */
  gatewayFactory?: GitFlowGatewayFactory;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

const TAG_DEFERRED_DETAIL = "tag_deferred_until_production_merge";

function readAdminToken(request: Request): string | null {
  const header = request.headers.get("authorization");

  if (header && header.toLowerCase().startsWith("bearer ")) {
    const token = header.slice("bearer ".length).trim();

    if (token) {
      return token;
    }
  }

  return request.headers.get("x-git-flow-token")?.trim() || null;
}

async function defaultGatewayFactory(
  env: WorkerEnvironment,
  installationId?: string | number
): Promise<GitFlowGateway> {
  const appId = env.GITHUB_APP_ID?.trim();
  const privateKey = env.GITHUB_APP_PRIVATE_KEY?.trim();
  const resolvedInstallationId =
    installationId ?? env.GITHUB_APP_INSTALLATION_ID?.trim();
  const config = createGitFlowConfig(env);

  if (!appId || !privateKey || !resolvedInstallationId) {
    throw new Error("missing GitHub App credentials for git-flow execution");
  }

  const token = resolveGitFlowRepositoryToken(
    env,
    await createInstallationToken(
      { appId, privateKey, userAgent: USER_AGENT },
      resolvedInstallationId
    )
  );

  return new GitFlowGateway(
    new GitHubRestClient(token, USER_AGENT),
    config.org,
    new GitHubGraphqlClient(token, USER_AGENT)
  );
}

function createTokenGateway(
  env: WorkerEnvironment,
  token: string,
  userAgent = USER_AGENT
): GitFlowGateway {
  const config = createGitFlowConfig(env);
  return new GitFlowGateway(
    new GitHubRestClient(token, userAgent),
    config.org,
    new GitHubGraphqlClient(token, userAgent)
  );
}

function getWebhookSecrets(env: WorkerEnvironment): string[] {
  return [env.GITHUB_WEBHOOK_SECRET, env.GITHUB_REPO_WEBHOOK_SECRET]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
}

async function isWebhookSignatureValid(
  env: WorkerEnvironment,
  signature: string | null,
  rawBody: string
): Promise<boolean> {
  const secrets = getWebhookSecrets(env);

  if (secrets.length === 0) {
    return true;
  }

  return (
    await Promise.all(
      secrets.map((secret) => verifyWebhookSignature(secret, signature, rawBody))
    )
  ).some(Boolean);
}

/**
 * Worker das automacoes de Git Flow do Projeto 43.
 *
 * Rotas (todas POST):
 * - webhook `pull_request`            -> valida politica de PR (sem side-effect);
 * - `/git-flow/pull-request`          -> valida politica de PR via JSON;
 * - `/git-flow/branch`                -> plano/execucao de branch automatico;
 * - `/git-flow/release`               -> plano/execucao de release;
 * - `/git-flow/hotfix`                -> plano/execucao de hotfix.
 *
 * Operacoes externas usam `execute: true` para sair do modo `dry-run`
 * (padrao). Sem `execute`, retornam apenas o plano (`planned`).
 */
export class GitFlowWorker {
  private readonly gatewayFactory: GitFlowGatewayFactory;

  constructor(options: GitFlowWorkerOptions = {}) {
    this.gatewayFactory = options.gatewayFactory ?? defaultGatewayFactory;
  }

  async fetch(request: Request, env: WorkerEnvironment): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const config = createGitFlowConfig(env);
    const url = new URL(request.url);
    const eventName = request.headers.get("x-github-event");

    if (eventName === "ping") {
      return this.handlePingWebhook(request, env);
    }

    if (eventName === "pull_request") {
      return this.handlePullRequestWebhook(request, env, config);
    }

    const body = await this.readJson(request);

    if (body === undefined) {
      return json({ ignored: true, reason: "invalid_json" }, 400);
    }

    const authError = this.authorizeExecution(request, env, body);

    if (authError) {
      return authError;
    }

    switch (url.pathname) {
      case "/git-flow/pull-request":
        return this.handlePullRequestJson(config, body);
      case "/git-flow/branch":
        return this.handleBranch(env, config, body);
      case "/git-flow/release":
        return this.handleRelease(env, config, body);
      case "/git-flow/hotfix":
        return this.handleHotfix(env, config, body);
      default:
        return json({ ignored: true, reason: "unknown_route" }, 404);
    }
  }

  private async createCommitStatusGateway(
    env: WorkerEnvironment,
    installationId?: string | number
  ): Promise<GitFlowGateway> {
    const statusToken = env.GITHUB_STATUS_TOKEN?.trim();

    if (statusToken) {
      return createTokenGateway(env, statusToken);
    }

    return this.gatewayFactory(env, installationId);
  }

  private async readJson(request: Request): Promise<Record<string, unknown> | undefined> {
    const text = await request.text();

    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text) as Record<string, unknown>;
    } catch {
      return undefined;
    }
  }

  private async handlePingWebhook(
    request: Request,
    env: WorkerEnvironment
  ): Promise<Response> {
    const rawBody = await request.text();
    const valid = await isWebhookSignatureValid(
      env,
      request.headers.get("x-hub-signature-256"),
      rawBody
    );

    if (!valid) {
      return new Response("Invalid signature", { status: 401 });
    }

    return json({ ok: true, event: "ping" });
  }

  private async handlePullRequestWebhook(
    request: Request,
    env: WorkerEnvironment,
    config: GitFlowConfig
  ): Promise<Response> {
    const rawBody = await request.text();
    const valid = await isWebhookSignatureValid(
      env,
      request.headers.get("x-hub-signature-256"),
      rawBody
    );

    if (!valid) {
      return new Response("Invalid signature", { status: 401 });
    }

    let payload: PullRequestWebhookPayload;

    try {
      payload = JSON.parse(rawBody) as PullRequestWebhookPayload;
    } catch {
      return json({ ignored: true, reason: "invalid_json" }, 400);
    }

    const refs = extractPullRequestRefs(payload);

    if (!refs) {
      return json({ ignored: true, reason: "missing_refs" }, 202);
    }

    if (shouldValidatePullRequest("pull_request", payload)) {
      const validation = validatePullRequest(config, {
        baseBranch: refs.baseBranch,
        headBranch: refs.headBranch,
      });

      let statusResult: CommitStatusResult | null = null;

      if (refs.repository && refs.headSha) {
        const gateway = await this.createCommitStatusGateway(
          env,
          payload.installation?.id
        );
        statusResult = await gateway.createCommitStatus(refs.repository, refs.headSha, {
          state: validation.valid ? "success" : "failure",
          context: validation.checkName,
          description: validation.reason,
        });
      }

      return json({ validation, repository: refs.repository, statusResult });
    }

    if (payload.action === "closed" && payload.pull_request?.merged === true) {
      const isGitFlowBranch =
        refs.headBranch.startsWith(config.releaseBranchPrefix) ||
        refs.headBranch.startsWith(config.hotfixBranchPrefix);

      if (!isGitFlowBranch) {
        return json({ ignored: true, reason: "not_release_or_hotfix" }, 202);
      }

      if (!refs.repository) {
        return json({ valid: false, reason: "repository_unclear" }, 202);
      }

      const gateway = await this.gatewayFactory(env, payload.installation?.id);
      const openReleaseBranches = await gateway.listBranchNames(
        refs.repository,
        config.releaseBranchPrefix
      );
      const plan = planProductionMerge(config, {
        repositoryName: refs.repository,
        baseBranch: refs.baseBranch,
        headBranch: refs.headBranch,
        mergeCommitSha: refs.mergeCommitSha,
        openReleaseBranches,
      });

      if (!plan.valid) {
        return json({ valid: false, reason: plan.reason, repository: plan.repo }, 202);
      }

      const results: GitFlowActionResult[] = [];
      for (const action of plan.actions) {
        results.push(await gateway.executeAction(action));
      }

      return json({
        valid: true,
        repository: plan.repo,
        tag: plan.tag,
        results,
      });
    }

    return json({ ignored: true, reason: "action_not_handled" }, 202);
  }

  private handlePullRequestJson(
    config: GitFlowConfig,
    body: Record<string, unknown>
  ): Response {
    const baseBranch = typeof body.baseBranch === "string" ? body.baseBranch : null;
    const headBranch = typeof body.headBranch === "string" ? body.headBranch : null;

    if (!baseBranch || !headBranch) {
      return json({ ignored: true, reason: "missing_refs" }, 400);
    }

    const validation = validatePullRequest(config, { baseBranch, headBranch });
    return json({ validation }, validation.valid ? 200 : 422);
  }

  private async handleBranch(
    env: WorkerEnvironment,
    config: GitFlowConfig,
    body: Record<string, unknown>
  ): Promise<Response> {
    const plan = planBranchCreation(config, {
      statusName: typeof body.statusName === "string" ? body.statusName : null,
      repositoryName:
        typeof body.repository === "string" ? body.repository : null,
      issueId: typeof body.issueId === "string" ? body.issueId : null,
      issueNumber:
        typeof body.issueNumber === "number" ? body.issueNumber : null,
      title: typeof body.title === "string" ? body.title : null,
    });

    if (plan.decision !== "create_branch") {
      return json({ decision: plan.decision, reason: plan.reason }, 202);
    }

    const results = await this.runPlan(env, [plan.action], body);

    return json({ decision: plan.decision, branch: plan.action.branch, results });
  }

  private async handleRelease(
    env: WorkerEnvironment,
    config: GitFlowConfig,
    body: Record<string, unknown>
  ): Promise<Response> {
    const version = typeof body.version === "string" ? body.version : "";
    const affected = Array.isArray(body.repositories)
      ? body.repositories.filter((value): value is string => typeof value === "string")
      : [];

    const plan = planRelease(config, { version, affectedRepositories: affected });

    if (!plan.valid) {
      return json({ valid: false, reason: plan.reason, unresolved: plan.unresolved }, 422);
    }

    const results = await this.runPlan(env, plan.actions, body);

    return json({
      valid: true,
      version: plan.version,
      repositories: plan.repositories.map((repo) => repo.repo),
      unresolved: plan.unresolved,
      results,
    });
  }

  private async handleHotfix(
    env: WorkerEnvironment,
    config: GitFlowConfig,
    body: Record<string, unknown>
  ): Promise<Response> {
    const plan = planHotfix(config, {
      version: typeof body.version === "string" ? body.version : "",
      repositoryName: typeof body.repository === "string" ? body.repository : "",
      approved: body.approved === true,
      openReleaseBranch:
        typeof body.openReleaseBranch === "string" ? body.openReleaseBranch : null,
    });

    if (!plan.valid) {
      return json({ valid: false, reason: plan.reason }, 422);
    }

    const results = await this.runPlan(env, plan.actions, body);

    return json({
      valid: true,
      version: plan.version,
      repo: plan.repo,
      hotfixBranch: plan.hotfixBranch,
      results,
    });
  }

  /**
   * Exige autorizacao de admin sempre que `execute: true` for enviado para
   * uma rota `/git-flow/*`. Dry-run (sem `execute`) nao exige token.
   */
  private authorizeExecution(
    request: Request,
    env: WorkerEnvironment,
    body: Record<string, unknown>
  ): Response | null {
    if (body.execute !== true) {
      return null;
    }

    const adminToken = env.GIT_FLOW_ADMIN_TOKEN?.trim();

    if (!adminToken) {
      return json({ ignored: true, reason: "execution_not_configured" }, 403);
    }

    const provided = readAdminToken(request);

    if (!provided || provided !== adminToken) {
      return json({ ignored: true, reason: "unauthorized" }, 401);
    }

    return null;
  }

  /**
   * Executa ou planeja as acoes. Tags so executam quando `createTags: true`
   * for enviado alem de `execute: true` (tag e etapa pos-merge de producao).
   * Sem `createTags`, as acoes de tag ficam diferidas
   * (`${TAG_DEFERRED_DETAIL}`), enquanto branch/PR podem executar.
   */
  private async runPlan(
    env: WorkerEnvironment,
    actions: GitFlowAction[],
    body: Record<string, unknown>
  ): Promise<GitFlowActionResult[]> {
    const execute = body.execute === true;
    const createTags = body.createTags === true;
    const isDeferredTag = (action: GitFlowAction): boolean =>
      action.type === "create_tag" && !createTags;

    if (!execute) {
      return actions.map((action) => ({
        action,
        status: "planned" as const,
        ...(isDeferredTag(action) ? { detail: TAG_DEFERRED_DETAIL } : {}),
      }));
    }

    const hasExecutable = actions.some((action) => !isDeferredTag(action));

    if (!hasExecutable) {
      return actions.map((action) => ({
        action,
        status: "blocked" as const,
        detail: TAG_DEFERRED_DETAIL,
      }));
    }

    const installationId =
      typeof body.installationId === "string" ? body.installationId : undefined;
    const gateway = await this.gatewayFactory(env, installationId);
    const results: GitFlowActionResult[] = [];

    for (const action of actions) {
      if (isDeferredTag(action)) {
        results.push({ action, status: "blocked", detail: TAG_DEFERRED_DETAIL });
        continue;
      }

      results.push(await gateway.executeAction(action));
    }

    return results;
  }
}
