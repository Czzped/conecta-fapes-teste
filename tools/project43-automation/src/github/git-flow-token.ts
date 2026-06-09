import type { WorkerEnvironment } from "../config/worker-config.js";

export const GIT_FLOW_REPOSITORY_TOKEN_KEYS = [
  "GITHUB_GIT_FLOW_TOKEN",
  "GITHUB_REPOSITORY_TOKEN",
  "GITHUB_STATUS_TOKEN",
] as const;

/**
 * Resolve o token usado para side-effects em repositorios tecnicos
 * (refs/branches/PRs/tags). O webhook do Project ainda usa o token do GitHub
 * App para ler/alterar o Project; este fallback cobre instalacoes do App sem
 * permissao `Contents: write` nos repositorios privados.
 */
export function resolveGitFlowRepositoryToken(
  env: WorkerEnvironment,
  fallbackToken: string
): string {
  for (const key of GIT_FLOW_REPOSITORY_TOKEN_KEYS) {
    const value = env[key]?.trim();

    if (value) {
      return value;
    }
  }

  return fallbackToken;
}
