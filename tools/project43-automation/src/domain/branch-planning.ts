import type { GitFlowConfig, RepoDefinition } from "../config/git-flow-config.js";
import { resolveRepository } from "../config/git-flow-config.js";
import {
  slugifyBranchSegment,
  type CreateBranchAction,
} from "./git-flow-actions.js";

export interface BranchPlanInput {
  /** Status atual do item do Project (ex.: vindo do webhook). */
  statusName: string | null;
  /** Nome do repositorio (puro ou `org/repo`), quando identificavel. */
  repositoryName: string | null;
  issueNumber?: number | null;
  title?: string | null;
  /** Prefixo do branch de trabalho, default `feature/`. */
  branchPrefix?: string;
}

export interface CreateBranchPlan {
  decision: "create_branch";
  repo: RepoDefinition;
  action: CreateBranchAction;
}

export interface SkippedBranchPlan {
  decision: "ignored" | "needs_review";
  reason: string;
}

export type BranchPlan = CreateBranchPlan | SkippedBranchPlan;

const DEFAULT_BRANCH_PREFIX = "feature/";

function buildBranchName(
  prefix: string,
  issueNumber: number | null | undefined,
  title: string | null | undefined
): string {
  const slug = slugifyBranchSegment(title ?? "");
  const parts: string[] = [];

  if (typeof issueNumber === "number" && Number.isFinite(issueNumber)) {
    parts.push(String(issueNumber));
  }

  if (slug) {
    parts.push(slug);
  }

  const suffix = parts.join("-") || "work";

  return `${prefix}${suffix}`;
}

/**
 * Decide se um branch deve ser criado quando uma demanda entra em
 * "Pronto para desenvolvimento".
 *
 * - status diferente do configurado -> `ignored` (nada a fazer);
 * - repositorio nao reconhecido/ausente -> `needs_review` (nao cria branch as
 *   cegas, conforme regra do fluxo);
 * - caso contrario -> `create_branch` a partir de `develop`.
 */
export function planBranchCreation(
  config: GitFlowConfig,
  input: BranchPlanInput
): BranchPlan {
  if (input.statusName !== config.readyForDevStatusName) {
    return { decision: "ignored", reason: "status_not_ready" };
  }

  const repo = resolveRepository(config, input.repositoryName);

  if (!repo) {
    return { decision: "needs_review", reason: "repository_unclear" };
  }

  const prefix = input.branchPrefix ?? DEFAULT_BRANCH_PREFIX;
  const branch = buildBranchName(prefix, input.issueNumber, input.title);

  return {
    decision: "create_branch",
    repo,
    action: {
      type: "create_branch",
      repo: repo.name,
      branch,
      baseBranch: repo.developBranch,
    },
  };
}
