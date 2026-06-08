import assert from "node:assert/strict";
import test from "node:test";

import { GitFlowGateway } from "../src/github/git-flow-gateway.js";
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
