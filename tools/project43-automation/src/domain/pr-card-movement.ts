/**
 * Dominio puro para movimentacao automatica de cards do Project 43
 * baseada em eventos de Pull Request (abertura e merge).
 *
 * - PR aberto de branch de trabalho (feature/, feat/, fix/, etc.)
 *   move o card de "In Progress" para "In Validation".
 * - PR mergeado move o card para "Homologation"
 *   (independente do status atual).
 */

export interface CardMovementPlanInput {
  /** Acao do webhook de pull_request: opened, closed, etc. */
  prAction: string;
  /** Se o PR foi mergeado (relevante quando prAction === "closed"). */
  merged: boolean;
  /** Nome do branch de origem do PR, ex.: feature/2230-cliente-soap */
  headBranch: string;
  /** Prefixos de branches de trabalho reconhecidos. */
  workBranchPrefixes: string[];
}

export type CardMovementDecision =
  | "move_to_validation"
  | "move_to_homologation"
  | "ignored";

export interface CardMovementPlan {
  decision: CardMovementDecision;
  cardNumber: number | null;
  reason: string;
}

/**
 * Extrai o numero do card do nome do branch.
 * Branches seguem o padrao: <prefixo><numero>-<slug>
 * Exemplos:
 *   feature/2230-cliente-soap → 2230
 *   fix/42-corrige-bug → 42
 *   feat/5 → 5
 *   release/v1.2 → null
 *   hotfix/v1.2.1-2090 → 2090
 */
export function extractCardNumber(branchName: string): number | null {
  // Remove o prefixo do tipo de branch (feature/, fix/, hotfix/, etc.)
  const afterPrefix = branchName.replace(/^[^/]+\//, "");

  // Hotfix pode ter formato hotfix/v1.2.1-2090
  const hotfixMatch = afterPrefix.match(/^v[\d.]+-(\d+)/);
  if (hotfixMatch) {
    const num = Number(hotfixMatch[1]);
    return Number.isFinite(num) && num > 0 ? num : null;
  }

  // Work branches: extrai o numero do inicio (antes do primeiro - ou fim)
  const workMatch = afterPrefix.match(/^(\d+)(?:-|$)/);
  if (workMatch) {
    const num = Number(workMatch[1]);
    return Number.isFinite(num) && num > 0 ? num : null;
  }

  return null;
}

function isWorkBranch(
  branchName: string,
  workBranchPrefixes: string[],
): boolean {
  return workBranchPrefixes.some((prefix) => branchName.startsWith(prefix));
}

function isHotfixBranch(branchName: string): boolean {
  return branchName.startsWith("hotfix/");
}

const PR_OPENED_ACTIONS = new Set([
  "opened",
  "reopened",
  "ready_for_review",
]);

/**
 * Decide se e qual movimento de card deve ser feito com base no evento de PR.
 *
 * Regras:
 * - PR aberto/reaberto de branch de trabalho → move_to_validation
 *   (se conseguir extrair numero do card)
 * - PR mergeado de branch de trabalho ou hotfix → move_to_homologation
 *   (se conseguir extrair numero do card)
 * - Demais casos → ignored
 */
export function planCardMovement(input: CardMovementPlanInput): CardMovementPlan {
  const { prAction, merged, headBranch, workBranchPrefixes } = input;

  const isWork = isWorkBranch(headBranch, workBranchPrefixes);
  const isHotfix = isHotfixBranch(headBranch);

  // PR aberto (work branch) → Validation
  if (PR_OPENED_ACTIONS.has(prAction) && isWork) {
    const cardNumber = extractCardNumber(headBranch);
    if (cardNumber === null) {
      return { decision: "ignored", cardNumber: null, reason: "card_number_not_found_in_branch" };
    }
    return { decision: "move_to_validation", cardNumber, reason: "pr_opened" };
  }

  // PR mergeado (work ou hotfix) → Homologation
  if (prAction === "closed" && merged && (isWork || isHotfix)) {
    const cardNumber = extractCardNumber(headBranch);
    if (cardNumber === null) {
      return { decision: "ignored", cardNumber: null, reason: "card_number_not_found_in_branch" };
    }
    return { decision: "move_to_homologation", cardNumber, reason: "pr_merged" };
  }

  return { decision: "ignored", cardNumber: null, reason: "not_applicable" };
}
