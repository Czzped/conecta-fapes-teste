import assert from "node:assert/strict";
import test from "node:test";

import { createGitFlowConfig } from "../src/config/git-flow-config.js";
import { planProductionMerge } from "../src/domain/production-merge-planning.js";

const config = createGitFlowConfig();

test("plans tag creation when a release PR is merged into production", () => {
  const plan = planProductionMerge(config, {
    repositoryName: "leds-conectafapes-backend-admin",
    baseBranch: "main",
    headBranch: "release/v1.6.0",
    mergeCommitSha: "abc123",
    openReleaseBranches: [],
  });

  assert.equal(plan.valid, true);
  assert.equal(plan.tag, "v1.6.0");
  assert.deepEqual(plan.actions, [
    {
      type: "create_tag",
      repo: "leds-conectafapes-backend-admin",
      tag: "v1.6.0",
      ref: "main",
      targetSha: "abc123",
    },
    {
      type: "open_pull_request",
      repo: "leds-conectafapes-backend-admin",
      head: "main",
      base: "homol",
      title: "Back-merge main -> homol (v1.6.0)",
      body: "Back-merge automatico de `main` para `homol` apos release v1.6.0.",
    },
    {
      type: "open_pull_request",
      repo: "leds-conectafapes-backend-admin",
      head: "main",
      base: "develop",
      title: "Back-merge main -> develop (v1.6.0)",
      body: "Back-merge automatico de `main` para `develop` apos release v1.6.0.",
    },
  ]);
});

test("plans tag and return PRs when a hotfix PR is merged into production", () => {
  const plan = planProductionMerge(config, {
    repositoryName: "leds-conectafapes-backend-admin",
    baseBranch: "main",
    headBranch: "hotfix/v1.6.1-2090",
    mergeCommitSha: "def456",
    openReleaseBranches: ["release/v1.7.0"],
  });

  assert.equal(plan.valid, true);
  assert.equal(plan.tag, "v1.6.1");
  assert.deepEqual(plan.actions, [
    {
      type: "create_tag",
      repo: "leds-conectafapes-backend-admin",
      tag: "v1.6.1",
      ref: "main",
      targetSha: "def456",
    },
    {
      type: "open_pull_request",
      repo: "leds-conectafapes-backend-admin",
      head: "hotfix/v1.6.1-2090",
      base: "homol",
      title: "Hotfix v1.6.1 -> homol",
      body: "Retorno automatico do hotfix v1.6.1 para `homol`.",
    },
    {
      type: "open_pull_request",
      repo: "leds-conectafapes-backend-admin",
      head: "hotfix/v1.6.1-2090",
      base: "develop",
      title: "Hotfix v1.6.1 -> develop",
      body: "Retorno automatico do hotfix v1.6.1 para `develop`.",
    },
    {
      type: "open_pull_request",
      repo: "leds-conectafapes-backend-admin",
      head: "hotfix/v1.6.1-2090",
      base: "release/v1.7.0",
      title: "Hotfix v1.6.1 -> release/v1.7.0",
      body: "Retorno automatico do hotfix v1.6.1 para a release aberta `release/v1.7.0`.",
    },
  ]);
});

test("skips the homologation PR for repos without a homologation branch", () => {
  // `conectafapes-project` hospeda docs e automacoes: nao tem branch `homol`,
  // e abrir PR para uma branch inexistente falharia com 404.
  const plan = planProductionMerge(config, {
    repositoryName: "conectafapes-project",
    baseBranch: "main",
    headBranch: "release/v1.6.0",
    mergeCommitSha: "abc123",
    openReleaseBranches: [],
  });

  assert.equal(plan.valid, true);
  assert.deepEqual(
    plan.actions.map((action) => ("base" in action ? action.base : action.type)),
    ["create_tag", "develop"]
  );
});

test("ignores merged PRs that are not release/hotfix into production", () => {
  const plan = planProductionMerge(config, {
    repositoryName: "leds-conectafapes-backend-admin",
    baseBranch: "main",
    headBranch: "feat/123-login",
    mergeCommitSha: "abc123",
    openReleaseBranches: [],
  });

  assert.equal(plan.valid, false);
  assert.equal(plan.reason, "not_release_or_hotfix");
  assert.deepEqual(plan.actions, []);
});
