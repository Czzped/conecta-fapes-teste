export interface PullRequestWebhookPayload {
  action?: string;
  installation?: { id?: number | string };
  pull_request?: {
    base?: { ref?: string };
    head?: { ref?: string };
  };
  repository?: { name?: string };
}

export interface PullRequestRefs {
  baseBranch: string;
  headBranch: string;
  repository: string | null;
}

const PR_VALIDATION_ACTIONS = new Set([
  "opened",
  "reopened",
  "synchronize",
  "edited",
  "ready_for_review",
]);

export function shouldValidatePullRequest(
  eventName: string | null,
  payload: PullRequestWebhookPayload
): boolean {
  return (
    eventName === "pull_request" &&
    typeof payload.action === "string" &&
    PR_VALIDATION_ACTIONS.has(payload.action)
  );
}

export function extractPullRequestRefs(
  payload: PullRequestWebhookPayload
): PullRequestRefs | null {
  const baseBranch = payload.pull_request?.base?.ref;
  const headBranch = payload.pull_request?.head?.ref;

  if (!baseBranch || !headBranch) {
    return null;
  }

  return {
    baseBranch,
    headBranch,
    repository: payload.repository?.name ?? null,
  };
}
