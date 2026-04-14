import { loadSyncConfig } from "../src/config/sync-config.js";
import { GitHubGraphqlClient } from "../src/github/github-graphql-client.js";
import { GitHubProjectRepository } from "../src/github/project-repository.js";
import { createManagedProjectFields } from "../src/project/field-definitions.js";
import { syncProjectFields } from "../src/project/project-field-sync.js";

const config = loadSyncConfig(process.env);
const repository = new GitHubProjectRepository(
  new GitHubGraphqlClient(config.accessToken, config.userAgent)
);

const summary = await syncProjectFields(
  repository,
  config.project.projectId,
  createManagedProjectFields(config.project.fieldNames)
);

console.log(JSON.stringify(summary, null, 2));
