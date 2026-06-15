import assert from "node:assert/strict";
import test from "node:test";

import { GitFlowGateway } from "../src/github/git-flow-gateway.js";
import { GitHubGraphqlClient } from "../src/github/github-graphql-client.js";
import { GitHubRestClient } from "../src/github/github-rest-client.js";

const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

interface Call {
  method: string;
  url: string;
  body: unknown;
}

type Handler = (call: Call) => Response;

function installFetch(handler: Handler): Call[] {
  const calls: Call[] = [];

  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const call: Call = {
      method: init?.method ?? "GET",
      url: String(input),
      body: init?.body ? JSON.parse(init.body as string) : undefined,
    };
    calls.push(call);
    return Promise.resolve(handler(call));
  }) as typeof fetch;

  return calls;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status });
}

function buildGateway(): GitFlowGateway {
  return new GitFlowGateway(new GitHubRestClient("token", "test", { retryDelayMs: 0 }), "leds-conectafapes");
}

function buildLinkedBranchGateway(): GitFlowGateway {
  return new GitFlowGateway(
    new GitHubRestClient("token", "test", { retryDelayMs: 0 }),
    "leds-conectafapes",
    new GitHubGraphqlClient("token", "test", { maxRetries: 0, retryDelayMs: 0 })
  );
}

test("createBranch reads base sha and posts a new ref", async () => {
  const calls = installFetch((call) => {
    if (call.method === "GET" && call.url.includes("/git/ref/heads/release/v1.2")) {
      return json({ message: "Not Found" }, 404);
    }
    if (call.method === "GET" && call.url.includes("/git/ref/heads/develop")) {
      return json({ object: { sha: "base-sha" } });
    }
    if (call.method === "POST" && call.url.endsWith("/git/refs")) {
      return json({ ref: "refs/heads/release/v1.2" }, 201);
    }
    throw new Error(`unexpected call ${call.method} ${call.url}`);
  });

  const result = await buildGateway().createBranch({
    type: "create_branch",
    repo: "leds-conectafapes-backend-admin",
    branch: "release/v1.2",
    baseBranch: "develop",
  });

  assert.equal(result.status, "created");
  const post = calls.find((call) => call.method === "POST");
  assert.deepEqual(post?.body, { ref: "refs/heads/release/v1.2", sha: "base-sha" });
});

test("createBranch uses createLinkedBranch when an issue id is available", async () => {
  const calls = installFetch((call) => {
    if (call.method === "GET" && call.url.includes("/git/ref/heads/feature/42-cadastro")) {
      return json({ message: "Not Found" }, 404);
    }
    if (call.method === "GET" && call.url.includes("/git/ref/heads/develop")) {
      return json({ object: { sha: "base-sha" } });
    }
    if (call.method === "GET" && call.url.endsWith("/repos/leds-conectafapes/leds-conectafapes-backend-admin")) {
      return json({ node_id: "REPO_node_id" });
    }
    if (call.method === "POST" && call.url.endsWith("/graphql")) {
      return json({
        data: {
          createLinkedBranch: {
            linkedBranch: {
              id: "LINKED_BRANCH_node_id",
              ref: { name: "feature/42-cadastro" },
            },
          },
        },
      });
    }
    throw new Error(`unexpected call ${call.method} ${call.url}`);
  });

  const result = await buildLinkedBranchGateway().createBranch({
    type: "create_branch",
    repo: "leds-conectafapes-backend-admin",
    branch: "feature/42-cadastro",
    baseBranch: "develop",
    issueId: "ISSUE_node_id",
  });

  assert.equal(result.status, "created");
  assert.equal(result.detail, "feature/42-cadastro");
  assert.equal(calls.some((call) => call.method === "POST" && call.url.endsWith("/git/refs")), false);
  const graphqlPost = calls.find((call) => call.method === "POST" && call.url.endsWith("/graphql"));
  assert.match(String((graphqlPost?.body as { query?: string } | undefined)?.query), /createLinkedBranch/);
  assert.deepEqual((graphqlPost?.body as { variables?: unknown } | undefined)?.variables, {
    issueId: "ISSUE_node_id",
    repositoryId: "REPO_node_id",
    oid: "base-sha",
    name: "feature/42-cadastro",
  });
});

