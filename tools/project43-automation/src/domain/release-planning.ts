import type { GitFlowConfig, RepoDefinition } from "../config/git-flow-config.js";
import { resolveRepository } from "../config/git-flow-config.js";
import type { GitFlowAction } from "./git-flow-actions.js";

const RELEASE_VERSION_PATTERN = /^v\d+\.\d+$/;

export interface ReleasePlanInput {
  /** Versao da release no formato `vX.Y`. */
  version: string;
  /** Repositorios afetados pela release (nomes puros ou `org/repo`). */
  affectedRepositories: string[];
}

export interface RepoReleasePlan {
  repo: string;
  productionBranch: string;
  releaseBranch: string;
  actions: GitFlowAction[];
}

export interface ReleasePlan {
  version: string;
  valid: boolean;
  reason?: "invalid_version" | "no_affected_repositories";
  repositories: RepoReleasePlan[];
  /** Repositorios informados que nao foram reconhecidos. */
  unresolved: string[];
  actions: GitFlowAction[];
}

function buildRepoReleasePlan(
  repo: RepoDefinition,
  version: string,
  releaseBranch: string
): RepoReleasePlan {
  const actions: GitFlowAction[] = [
    {
      type: "create_branch",
      repo: repo.name,
      branch: releaseBranch,
      baseBranch: repo.developBranch,
    },
    {
      type: "open_pull_request",
      repo: repo.name,
      head: releaseBranch,
      base: repo.productionBranch,
      title: `Release ${version}`,
      body: `Release automatica ${version} de \`${repo.developBranch}\` para \`${repo.productionBranch}\`.`,
    },
    {
      type: "create_tag",
      repo: repo.name,
      tag: version,
      ref: repo.productionBranch,
    },
  ];

  return {
    repo: repo.name,
    productionBranch: repo.productionBranch,
    releaseBranch,
    actions,
  };
}

/**
 * Planeja uma release `vX.Y`. Para cada repositorio afetado e reconhecido,
 * gera as acoes: criar `release/vX.Y` a partir de `develop`, abrir PR da
 * release para producao e criar a tag em producao (apos o merge).
 *
 * A funcao e pura: nao executa nada. O resultado serve tanto para `dry-run`
 * quanto para execucao planejada via gateway.
 */
export function planRelease(config: GitFlowConfig, input: ReleasePlanInput): ReleasePlan {
  const version = input.version.trim();
  const releaseBranch = `${config.releaseBranchPrefix}${version}`;

  if (!RELEASE_VERSION_PATTERN.test(version)) {
    return {
      version,
      valid: false,
      reason: "invalid_version",
      repositories: [],
      unresolved: [],
      actions: [],
    };
  }

  const repositories: RepoReleasePlan[] = [];
  const unresolved: string[] = [];

  for (const name of input.affectedRepositories) {
    const repo = resolveRepository(config, name);

    if (!repo) {
      unresolved.push(name);
      continue;
    }

    repositories.push(buildRepoReleasePlan(repo, version, releaseBranch));
  }

  if (repositories.length === 0) {
    return {
      version,
      valid: false,
      reason: "no_affected_repositories",
      repositories: [],
      unresolved,
      actions: [],
    };
  }

  return {
    version,
    valid: true,
    repositories,
    unresolved,
    actions: repositories.flatMap((plan) => plan.actions),
  };
}
