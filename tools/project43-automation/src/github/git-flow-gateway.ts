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

interface BranchResponse {
  name?: string;
}

interface PullRequestResponse {
  number?: number;
  html_url?: string;
}

interface CommitStatusRequest {
  state: "error" | "failure" | "pending" | "success";
  context: string;
  description: string;
  target_url?: string;
}

interface CommitStatusResponse {
  id?: number;
  state?: string;
}

export interface CommitStatusResult {
  status: "created" | "failed";
  detail?: string;
}

interface ExecuteOptions {
  dryRun?: boolean;
}

function encodeRef(value: string): string {
  return value.split("/").map(encodeURIComponent).join("/");
}

interface GitHubErrorData {
  message?: string;
  documentation_url?: string;
}

function describeGitHubFailure<TData>(response: {
  status: number;
  data: TData | null;
}): string {
  const data = response.data as GitHubErrorData | null;
  return data?.message ? `status ${response.status}: ${data.message}` : `status ${response.status}`;
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
        `failed to read ${refType}/${name} on ${repo}: ${describeGitHubFailure(response)}`
      );
    }

    return response.data?.object?.sha ?? null;
  }

  async createBranch(action: CreateBranchAction): Promise<GitFlowActionResult> {
    let existing: string | null;

    try {
      existing = await this.getRefSha(action.repo, "heads", action.branch);
    } catch (error) {
      return {
        action,
        status: "failed",
        detail: error instanceof Error ? error.message : String(error),
      };
    }

    if (existing) {
      return { action, status: "already_exists" };
    }

    let baseSha: string | null;

    try {
      baseSha = await this.getRefSha(action.repo, "heads", action.baseBranch);
    } catch (error) {
      return {
        action,
        status: "failed",
        detail: error instanceof Error ? error.message : String(error),
      };
    }

    if (!baseSha) {
      return {
        action,
        status: "failed",
        detail: `base branch not found or not visible: ${action.baseBranch}`,
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
      return { action, status: "failed", detail: describeGitHubFailure(response) };
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

    const targetSha =
      action.targetSha ?? (await this.getRefSha(action.repo, "heads", action.ref));

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

  async createCommitStatus(
    repo: string,
    sha: string,
    status: CommitStatusRequest
  ): Promise<CommitStatusResult> {
    const response = await this.client.request<CommitStatusResponse>(
      "POST",
      `${this.repoPath(repo)}/statuses/${encodeURIComponent(sha)}`,
      status
    );

    if (!response.ok) {
      return {
        status: "failed",
        detail: `status ${response.status}`,
      };
    }

    return {
      status: "created",
      detail: response.data?.state,
    };
  }

  async listBranchNames(repo: string, prefix: string): Promise<string[]> {
    const response = await this.client.request<BranchResponse[]>(
      "GET",
      `${this.repoPath(repo)}/branches?per_page=100`
    );

    if (!response.ok || !response.data) {
      throw new Error(`failed to list branches on ${repo}: ${response.status}`);
    }

    return response.data
      .map((branch) => branch.name)
      .filter((name): name is string => Boolean(name))
      .filter((name) => name.startsWith(prefix));
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
