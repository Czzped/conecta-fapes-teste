import assert from "node:assert/strict";
import test from "node:test";

import { createGitFlowConfig } from "../src/config/git-flow-config.js";
import { validatePullRequest } from "../src/domain/pr-validation.js";

const config = createGitFlowConfig();

test("rejects production PR that does not come from release/ or hotfix/", () => {
  const result = validatePullRequest(config, {
    baseBranch: "main",
    headBranch: "feature/cadastro",
  });

  assert.equal(result.valid, false);
  assert.equal(result.reason, "production_pr_must_come_from_release_or_hotfix");
});

test("accepts production PR from release/ and hotfix/ (incl. master repos)", () => {
  const release = validatePullRequest(config, {
    baseBranch: "main",
    headBranch: "release/v1.2",
  });
  const hotfixToMaster = validatePullRequest(config, {
    baseBranch: "master",
    headBranch: "hotfix/v1.2.1",
  });

  assert.equal(release.valid, true);
  assert.equal(release.reason, "ok_production_release_or_hotfix");
  assert.equal(hotfixToMaster.valid, true);
});

test("rejects develop PR coming from a protected branch", () => {
  const result = validatePullRequest(config, {
    baseBranch: "develop",
    headBranch: "main",
  });

  assert.equal(result.valid, false);
  assert.equal(result.reason, "develop_pr_from_protected_branch");
});

test("rejects develop PR from an unknown branch prefix", () => {
  const result = validatePullRequest(config, {
    baseBranch: "develop",
    headBranch: "random-branch",
  });

  assert.equal(result.valid, false);
  assert.equal(result.reason, "develop_pr_from_unknown_branch");
});

test("accepts develop PR from an allowed work branch", () => {
  const result = validatePullRequest(config, {
    baseBranch: "develop",
    headBranch: "feature/nova-tela",
  });

  assert.equal(result.valid, true);
  assert.equal(result.reason, "ok_develop_work_branch");
});

test("treats unrelated targets as neutral", () => {
  const result = validatePullRequest(config, {
    baseBranch: "feature/base",
    headBranch: "feature/topic",
  });

  assert.equal(result.valid, true);
  assert.equal(result.reason, "no_rule");
});