test("createBranch keeps the REST ref fallback when there is no issue id", async () => {
  const calls = installFetch((call) => {
    if (call.method === "GET" && call.url.includes("/git/ref/heads/feature/no-issue")) {
      return json({ message: "Not Found" }, 404);
    }
    if (call.method === "GET" && call.url.includes("/git/ref/heads/develop")) {
      return json({ object: { sha: "base-sha" } });
    }
    if (call.method === "POST" && call.url.endsWith("/git/refs")) {
      return json({ ref: "refs/heads/feature/no-issue" }, 201);
    }
    throw new Error(`unexpected call ${call.method} ${call.url}`);
  });

  const result = await buildLinkedBranchGateway().createBranch({
    type: "create_branch",
    repo: "leds-conectafapes-backend-admin",
    branch: "feature/no-issue",
    baseBranch: "develop",
    issueId: null,
  });

  assert.equal(result.status, "created");
  assert.equal(calls.some((call) => call.method === "POST" && call.url.endsWith("/graphql")), false);
  assert.equal(calls.some((call) => call.method === "POST" && call.url.endsWith("/git/refs")), true);
});

test("createBranch treats duplicate linked-branch errors as idempotent", async () => {
  installFetch((call) => {
    if (call.method === "GET" && call.url.includes("/git/ref/heads/feature/42-cadastro")) {
      return json({ message: "Not Found" }, 404);
    }
    if (call.method === "GET" && call.url.includes("/git/ref/heads/develop")) {
      return json({ object: { sha: "base-sha" } });
    }
    if (call.method === "GET" && call.url.endsWith("/repos/leds-conectafapes/leds-conectafapes-backend-admin")) {
      return json({ node_id: "REPO_node_id" });
    }
    if (call.method === "POST" && call.url.endsWith("/graphql")) {
      return json({ errors: [{ message: "Name already exists" }] });
    }
    throw new Error(`unexpected call ${call.method} ${call.url}`);
  });

  const result = await buildLinkedBranchGateway().createBranch({
    type: "create_branch",
    repo: "leds-conectafapes-backend-admin",
    branch: "feature/42-cadastro",
    baseBranch: "develop",
    issueId: "ISSUE_node_id",
  });

  assert.equal(result.status, "already_exists");
  assert.match(result.detail ?? "", /Name already exists/);
});

test("createBranch is idempotent when the branch already exists", async () => {
  const calls = installFetch((call) => {
    if (call.method === "GET" && call.url.includes("/git/ref/heads/release/v1.2")) {
      return json({ object: { sha: "existing" } });
    }
    throw new Error(`unexpected call ${call.method} ${call.url}`);
  });

  const result = await buildGateway().createBranch({
    type: "create_branch",
    repo: "leds-conectafapes-backend-admin",
    branch: "release/v1.2",
    baseBranch: "develop",
  });

  assert.equal(result.status, "already_exists");
  assert.equal(calls.filter((call) => call.method === "POST").length, 0);
});

test("createBranch returns a failed result instead of throwing when refs are not readable", async () => {
  installFetch((call) => {
    if (call.method === "GET" && call.url.includes("/git/ref/heads/release/v1.2")) {
      return json({ message: "Resource not accessible by integration" }, 403);
    }
    throw new Error(`unexpected call ${call.method} ${call.url}`);
  });

  const result = await buildGateway().createBranch({
    type: "create_branch",
    repo: "leds-conectafapes-backend-admin",
    branch: "release/v1.2",
    baseBranch: "develop",
  });

  assert.equal(result.status, "failed");
  assert.match(result.detail ?? "", /Resource not accessible by integration/);
});

