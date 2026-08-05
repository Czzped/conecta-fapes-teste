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

test("accepts homologation PR from release/ and hotfix/", () => {
  const release = validatePullRequest(config, {
    baseBranch: "homol",
    headBranch: "release/v1.2.0",
  });
  const hotfix = validatePullRequest(config, {
    baseBranch: "homol",
    headBranch: "hotfix/v1.2.1",
  });

  assert.equal(release.valid, true);
  assert.equal(release.reason, "ok_homologation_release_or_hotfix");
  assert.equal(hotfix.valid, true);
  assert.equal(hotfix.reason, "ok_homologation_release_or_hotfix");
});

test("accepts homologation PR from production (back-merge after hotfix)", () => {
  const mainToHomol = validatePullRequest(config, {
    baseBranch: "homol",
    headBranch: "main",
  });
  const masterToHomol = validatePullRequest(config, {
    baseBranch: "homol",
    headBranch: "master",
  });

  assert.equal(mainToHomol.valid, true);
  assert.equal(mainToHomol.reason, "ok_homologation_backmerge");
  assert.equal(masterToHomol.valid, true);
  assert.equal(masterToHomol.reason, "ok_homologation_backmerge");
});

test("rejects homologation PR from a work branch or from develop", () => {
  const fromWork = validatePullRequest(config, {
    baseBranch: "homol",
    headBranch: "feature/cadastro",
  });
  const fromDevelop = validatePullRequest(config, {
    baseBranch: "homol",
    headBranch: "develop",
  });

  assert.equal(fromWork.valid, false);
  assert.equal(fromWork.reason, "homologation_pr_must_come_from_release_or_hotfix");
  assert.equal(fromDevelop.valid, false);
  assert.equal(fromDevelop.reason, "homologation_pr_must_come_from_release_or_hotfix");
});

test("accepts develop PR from homologation (back-merge)", () => {
  const result = validatePullRequest(config, {
    baseBranch: "develop",
    headBranch: "homol",
  });

  assert.equal(result.valid, true);
  assert.equal(result.reason, "ok_develop_backmerge");
});

test("still rejects production PR coming straight from homologation", () => {
  // A `main` recebe apenas `release/*` e `hotfix/*`: a branch de release e o
  // veiculo ate producao, e e dela que sai a versao/tag.
  const result = validatePullRequest(config, {
    baseBranch: "main",
    headBranch: "homol",
  });

  assert.equal(result.valid, false);
  assert.equal(result.reason, "production_pr_must_come_from_release_or_hotfix");
});

test("rejects develop PR coming from develop itself", () => {
  const result = validatePullRequest(config, {
    baseBranch: "develop",
    headBranch: "develop",
  });

  assert.equal(result.valid, false);
  assert.equal(result.reason, "develop_pr_from_protected_branch");
});

test("accepts develop PR from production branch (back-merge after release/hotfix)", () => {
  const mainToDevelop = validatePullRequest(config, {
    baseBranch: "develop",
    headBranch: "main",
  });
  const masterToDevelop = validatePullRequest(config, {
    baseBranch: "develop",
    headBranch: "master",
  });

  assert.equal(mainToDevelop.valid, true);
  assert.equal(mainToDevelop.reason, "ok_develop_backmerge");
  assert.equal(masterToDevelop.valid, true);
  assert.equal(masterToDevelop.reason, "ok_develop_backmerge");
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
