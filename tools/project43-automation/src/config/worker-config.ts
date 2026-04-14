import { createProjectConfig, type ProjectConfig } from "./project-config.js";

export type WorkerEnvironment = Record<string, string | undefined>;

export interface WorkerSecrets {
  appId: string;
  appPrivateKey: string;
  webhookSecret: string;
  installationId?: string;
}

export interface WorkerConfig {
  project: ProjectConfig;
  secrets: WorkerSecrets;
  userAgent: string;
}

function getRequiredValue(source: WorkerEnvironment, key: string): string {
  const value = source[key]?.trim();

  if (!value) {
    throw new Error(`missing env: ${key}`);
  }

  return value;
}

export function loadWorkerConfig(source: WorkerEnvironment): WorkerConfig {
  const installationId = source.GITHUB_APP_INSTALLATION_ID?.trim();

  return {
    project: createProjectConfig(source, { requireProjectId: true }),
    secrets: {
      appId: getRequiredValue(source, "GITHUB_APP_ID"),
      appPrivateKey: getRequiredValue(source, "GITHUB_APP_PRIVATE_KEY"),
      webhookSecret: getRequiredValue(source, "GITHUB_WEBHOOK_SECRET"),
      installationId: installationId || undefined,
    },
    userAgent: "project43-status-dates",
  };
}