test("openPullRequest creates a PR when none is open", async () => {
  installFetch((call) => {
    if (call.method === "GET" && call.url.includes("/pulls?")) {
      return json([]);
    }
    if (call.method === "POST" && call.url.endsWith("/pulls")) {
      return json({ number: 7, html_url: "https://github.com/x/y/pull/7" }, 201);
    }
    throw new Error(`unexpected call ${call.method} ${call.url}`);
  });

  const result = await buildGateway().openPullRequest({
    type: "open_pull_request",
    repo: "leds-conectafapes-backend-admin",
    head: "release/v1.2",
    base: "main",
    title: "Release v1.2",
  });

  assert.equal(result.status, "created");
  assert.equal(result.detail, "https://github.com/x/y/pull/7");
});

test("openPullRequest is idempotent when a PR is already open", async () => {
  const calls = installFetch((call) => {
    if (call.method === "GET" && call.url.includes("/pulls?")) {
      return json([{ number: 3, html_url: "https://github.com/x/y/pull/3" }]);
    }
    throw new Error(`unexpected call ${call.method} ${call.url}`);
  });

  const result = await buildGateway().openPullRequest({
    type: "open_pull_request",
    repo: "leds-conectafapes-backend-admin",
    head: "release/v1.2",
    base: "main",
    title: "Release v1.2",
  });

  assert.equal(result.status, "already_exists");
  assert.equal(result.detail, "https://github.com/x/y/pull/3");
  assert.equal(calls.filter((call) => call.method === "POST").length, 0);
});

test("createTag is idempotent when the tag already exists", async () => {
  const calls = installFetch((call) => {
    if (call.method === "GET" && call.url.includes("/git/ref/tags/v1.2")) {
      return json({ object: { sha: "tag-sha" } });
    }
    throw new Error(`unexpected call ${call.method} ${call.url}`);
  });

  const result = await buildGateway().createTag({
    type: "create_tag",
    repo: "leds-conectafapes-backend-admin",
    tag: "v1.2",
    ref: "main",
  });

  assert.equal(result.status, "already_exists");
  assert.equal(calls.filter((call) => call.method === "POST").length, 0);
});

test("createTag points the tag at the production branch sha", async () => {
  const calls = installFetch((call) => {
    if (call.method === "GET" && call.url.includes("/git/ref/tags/v1.2")) {
      return json({ message: "Not Found" }, 404);
    }
    if (call.method === "GET" && call.url.includes("/git/ref/heads/main")) {
      return json({ object: { sha: "main-sha" } });
    }
    if (call.method === "POST" && call.url.endsWith("/git/refs")) {
      return json({ ref: "refs/tags/v1.2" }, 201);
    }
    throw new Error(`unexpected call ${call.method} ${call.url}`);
  });

  const result = await buildGateway().createTag({
    type: "create_tag",
    repo: "leds-conectafapes-backend-admin",
    tag: "v1.2",
    ref: "main",
  });

  assert.equal(result.status, "created");
  const post = calls.find((call) => call.method === "POST");
  assert.deepEqual(post?.body, { ref: "refs/tags/v1.2", sha: "main-sha" });
});

test("executePlan returns planned results in dry-run without calling fetch", async () => {
  installFetch(() => {
    throw new Error("dry-run must not call fetch");
  });

  const results = await buildGateway().executePlan(
    [
      {
        type: "create_branch",
        repo: "leds-conectafapes-backend-admin",
        branch: "release/v1.2",
        baseBranch: "develop",
      },
    ],
    { dryRun: true }
  );

  assert.deepEqual(results, [
    {
      action: {
        type: "create_branch",
        repo: "leds-conectafapes-backend-admin",
        branch: "release/v1.2",
        baseBranch: "develop",
      },
      status: "planned",
    },
  ]);
});
