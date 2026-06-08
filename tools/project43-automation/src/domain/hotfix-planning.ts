import type { GitFlowConfig } from "../config/git-flow-config.js";
import { resolveRepository } from "../config/git-flow-config.js";
import type { GitFlowAction } from "./git-flow-actions.js";

const HOTFIX_VERSION_PATTERN = /^v\d+\.\d+\.\d+$/;

export interface HotfixPlanInput {
  /** Versao do hotfix no formato `vX.Y.Z`. */
  version: string;
  /** Repositorio do hotfix (nome puro ou `org/repo`). */
  repositoryName: string;
  /** Origem/aprovacao validada por quem dispara o fluxo. */
  approved: boolean;
  /**
   * Branch da release aberta, se existir, para abrir o PR de retorno.
   * `null`/ausente quando nao ha release em andamento.
   */
  openReleaseBranch?: string | null;
}

export interface HotfixPlan {
  version: string;
  valid: boolean;
  reason?: "invalid_version" | "not_approved" | "repository_unclear";
  repo?: string;
  hotfixBranch?: string;
  actions: GitFlowAction[];
}

/**
 * Planeja um hotfix seguro:
 * - valida formato da versao e aprovacao de origem;
 * - cria a tag de hotfix em producao;
 * - abre PR de retorno para `develop`;
 * - abre PR de retorno para a release aberta, se houver.
 *
 * Funcao pura — apenas representa as acoes (plan-first).
 */
export function planHotfix(config: GitFlowConfig, input: HotfixPlanInput): HotfixPlan {
  const version = input.version.trim();

  if (!HOTFIX_VERSION_PATTERN.test(version)) {
    return { version, valid: false, reason: "invalid_version", actions: [] };
  }

  if (!input.approved) {
    return { version, valid: false, reason: "not_approved", actions: [] };
  }

  const repo = resolveRepository(config, input.repositoryName);

  if (!repo) {
    return { version, valid: false, reason: "repository_unclear", actions: [] };
  }

  const hotfixBranch = `${config.hotfixBranchPrefix}${version}`;
  const actions: GitFlowAction[] = [
    {
      type: "create_tag",
      repo: repo.name,
      tag: version,
      ref: repo.productionBranch,
    },
    {
      type: "open_pull_request",
      repo: repo.name,
      head: hotfixBranch,
      base: repo.developBranch,
      title: `Hotfix ${version} -> ${repo.developBranch}`,
      body: `Retorno do hotfix ${version} para \`${repo.developBranch}\`.`,
    },
  ];

  const openReleaseBranch = input.openReleaseBranch?.trim();

  if (openReleaseBranch) {
    actions.push({
      type: "open_pull_request",
      repo: repo.name,
      head: hotfixBranch,
      base: openReleaseBranch,
      title: `Hotfix ${version} -> ${openReleaseBranch}`,
      body: `Retorno do hotfix ${version} para a release aberta \`${openReleaseBranch}\`.`,
    });
  }

  return {
    version,
    valid: true,
    repo: repo.name,
    hotfixBranch,
    actions,
  };
}
