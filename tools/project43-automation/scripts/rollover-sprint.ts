import { runSprintRollover } from "../src/app/sprint-rollover-runner.js";
import { loadSprintRolloverConfig } from "../src/config/sprint-rollover-config.js";
import { GitHubGraphqlClient } from "../src/github/github-graphql-client.js";
import { GitHubProjectRepository } from "../src/github/project-repository.js";

const config = await loadSprintRolloverConfig(process.env);
const repository = new GitHubProjectRepository(
  new GitHubGraphqlClient(config.accessToken, config.userAgent)
);

const summary = await runSprintRollover(repository, config);

console.log(JSON.stringify(summary, null, 2));
