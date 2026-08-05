import type { GitFlowConfig } from "../config/git-flow-config.js";
import {
  listHomologationBranches,
  listProductionBranches,
} from "../config/git-flow-config.js";

export const PR_POLICY_CHECK_NAME = "git-flow/pr-policy";

export interface PrValidationInput {
  /** Branch de destino do PR (base). */
  baseBranch: string;
  /** Branch de origem do PR (head). */
  headBranch: string;
}

export type PrValidationReason =
  | "production_pr_must_come_from_release_or_hotfix"
  | "homologation_pr_must_come_from_release_or_hotfix"
  | "develop_pr_from_protected_branch"
  | "develop_pr_from_unknown_branch"
  | "ok_production_release_or_hotfix"
  | "ok_homologation_release_or_hotfix"
  | "ok_homologation_backmerge"
  | "ok_develop_work_branch"
  | "ok_develop_backmerge"
  | "no_rule";

export interface PrValidationResult {
  valid: boolean;
  reason: PrValidationReason;
  checkName: string;
  baseBranch: string;
  headBranch: string;
}

function startsWithAny(value: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => value.startsWith(prefix));
}

/**
 * Valida a politica de PR do Git Flow.
 *
 * 1. PR para producao (`main`/`master`) so pode vir de `release/*` ou
 *    `hotfix/*`.
 * 2. PR para homologacao (`homol`) so pode vir de `release/*`, `hotfix/*` ou
 *    de producao (back-merge). O veiculo ate homologacao e a branch de release
 *    — e isso que garante que tudo que vai para homologacao esta versionado.
 * 3. PR para `develop` deve vir de um branch de trabalho permitido, ou ser um
 *    back-merge de producao/homologacao. Nunca de `develop` para `develop`.
 * 4. Outros destinos nao tem regra e sao considerados neutros (validos).
 */
export function validatePullRequest(
  config: GitFlowConfig,
  input: PrValidationInput
): PrValidationResult {
  const base = input.baseBranch.trim();
  const head = input.headBranch.trim();
  const productionBranches = listProductionBranches(config);
  const homologationBranches = listHomologationBranches(config);
  const { releaseBranchPrefix, hotfixBranchPrefix } = config;

  const result = (valid: boolean, reason: PrValidationReason): PrValidationResult => ({
    valid,
    reason,
    checkName: PR_POLICY_CHECK_NAME,
    baseBranch: base,
    headBranch: head,
  });

  const isReleaseOrHotfix =
    head.startsWith(releaseBranchPrefix) || head.startsWith(hotfixBranchPrefix);

  if (productionBranches.includes(base)) {
    return isReleaseOrHotfix
      ? result(true, "ok_production_release_or_hotfix")
      : result(false, "production_pr_must_come_from_release_or_hotfix");
  }

  if (homologationBranches.includes(base)) {
    if (isReleaseOrHotfix) {
      return result(true, "ok_homologation_release_or_hotfix");
    }

    // Back-merge de producao para homologacao, depois de um hotfix.
    if (productionBranches.includes(head)) {
      return result(true, "ok_homologation_backmerge");
    }

    return result(false, "homologation_pr_must_come_from_release_or_hotfix");
  }

  if (base === config.developBranch) {
    // Bloqueia apenas PR de develop para develop (nao faz sentido).
    if (head === config.developBranch) {
      return result(false, "develop_pr_from_protected_branch");
    }

    const isWorkBranch =
      startsWithAny(head, config.workBranchPrefixes) || isReleaseOrHotfix;

    if (isWorkBranch) {
      return result(true, "ok_develop_work_branch");
    }

    // Permite back-merge de producao (main/master) e de homologacao (homol)
    // para develop.
    if (productionBranches.includes(head) || homologationBranches.includes(head)) {
      return result(true, "ok_develop_backmerge");
    }

    return result(false, "develop_pr_from_unknown_branch");
  }

  return result(true, "no_rule");
}
