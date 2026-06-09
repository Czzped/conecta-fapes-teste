import assert from "node:assert/strict";
import test from "node:test";

import { resolveGitFlowRepositoryToken } from "../src/github/git-flow-token.js";

test("uses the Git Flow repository token before falling back to the GitHub App token", () => {
  assert.equal(
    resolveGitFlowRepositoryToken(
      {
        GITHUB_GIT_FLOW_TOKEN: "repo-token",
        GITHUB_STATUS_TOKEN: "status-token",
      },
      "app-token"
    ),
    "repo-token"
  );
});

test("keeps backward compatibility with the existing status token secret", () => {
  assert.equal(
    resolveGitFlowRepositoryToken({ GITHUB_STATUS_TOKEN: "status-token" }, "app-token"),
    "status-token"
  );
});

test("falls back to the GitHub App installation token when no repo token exists", () => {
  assert.equal(resolveGitFlowRepositoryToken({}, "app-token"), "app-token");
});
