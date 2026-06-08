/**
 * Modelo de acoes do Git Flow. Os planejadores (branch / release / hotfix)
 * sao funcoes puras que produzem uma lista de `GitFlowAction`. O gateway
 * GitHub e o unico componente que executa essas acoes de fato, o que mantem
 * o dominio testavel e permite o modo `dry-run` (plan-first).
 */

export interface CreateBranchAction {
  type: "create_branch";
  repo: string;
  /** Nome do branch a ser criado, ex.: `release/v1.2`. */
  branch: string;
  /** Branch base de onde o novo branch deve partir, ex.: `develop`. */
  baseBranch: string;
}

export interface OpenPullRequestAction {
  type: "open_pull_request";
  repo: string;
  head: string;
  base: string;
  title: string;
  body?: string;
}

export interface CreateTagAction {
  type: "create_tag";
  repo: string;
  tag: string;
  /** Branch/ref de onde a tag deve apontar, ex.: `main`. */
  ref: string;
}

export type GitFlowAction = CreateBranchAction | OpenPullRequestAction | CreateTagAction;

export type GitFlowActionStatus =
  | "planned"
  | "created"
  | "already_exists"
  | "skipped"
  | "blocked"
  | "failed";

export interface GitFlowActionResult {
  action: GitFlowAction;
  status: GitFlowActionStatus;
  detail?: string;
}

const DIACRITICS_PATTERN = /[̀-ͯ]/g;

export function slugifyBranchSegment(value: string): string {
  return value
    .normalize("NFD")
    .replace(DIACRITICS_PATTERN, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
