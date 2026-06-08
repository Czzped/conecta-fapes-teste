const DEFAULT_PROJECT_ORG = "leds-conectafapes";
const DEFAULT_PROJECT_ID = "PVT_kwDOCqjXps4BUK-d";
const DEFAULT_PROJECT_NUMBER = "43";
const DEFAULT_STATUS_FIELD_NAME = "Status";
const DEFAULT_STARTED_AT_FIELD_NAME = "Iniciado em";
const DEFAULT_DONE_AT_FIELD_NAME = "Data de Conclusao";
const DEFAULT_REPOSITORY_FIELD_NAME = "Repositório";
const DEFAULT_IN_PROGRESS_STATUS_NAME = "In Progress";
const DEFAULT_DONE_STATUS_NAME = "Done";

const LEGACY_DONE_AT_FIELD_ALIASES = [
  DEFAULT_DONE_AT_FIELD_NAME,
  "Data de Conclusão",
  "Data de ConclusÃ£o",
];

export interface ProjectFieldNames {
  status: string;
  statusAliases: string[];
  startedAt: string;
  startedAtAliases: string[];
  doneAt: string;
  doneAtAliases: string[];
  repository: string;
  repositoryAliases: string[];
}

export interface ProjectStatusNames {
  inProgress: string;
  done: string;
}

export interface ProjectConfig {
  githubOrg: string;
  projectId: string;
  projectNumber: string;
  fieldNames: ProjectFieldNames;
  statusNames: ProjectStatusNames;
}

type ConfigSource = Record<string, string | undefined>;

interface CreateProjectConfigOptions {
  requireProjectId?: boolean;
}

function getTrimmedValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function getRequiredValue(source: ConfigSource, key: string): string {
  const value = getTrimmedValue(source[key]);

  if (!value) {
    throw new Error(`missing env: ${key}`);
  }

  return value;
}

function getOptionalValue(
  source: ConfigSource,
  key: string,
  fallback: string
): string {
  return getTrimmedValue(source[key]) ?? fallback;
}

function createAliases(primary: string, aliases: string[]): string[] {
  return [...new Set([primary, ...aliases].filter(Boolean))];
}

export function createProjectConfig(
  source: ConfigSource,
  options: CreateProjectConfigOptions = {}
): ProjectConfig {
  const projectId = options.requireProjectId
    ? getRequiredValue(source, "GITHUB_PROJECT_ID")
    : getOptionalValue(source, "GITHUB_PROJECT_ID", DEFAULT_PROJECT_ID);

  const statusFieldName = getOptionalValue(
    source,
    "STATUS_FIELD_NAME",
    DEFAULT_STATUS_FIELD_NAME
  );
  const startedAtFieldName = getOptionalValue(
    source,
    "STARTED_AT_FIELD_NAME",
    DEFAULT_STARTED_AT_FIELD_NAME
  );
  const doneAtFieldName = getOptionalValue(
    source,
    "DONE_AT_FIELD_NAME",
    DEFAULT_DONE_AT_FIELD_NAME
  );
  const repositoryFieldName = getOptionalValue(
    source,
    "REPOSITORY_FIELD_NAME",
    DEFAULT_REPOSITORY_FIELD_NAME
  );

  return {
    githubOrg: getOptionalValue(source, "GITHUB_ORG", DEFAULT_PROJECT_ORG),
    projectId,
    projectNumber: getOptionalValue(
      source,
      "GITHUB_PROJECT_NUMBER",
      DEFAULT_PROJECT_NUMBER
    ),
    fieldNames: {
      status: statusFieldName,
      statusAliases: createAliases(statusFieldName, [DEFAULT_STATUS_FIELD_NAME]),
      startedAt: startedAtFieldName,
      startedAtAliases: createAliases(startedAtFieldName, [
        DEFAULT_STARTED_AT_FIELD_NAME,
      ]),
      doneAt: doneAtFieldName,
      doneAtAliases: createAliases(doneAtFieldName, LEGACY_DONE_AT_FIELD_ALIASES),
      repository: repositoryFieldName,
      repositoryAliases: createAliases(repositoryFieldName, [
        DEFAULT_REPOSITORY_FIELD_NAME,
        "Repositorio",
      ]),
    },
    statusNames: {
      inProgress: getOptionalValue(
        source,
        "IN_PROGRESS_OPTION_NAME",
        DEFAULT_IN_PROGRESS_STATUS_NAME
      ),
      done: getOptionalValue(source, "DONE_OPTION_NAME", DEFAULT_DONE_STATUS_NAME),
    },
  };
}
