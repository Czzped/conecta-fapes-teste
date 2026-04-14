import { createProjectConfig, type ProjectConfig } from "./project-config.js";

const TOKEN_ENV_KEYS = ["GITHUB_LEDS", "GITHUB_PAT", "GITHUB_TOKEN"] as const;

export interface SyncConfig {
  accessToken: string;
  project: ProjectConfig;
  userAgent: string;
}

type ConfigSource = Record<string, string | undefined>;

function getAccessToken(source: ConfigSource): string {
  for (const key of TOKEN_ENV_KEYS) {
    const value = source[key]?.trim();

    if (value) {
      return value;
    }
  }

  throw new Error(
    "missing GitHub token in GITHUB_LEDS, GITHUB_PAT or GITHUB_TOKEN"
  );
}

export function loadSyncConfig(source: ConfigSource): SyncConfig {
  return {
    accessToken: getAccessToken(source),
    project: createProjectConfig(source),
    userAgent: "project43-field-sync",
  };
}
