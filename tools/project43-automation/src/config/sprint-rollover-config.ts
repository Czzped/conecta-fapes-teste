import { createInstallationToken } from "../github/app-auth.js";
import { createProjectConfig, type ProjectConfig } from "./project-config.js";

const TOKEN_ENV_KEYS = ["GITHUB_PAT", "GITHUB_LEDS", "GITHUB_TOKEN"] as const;
const DEFAULT_ITERATION_FIELD_NAME = "Sprint";
const DEFAULT_DRY_RUN = false;

type ConfigSource = Record<string, string | undefined>;

export interface SprintRolloverConfig {
  accessToken: string;
  project: ProjectConfig;
  userAgent: string;
  iterationFieldNames: string[];
  dryRun: boolean;
  today: string;
}

function getTrimmedValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function getOptionalValue(
  source: ConfigSource,
  key: string,
  fallback: string
): string {
  return getTrimmedValue(source[key]) ?? fallback;
}

function getBooleanValue(
  source: ConfigSource,
  key: string,
  fallback: boolean
): boolean {
  const value = getTrimmedValue(source[key]);

  if (!value) {
    return fallback;
  }

  return ["1", "true", "yes", "sim"].includes(value.toLowerCase());
}

function getToday(source: ConfigSource): string {
  const value = getTrimmedValue(source.SPRINT_ROLLOVER_DATE);

  if (value) {
    return value;
  }

  return new Date().toISOString().slice(0, 10);
}

function createIterationFieldNames(source: ConfigSource): string[] {
  const primary = getOptionalValue(
    source,
    "ITERATION_FIELD_NAME",
    getOptionalValue(source, "SPRINT_FIELD_NAME", DEFAULT_ITERATION_FIELD_NAME)
  );

  return [...new Set([primary, "Sprint", "Iteration", "Iteracao"])];
}

function getStaticAccessToken(source: ConfigSource): string | null {
  for (const key of TOKEN_ENV_KEYS) {
    const value = getTrimmedValue(source[key]);

    if (value) {
      return value;
    }
  }

  return null;
}

async function getAccessToken(
  source: ConfigSource,
  userAgent: string
): Promise<string> {
  const staticToken = getStaticAccessToken(source);

  if (staticToken) {
    return staticToken;
  }

  const appId = getTrimmedValue(source.GITHUB_APP_ID);
  const installationId = getTrimmedValue(source.GITHUB_APP_INSTALLATION_ID);
  const privateKey = getTrimmedValue(source.GITHUB_APP_PRIVATE_KEY);

  if (appId && installationId && privateKey) {
    return createInstallationToken(
      {
        appId,
        privateKey,
        userAgent,
      },
      installationId
    );
  }

  throw new Error(
    "missing GitHub credentials: set GITHUB_LEDS/GITHUB_PAT/GITHUB_TOKEN or GitHub App secrets"
  );
}

export async function loadSprintRolloverConfig(
  source: ConfigSource
): Promise<SprintRolloverConfig> {
  const userAgent = "project43-sprint-rollover";

  return {
    accessToken: await getAccessToken(source, userAgent),
    project: createProjectConfig(source),
    userAgent,
    iterationFieldNames: createIterationFieldNames(source),
    dryRun: getBooleanValue(
      source,
      "SPRINT_ROLLOVER_DRY_RUN",
      DEFAULT_DRY_RUN
    ),
    today: getToday(source),
  };
}
