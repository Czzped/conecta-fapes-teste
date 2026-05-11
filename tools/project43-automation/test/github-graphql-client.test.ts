import assert from "node:assert/strict";
import test from "node:test";

import { GitHubGraphqlClient } from "../src/github/github-graphql-client.js";

const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("retries transient GitHub GraphQL gateway failures", async () => {
  let calls = 0;

  globalThis.fetch = (() => {
    calls += 1;

    if (calls === 1) {
      return Promise.resolve(
        new Response(JSON.stringify({ message: "timeout" }), { status: 504 })
      );
    }

    return Promise.resolve(
      new Response(JSON.stringify({ data: { ok: true } }), { status: 200 })
    );
  }) as typeof fetch;

  const client = new GitHubGraphqlClient("token", "test", {
    maxRetries: 1,
    retryDelayMs: 0,
  });

  const result = await client.request<{ ok: boolean }>("query Test { ok }");

  assert.deepEqual(result, { ok: true });
  assert.equal(calls, 2);
});
