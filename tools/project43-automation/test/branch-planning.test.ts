import assert from "node:assert/strict";
import test from "node:test";

import { createGitFlowConfig } from "../src/config/git-flow-config.js";
import { planBranchCreation } from "../src/domain/branch-planning.js";

const config = createGitFlowConfig();

test("uses In Progress as the automatic branch trigger status", () => {
  assert.equal(config.readyForDevStatusName, "In Progress");
});

test("ignores items that are not in the branch trigger status", () => {
  const plan = planBranchCreation(config, {
    statusName: "Pronto para desenvolvimento",
    repositoryName: "leds-conectafapes-backend-admin",
  });

  assert.deepEqual(plan, { decision: "ignored", reason: "status_not_ready" });
});

test("flags needs_review when the repository is missing or unknown", () => {
  const missing = planBranchCreation(config, {
    statusName: config.readyForDevStatusName,
    repositoryName: null,
  });
  const unknown = planBranchCreation(config, {
    statusName: config.readyForDevStatusName,
    repositoryName: "some-other-repo",
  });

  assert.deepEqual(missing, { decision: "needs_review", reason: "repository_unclear" });
  assert.deepEqual(unknown, { decision: "needs_review", reason: "repository_unclear" });
});

test("creates branch from develop and accepts org/repo form", () => {
  const plan = planBranchCreation(config, {
    statusName: config.readyForDevStatusName,
    repositoryName: "leds-conectafapes/leds-conectafapes-backend-admin",
    issueId: "ISSUE_node_id",
    issueNumber: 42,
    title: "Cadastro de Diárias",
  });

  assert.equal(plan.decision, "create_branch");

  if (plan.decision !== "create_branch") {
    return;
  }

  assert.equal(plan.repo.name, "leds-conectafapes-backend-admin");
  assert.deepEqual(plan.action, {
    type: "create_branch",
    repo: "leds-conectafapes-backend-admin",
    branch: "feature/42-cadastro-de-diarias",
    baseBranch: "develop",
    issueId: "ISSUE_node_id",
  });
});

test("slugifies titles and falls back to a default suffix", () => {
  const withoutMeta = planBranchCreation(config, {
    statusName: config.readyForDevStatusName,
    repositoryName: "leds-conectafapes-frontoffice-frontend",
  });

  assert.equal(withoutMeta.decision, "create_branch");

  if (withoutMeta.decision !== "create_branch") {
    return;
  }

  assert.equal(withoutMeta.action.branch, "feature/work");
});
