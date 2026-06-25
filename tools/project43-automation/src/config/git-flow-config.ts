export const DEFAULT_GIT_FLOW_ORG = "leds-conectafapes";
const DEFAULT_DEVELOP_BRANCH = "develop";
const DEFAULT_READY_FOR_DEV_STATUS = "In Progress";

const DEFAULT_WORK_BRANCH_PREFIXES = [
  "feature/",
  "feat/",
  "fix/",
  "bugfix/",
  "chore/",
  "docs/",
  "refactor/",
  "test/",
];

const DEFAULT_RELEASE_BRANCH_PREFIX = "release/";
const DEFAULT_HOTFIX_BRANCH_PREFIX = "hotfix/";

/**
 * Repositorios tecnicos do ConectaFapes. Cada repo declara o branch de
 * producao (`main` ou `master`) e o branch de integracao (`develop`).
 */
export const DEFAULT_REPOSITORIES: readonly RepoDefinition[] = [
  { name: "leds-conectafapes-backend-admin", productionBranch: "main", developBranch: "develop" },
  { name: "leds-conectafapes-frontend-backoffice", productionBranch: "main", developBranch: "develop" },
  { name: "leds-conectafapes-frontoffice-backend", productionBranch: "main", developBranch: "develop" },
  { name: "leds-conectafapes-frontoffice-frontend", productionBranch: "main", developBranch: "develop" },
  { name: "leds-conectafapes-prestacao-de-contas", productionBranch: "master", developBranch: "develop" },
];

export interface RepoDefinition {
  name: string;
  productionBranch: string;
  developBranch: string;
}

export interface GitFlowConfig {
  org: string;
  repositories: RepoDefinition[];
  readyForDevStatusName: string;
  inValidationStatusName: string;
  homologationStatusName: string;
  developBranch: string;
  workBranchPrefixes: string[];
  releaseBranchPrefix: string;
  hotfixBranchPrefix: string;
  /** Branches que nunca devem ser origem de um PR para `develop`. */
  protectedBranches: string[];
}

type ConfigSource = Record<string, string | undefined>;

function getTrimmedValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function getOptionalValue(source: ConfigSource, key: string, fallback: string): string {
  return getTrimmedValue(source[key]) ?? fallback;
}

function parseList(value: string | undefined, fallback: string[]): string[] {
  const trimmed = getTrimmedValue(value);

  if (!trimmed) {
    return [...fallback];
  }

  const parsed = trimmed
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : [...fallback];
}

export function createGitFlowConfig(source: ConfigSource = {}): GitFlowConfig {
  const org = getOptionalValue(source, "GITHUB_ORG", DEFAULT_GIT_FLOW_ORG);
  const developBranch = getOptionalValue(
    source,
    "GIT_FLOW_DEVELOP_BRANCH",
    DEFAULT_DEVELOP_BRANCH
  );
  const productionBranches = new Set(DEFAULT_REPOSITORIES.map((repo) => repo.productionBranch));

  return {
    org,
    repositories: DEFAULT_REPOSITORIES.map((repo) => ({ ...repo })),
    readyForDevStatusName: getOptionalValue(
      source,
      "READY_FOR_DEV_OPTION_NAME",
      DEFAULT_READY_FOR_DEV_STATUS
    ),
    inValidationStatusName: getOptionalValue(
      source,
      "IN_VALIDATION_OPTION_NAME",
      "In Validation"
    ),
    homologationStatusName: getOptionalValue(
      source,
      "HOMOLOGATION_OPTION_NAME",
      "Homologation"
    ),
    developBranch,
    workBranchPrefixes: parseList(
      source.GIT_FLOW_WORK_BRANCH_PREFIXES,
      DEFAULT_WORK_BRANCH_PREFIXES
    ),
    releaseBranchPrefix: getOptionalValue(
      source,
      "GIT_FLOW_RELEASE_PREFIX",
      DEFAULT_RELEASE_BRANCH_PREFIX
    ),
    hotfixBranchPrefix: getOptionalValue(
      source,
      "GIT_FLOW_HOTFIX_PREFIX",
      DEFAULT_HOTFIX_BRANCH_PREFIX
    ),
    protectedBranches: [developBranch, ...productionBranches],
  };
}

/**
 * Resolve um repositorio pelo nome. Aceita tanto o nome puro quanto
 * `org/repo`. Retorna `null` quando o repositorio nao e reconhecido, para
 * que o chamador trate como `needs_review` em vez de agir as cegas.
 */
export function resolveRepository(
  config: GitFlowConfig,
  repositoryName: string | null | undefined
): RepoDefinition | null {
  const trimmed = getTrimmedValue(repositoryName ?? undefined);

  if (!trimmed) {
    return null;
  }

  const bareName = trimmed.includes("/") ? trimmed.split("/").at(-1) ?? trimmed : trimmed;

  return config.repositories.find((repo) => repo.name === bareName) ?? null;
}

export function listProductionBranches(config: GitFlowConfig): string[] {
  return [...new Set(config.repositories.map((repo) => repo.productionBranch))];
}
