import type {
  CreateBranchAction,
  CreateTagAction,
  GitFlowAction,
  GitFlowActionResult,
  OpenPullRequestAction,
} from "../domain/git-flow-actions.js";
import { GitHubRestClient } from "./github-rest-client.js";

interface GitRefResponse {
  object?: { sha?: string };
}

interface PullRequestResponse {
  number?: number;
  html_url?: string;
}

interface ExecuteOptions {
  dryRun?: boolean;
}

function encodeRef(value: string): string {
  return value.split("/").map(encodeURIComponent).join("/");
}

/**
 * Gateway que executa acoes de Git Flow contra a API REST do GitHub.
 *
 * Todas as operacoes sao idempotentes: se o branch/PR/tag ja existir, retorna
 * `already_exists` em vez de falhar. Em modo `dryRun`, nenhuma chamada de
 * escrita e feita e cada acao retorna `planned`.
 */
export class GitFlowGateway {
  constructor(
    private readonly client: GitHubRestClient,
    private readonly org: string
  ) {}

  private repoPath(repo: string): string {
    return `/repos/${this.org}/${repo}`;
  }

  async getRefSha(
    repo: string,
    refType: "heads" | "tags",
    name: string
  ): Promise<string | null> {
    const response = await this.client.request<GitRefResponse>(
      "GET",
      `${this.repoPath(repo)}/git/ref/${refType}/${encodeRef(name)}`
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `failed to read ${refType}/${name} on ${repo}: ${response.status}`
      );
    }

    return response.data?.object?.sha ?? null;
  }

  async createBranch(action: CreateBranchAction): Promise<GitFlowActionResult> {
    const existing = await this.getRefSha(action.repo, "heads", action.branch);

    if (existing) {
      return { action, status: "already_exists" };
    }

    const baseSha = await this.getRefSha(action.repo, "heads", action.baseBranch);

    if (!baseSha) {
      return {
        action,
        status: "failed",
        detail: `base branch not found: ${action.baseBranch}`,
      };
    }

    const response = await this.client.request(
      "POST",
      `${this.repoPath(action.repo)}/git/refs`,
      { ref: `refs/heads/${action.branch}`, sha: baseSha }
    );

    if (response.status === 422) {
      return { action, status: "already_exists" };
    }

    if (!response.ok) {
      return { action, status: "failed", detail: `status ${response.status}` };
    }

    return { action, status: "created" };
  }

  async openPullRequest(action: OpenPullRequestAction): Promise<GitFlowActionResult> {
    const query = new URLSearchParams({
      head: `${this.org}:${action.head}`,
      base: action.base,
      state: "open",
    });
    const existing = await this.client.request<PullRequestResponse[]>(
      "GET",
      `${this.repoPath(action.repo)}/pulls?${query.toString()}`
    );

    if (existing.ok && existing.data && existing.data.length > 0) {
      return {
        action,
        status: "already_exists",
        detail: existing.data[0]?.html_url,
      };
    }

    const response = await this.client.request<PullRequestResponse>(
      "POST",
      `${this.repoPath(action.repo)}/pulls`,
      {
        title: action.title,
        head: action.head,
        base: action.base,
        body: action.body ?? "",
      }
    );

    if (response.status === 422) {
      return { action, status: "already_exists", detail: "unprocessable" };
    }

    if (!response.ok) {
      return { action, status: "failed", detail: `status ${response.status}` };
    }

    return { action, status: "created", detail: response.data?.html_url };
  }

  async createTag(action: CreateTagAction): Promise<GitFlowActionResult> {
    const existing = await this.getRefSha(action.repo, "tags", action.tag);

    if (existing) {
      return { action, status: "already_exists" };
    }

    const targetSha = await this.getRefSha(action.repo, "heads", action.ref);

    if (!targetSha) {
      return {
        action,
        status: "failed",
        detail: `ref not found: ${action.ref}`,
      };
    }

    const response = await this.client.request(
      "POST",
      `${this.repoPath(action.repo)}/git/refs`,
      { ref: `refs/tags/${action.tag}`, sha: targetSha }
    );

    if (response.status === 422) {
      return { action, status: "already_exists" };
    }

    if (!response.ok) {
      return { action, status: "failed", detail: `status ${response.status}` };
    }

    return { action, status: "created" };
  }

  async executeAction(action: GitFlowAction): Promise<GitFlowActionResult> {
    switch (action.type) {
      case "create_branch":
        return this.createBranch(action);
      case "open_pull_request":
        return this.openPullRequest(action);
      case "create_tag":
        return this.createTag(action);
    }
  }

  async executePlan(
    actions: GitFlowAction[],
    options: ExecuteOptions = {}
  ): Promise<GitFlowActionResult[]> {
    if (options.dryRun) {
      return actions.map((action) => ({ action, status: "planned" }));
    }

    const results: GitFlowActionResult[] = [];

    for (const action of actions) {
      results.push(await this.executeAction(action));
    }

    return results;
  }
}
