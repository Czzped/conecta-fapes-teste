import assert from "node:assert/strict";
import test from "node:test";

import {
  extractCardNumber,
  planCardMovement,
} from "../src/domain/pr-card-movement.js";

const WORK_PREFIXES = [
  "feature/",
  "feat/",
  "fix/",
  "bugfix/",
  "chore/",
  "docs/",
  "refactor/",
  "test/",
];

// ── extractCardNumber ──────────────────────────────────────────

test("extracts card number from standard feature branch", () => {
  assert.equal(extractCardNumber("feature/2230-cliente-soap"), 2230);
});

test("extracts card number from fix branch", () => {
  assert.equal(extractCardNumber("fix/42-corrige-bug"), 42);
});

test("extracts card number from feat branch without slug", () => {
  assert.equal(extractCardNumber("feat/5"), 5);
});

test("extracts card number from hotfix branch", () => {
  assert.equal(extractCardNumber("hotfix/v1.2.1-2090"), 2090);
});

test("returns null for release branch", () => {
  assert.equal(extractCardNumber("release/v1.2"), null);
});

test("returns null for branch without number prefix", () => {
  assert.equal(extractCardNumber("feature/login-fix"), null);
});

test("returns null for develop branch", () => {
  assert.equal(extractCardNumber("develop"), null);
});

test("returns null for main branch", () => {
  assert.equal(extractCardNumber("main"), null);
});

test("ignores leading number 0", () => {
  assert.equal(extractCardNumber("feature/0-test"), null);
});

// ── planCardMovement ───────────────────────────────────────────

test("plans move_to_validation when work branch PR is opened", () => {
  const plan = planCardMovement({
    prAction: "opened",
    merged: false,
    headBranch: "feature/2230-cliente-soap",
    workBranchPrefixes: WORK_PREFIXES,
  });

  assert.deepEqual(plan, {
    decision: "move_to_validation",
    cardNumber: 2230,
    reason: "pr_opened",
  });
});

test("plans move_to_validation on reopened PR", () => {
  const plan = planCardMovement({
    prAction: "reopened",
    merged: false,
    headBranch: "fix/42-corrige",
    workBranchPrefixes: WORK_PREFIXES,
  });

  assert.equal(plan.decision, "move_to_validation");
  assert.equal(plan.cardNumber, 42);
});

test("plans move_to_validation on ready_for_review PR", () => {
  const plan = planCardMovement({
    prAction: "ready_for_review",
    merged: false,
    headBranch: "feat/100-nova-tela",
    workBranchPrefixes: WORK_PREFIXES,
  });

  assert.equal(plan.decision, "move_to_validation");
  assert.equal(plan.cardNumber, 100);
});

test("plans move_to_homologation when work branch PR is merged", () => {
  const plan = planCardMovement({
    prAction: "closed",
    merged: true,
    headBranch: "feature/2230-cliente-soap",
    workBranchPrefixes: WORK_PREFIXES,
  });

  assert.deepEqual(plan, {
    decision: "move_to_homologation",
    cardNumber: 2230,
    reason: "pr_merged",
  });
});

test("plans move_to_homologation when hotfix PR is merged", () => {
  const plan = planCardMovement({
    prAction: "closed",
    merged: true,
    headBranch: "hotfix/v1.2.1-2090",
    workBranchPrefixes: WORK_PREFIXES,
  });

  assert.deepEqual(plan, {
    decision: "move_to_homologation",
    cardNumber: 2090,
    reason: "pr_merged",
  });
});

test("ignores PR opened for non-work branch", () => {
  const plan = planCardMovement({
    prAction: "opened",
    merged: false,
    headBranch: "release/v1.2",
    workBranchPrefixes: WORK_PREFIXES,
  });

  assert.deepEqual(plan, {
    decision: "ignored",
    cardNumber: null,
    reason: "not_applicable",
  });
});

test("ignores PR closed without merge", () => {
  const plan = planCardMovement({
    prAction: "closed",
    merged: false,
    headBranch: "feature/2230-cliente-soap",
    workBranchPrefixes: WORK_PREFIXES,
  });

  assert.deepEqual(plan, {
    decision: "ignored",
    cardNumber: null,
    reason: "not_applicable",
  });
});

test("ignores work branch without extractable card number", () => {
  const plan = planCardMovement({
    prAction: "opened",
    merged: false,
    headBranch: "feature/login-fix",
    workBranchPrefixes: WORK_PREFIXES,
  });

  assert.deepEqual(plan, {
    decision: "ignored",
    cardNumber: null,
    reason: "card_number_not_found_in_branch",
  });
});

test("ignores synchronize action (push to existing PR)", () => {
  const plan = planCardMovement({
    prAction: "synchronize",
    merged: false,
    headBranch: "feature/2230-cliente-soap",
    workBranchPrefixes: WORK_PREFIXES,
  });

  assert.equal(plan.decision, "ignored");
});
