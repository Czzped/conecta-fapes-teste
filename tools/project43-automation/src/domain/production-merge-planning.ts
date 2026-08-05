import type { GitFlowConfig, RepoDefinition } from "../config/git-flow-config.js";
import { resolveRepository } from "../config/git-flow-config.js";
import type { GitFlowAction } from "./git-flow-actions.js";

export interface ProductionMergePlanInput {
  repositoryName: string | null;
  baseBranch: string;
  headBranch: string;
  mergeCommitSha?: string | null;
  openReleaseBranches?: string[];
}

export type ProductionMergePlanReason =
  | "repository_unclear"
  | "not_production_branch"
  | "not_release_or_hotfix"
  | "tag_unresolved";

export interface ProductionMergePlan {
  valid: boolean;
  reason?: ProductionMergePlanReason;
  repo?: string;
  tag?: string;
  actions: GitFlowAction[];
}

const VERSION_PATTERN = /^v\d+\.\d+\.\d+$/;

function buildTagAction(
  repo: RepoDefinition,
  tag: string,
  mergeCommitSha: string | null | undefined
): GitFlowAction {
  return {
    type: "create_tag",
    repo: repo.name,
    tag,
    ref: repo.productionBranch,
    ...(mergeCommitSha ? { targetSha: mergeCommitSha } : {}),
  };
}

function versionFromReleaseBranch(config: GitFlowConfig, branch: string): string | null {
  if (!branch.startsWith(config.releaseBranchPrefix)) {
    return null;
  }

  const version = branch.slice(config.releaseBranchPrefix.length).trim();
  return VERSION_PATTERN.test(version) ? version : null;
}

function versionFromHotfixBranch(config: GitFlowConfig, branch: string): string | null {
  if (!branch.startsWith(config.hotfixBranchPrefix)) {
    return null;
  }

  const value = branch.slice(config.hotfixBranchPrefix.length).trim();
  const match = value.match(/^v\d+\.\d+\.\d+/);
  const version = match?.[0] ?? "";

  return VERSION_PATTERN.test(version) ? version : null;
}

function uniqueBranches(branches: string[] | undefined): string[] {
  return [...new Set((branches ?? []).map((branch) => branch.trim()).filter(Boolean))];
}

export function planProductionMerge(
  config: GitFlowConfig,
  input: ProductionMergePlanInput
): ProductionMergePlan {
  const repo = resolveRepository(config, input.repositoryName);

  if (!repo) {
    return { valid: false, reason: "repository_unclear", actions: [] };
  }

  if (input.baseBranch !== repo.productionBranch) {
    return { valid: false, reason: "not_production_branch", repo: repo.name, actions: [] };
  }

  const releaseTag = versionFromReleaseBranch(config, input.headBranch);
  const hotfixTag = versionFromHotfixBranch(config, input.headBranch);
  const tag = releaseTag ?? hotfixTag;

  if (!tag) {
    const isGitFlowBranch =
      input.headBranch.startsWith(config.releaseBranchPrefix) ||
      input.headBranch.startsWith(config.hotfixBranchPrefix);

    return {
      valid: false,
      reason: isGitFlowBranch ? "tag_unresolved" : "not_release_or_hotfix",
      repo: repo.name,
      actions: [],
    };
  }

  const actions: GitFlowAction[] = [
    buildTagAction(repo, tag, input.mergeCommitSha),
  ];

  if (hotfixTag) {
    // Retorno para homologacao antes de develop: sem isso o hotfix fica so em
    // producao e a proxima release, cortada de develop, o desfaz.
    if (repo.homologationBranch) {
      actions.push({
        type: "open_pull_request",
        repo: repo.name,
        head: input.headBranch,
        base: repo.homologationBranch,
        title: `Hotfix ${hotfixTag} -> ${repo.homologationBranch}`,
        body: `Retorno automatico do hotfix ${hotfixTag} para \`${repo.homologationBranch}\`.`,
      });
    }

    actions.push({
      type: "open_pull_request",
      repo: repo.name,
      head: input.headBranch,
      base: repo.developBranch,
      title: `Hotfix ${hotfixTag} -> ${repo.developBranch}`,
      body: `Retorno automatico do hotfix ${hotfixTag} para \`${repo.developBranch}\`.`,
    });

    for (const releaseBranch of uniqueBranches(input.openReleaseBranches)) {
      actions.push({
        type: "open_pull_request",
        repo: repo.name,
        head: input.headBranch,
        base: releaseBranch,
        title: `Hotfix ${hotfixTag} -> ${releaseBranch}`,
        body: `Retorno automatico do hotfix ${hotfixTag} para a release aberta \`${releaseBranch}\`.`,
      });
    }
  }

  // Back-merge de producao para homologacao e develop apos release. O PR para
  // homologacao costuma ser no-op (a release passou por homol antes de ir para
  // producao), mas garante convergencia quando o merge em producao trouxe algo
  // a mais — um hotfix mergeado na propria release, por exemplo.
  if (releaseTag) {
    if (repo.homologationBranch) {
      actions.push({
        type: "open_pull_request",
        repo: repo.name,
        head: repo.productionBranch,
        base: repo.homologationBranch,
        title: `Back-merge ${repo.productionBranch} -> ${repo.homologationBranch} (${releaseTag})`,
        body: `Back-merge automatico de \`${repo.productionBranch}\` para \`${repo.homologationBranch}\` apos release ${releaseTag}.`,
      });
    }

    actions.push({
      type: "open_pull_request",
      repo: repo.name,
      head: repo.productionBranch,
      base: repo.developBranch,
      title: `Back-merge ${repo.productionBranch} -> ${repo.developBranch} (${releaseTag})`,
      body: `Back-merge automatico de \`${repo.productionBranch}\` para \`${repo.developBranch}\` apos release ${releaseTag}.`,
    });
  }

  return {
    valid: true,
    repo: repo.name,
    tag,
    actions,
  };
}
