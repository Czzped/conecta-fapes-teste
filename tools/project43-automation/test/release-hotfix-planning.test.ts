import assert from "node:assert/strict";
import test from "node:test";

import { createGitFlowConfig } from "../src/config/git-flow-config.js";
import { planHotfix } from "../src/domain/hotfix-planning.js";
import { planRelease } from "../src/domain/release-planning.js";

const config = createGitFlowConfig();

test("rejects release with an invalid version", () => {
  const plan = planRelease(config, {
    version: "1.2",
    affectedRepositories: ["leds-conectafapes-backend-admin"],
  });

  assert.equal(plan.valid, false);
  assert.equal(plan.reason, "invalid_version");
  assert.deepEqual(plan.actions, []);
});

test("plans release for a master-based repo and reports unresolved repos", () => {
  const plan = planRelease(config, {
    version: "v1.2",
    affectedRepositories: ["leds-conectafapes-prestacao-de-contas", "ghost-repo"],
  });

  assert.equal(plan.valid, true);
  assert.deepEqual(plan.unresolved, ["ghost-repo"]);
  assert.equal(plan.repositories.length, 1);

  const repoPlan = plan.repositories[0];
  assert.equal(repoPlan.productionBranch, "master");
  assert.equal(repoPlan.releaseBranch, "release/v1.2");
  assert.deepEqual(repoPlan.actions, [
    {
      type: "create_branch",
      repo: "leds-conectafapes-prestacao-de-contas",
      branch: "release/v1.2",
      baseBranch: "develop",
    },
    {
      type: "open_pull_request",
      repo: "leds-conectafapes-prestacao-de-contas",
      head: "release/v1.2",
      base: "master",
      title: "Release v1.2",
      body: "Release automatica v1.2 de `develop` para `master`.",
    },
    {
      type: "create_tag",
      repo: "leds-conectafapes-prestacao-de-contas",
      tag: "v1.2",
      ref: "master",
    },
  ]);
});

test("fails release when no affected repository is recognized", () => {
  const plan = planRelease(config, {
    version: "v1.2",
    affectedRepositories: ["ghost-repo"],
  });

  assert.equal(plan.valid, false);
  assert.equal(plan.reason, "no_affected_repositories");
  assert.deepEqual(plan.unresolved, ["ghost-repo"]);
});

test("blocks hotfix without approval", () => {
  const plan = planHotfix(config, {
    version: "v1.2.1",
    repositoryName: "leds-conectafapes-backend-admin",
    approved: false,
  });

  assert.equal(plan.valid, false);
  assert.equal(plan.reason, "not_approved");
});

test("flags hotfix with an unknown repository", () => {
  const plan = planHotfix(config, {
    version: "v1.2.1",
    repositoryName: "ghost-repo",
    approved: true,
  });

  assert.equal(plan.valid, false);
  assert.equal(plan.reason, "repository_unclear");
});

test("plans hotfix tag and return PR to develop", () => {
  const plan = planHotfix(config, {
    version: "v1.2.1",
    repositoryName: "leds-conectafapes-backend-admin",
    approved: true,
  });

  assert.equal(plan.valid, true);
  assert.equal(plan.hotfixBranch, "hotfix/v1.2.1");
  assert.deepEqual(plan.actions, [
    {
      type: "create_tag",
      repo: "leds-conectafapes-backend-admin",
      tag: "v1.2.1",
      ref: "main",
    },
    {
      type: "open_pull_request",
      repo: "leds-conectafapes-backend-admin",
      head: "hotfix/v1.2.1",
      base: "develop",
      title: "Hotfix v1.2.1 -> develop",
      body: "Retorno do hotfix v1.2.1 para `develop`.",
    },
  ]);
});

test("adds a return PR to the open release branch when present", () => {
  const plan = planHotfix(config, {
    version: "v1.2.1",
    repositoryName: "leds-conectafapes-backend-admin",
    approved: true,
    openReleaseBranch: "release/v1.3",
  });

  assert.equal(plan.valid, true);
  assert.equal(plan.actions.length, 3);

  const releasePr = plan.actions[2];
  assert.deepEqual(releasePr, {
    type: "open_pull_request",
    repo: "leds-conectafapes-backend-admin",
    head: "hotfix/v1.2.1",
    base: "release/v1.3",
    title: "Hotfix v1.2.1 -> release/v1.3",
    body: "Retorno do hotfix v1.2.1 para a release aberta `release/v1.3`.",
  });
});
