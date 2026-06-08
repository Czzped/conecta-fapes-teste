import assert from "node:assert/strict";
import test from "node:test";

import { GitFlowWorker } from "../src/app/git-flow-worker.js";
import type { GitFlowGateway } from "../src/github/git-flow-gateway.js";
import type { GitFlowAction } from "../src/domain/git-flow-actions.js";

const ADMIN_TOKEN = "s3cr3t-admin";

const worker = new GitFlowWorker({
  gatewayFactory: () => {
    throw new Error("gateway must not be built in dry-run tests");
  },
});

function post(path: string, body: unknown, headers: Record<string, string> = {}): Request {
  return new Request(`https://worker.example${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

interface RecordingGateway {
  worker: GitFlowWorker;
  executed: GitFlowAction[];
  built: number;
}

/** Worker com gateway falso que registra as acoes executadas (sem GitHub real). */
function recordingWorker(): RecordingGateway {
  const state: RecordingGateway = {
    worker: undefined as unknown as GitFlowWorker,
    executed: [],
    built: 0,
  };

  const fakeGateway = {
    executeAction(action: GitFlowAction) {
      state.executed.push(action);
      return Promise.resolve({ action, status: "created" as const });
    },
  } as unknown as GitFlowGateway;

  state.worker = new GitFlowWorker({
    gatewayFactory: () => {
      state.built += 1;
      return Promise.resolve(fakeGateway);
    },
  });

  return state;
}

test("validates a PR via JSON route and returns 422 when invalid", async () => {
  const response = await worker.fetch(
    post("/git-flow/pull-request", { baseBranch: "main", headBranch: "feature/x" }),
    {}
  );

  assert.equal(response.status, 422);
  const payload = (await response.json()) as { validation: { valid: boolean; reason: string } };
  assert.equal(payload.validation.valid, false);
  assert.equal(payload.validation.reason, "production_pr_must_come_from_release_or_hotfix");
});

test("branch route returns needs_review when repository is unclear", async () => {
  const response = await worker.fetch(
    post("/git-flow/branch", { statusName: "Pronto para desenvolvimento" }),
    {}
  );

  assert.equal(response.status, 202);
  const payload = (await response.json()) as { decision: string; reason: string };
  assert.deepEqual(payload, { decision: "needs_review", reason: "repository_unclear" });
});

test("release route returns a dry-run plan without executing", async () => {
  const response = await worker.fetch(
    post("/git-flow/release", {
      version: "v1.2",
      repositories: ["leds-conectafapes-backend-admin"],
    }),
    {}
  );

  assert.equal(response.status, 200);
  const payload = (await response.json()) as {
    valid: boolean;
    results: { status: string }[];
  };
  assert.equal(payload.valid, true);
  assert.ok(payload.results.length > 0);
  assert.ok(payload.results.every((result) => result.status === "planned"));
});

test("pull_request webhook returns the validation decision", async () => {
  const response = await worker.fetch(
    new Request("https://worker.example/", {
      method: "POST",
      headers: { "x-github-event": "pull_request" },
      body: JSON.stringify({
        action: "opened",
        pull_request: { base: { ref: "develop" }, head: { ref: "feature/login" } },
        repository: { name: "leds-conectafapes-backend-admin" },
      }),
    }),
    {}
  );

  assert.equal(response.status, 200);
  const payload = (await response.json()) as {
    validation: { valid: boolean; reason: string };
    repository: string;
  };
  assert.equal(payload.validation.valid, true);
  assert.equal(payload.validation.reason, "ok_develop_work_branch");
  assert.equal(payload.repository, "leds-conectafapes-backend-admin");
});

test("execute without admin token configured returns 403 and never builds gateway", async () => {
  const { worker: w, built } = recordingWorker();

  const response = await w.fetch(
    post("/git-flow/release", {
      version: "v1.2",
      repositories: ["leds-conectafapes-backend-admin"],
      execute: true,
    }),
    {} // GIT_FLOW_ADMIN_TOKEN not set
  );

  assert.equal(response.status, 403);
  const payload = (await response.json()) as { reason: string };
  assert.equal(payload.reason, "execution_not_configured");
  assert.equal(built, 0);
});

test("execute with wrong token returns 401 and never builds gateway", async () => {
  const state = recordingWorker();

  const response = await state.worker.fetch(
    post(
      "/git-flow/release",
      {
        version: "v1.2",
        repositories: ["leds-conectafapes-backend-admin"],
        execute: true,
      },
      { authorization: "Bearer wrong" }
    ),
    { GIT_FLOW_ADMIN_TOKEN: ADMIN_TOKEN }
  );

  assert.equal(response.status, 401);
  assert.equal(state.built, 0);
  assert.equal(state.executed.length, 0);
});

test("execute with valid token runs branch/PR but defers tags without createTags", async () => {
  const state = recordingWorker();

  const response = await state.worker.fetch(
    post(
      "/git-flow/release",
      {
        version: "v1.2",
        repositories: ["leds-conectafapes-backend-admin"],
        execute: true,
      },
      { "x-git-flow-token": ADMIN_TOKEN }
    ),
    { GIT_FLOW_ADMIN_TOKEN: ADMIN_TOKEN }
  );

  assert.equal(response.status, 200);
  assert.equal(state.built, 1);

  // create_branch + open_pull_request executed; create_tag NOT executed.
  assert.deepEqual(
    state.executed.map((action) => action.type),
    ["create_branch", "open_pull_request"]
  );

  const payload = (await response.json()) as {
    results: { action: { type: string }; status: string; detail?: string }[];
  };
  const tag = payload.results.find((result) => result.action.type === "create_tag");
  assert.equal(tag?.status, "blocked");
  assert.equal(tag?.detail, "tag_deferred_until_production_merge");
});

test("execute with createTags true also runs the tag action", async () => {
  const state = recordingWorker();

  const response = await state.worker.fetch(
    post(
      "/git-flow/release",
      {
        version: "v1.2",
        repositories: ["leds-conectafapes-backend-admin"],
        execute: true,
        createTags: true,
      },
      { authorization: `Bearer ${ADMIN_TOKEN}` }
    ),
    { GIT_FLOW_ADMIN_TOKEN: ADMIN_TOKEN }
  );

  assert.equal(response.status, 200);
  assert.deepEqual(
    state.executed.map((action) => action.type),
    ["create_branch", "open_pull_request", "create_tag"]
  );
});

test("dry-run marks deferred tags with a clear detail", async () => {
  const response = await worker.fetch(
    post("/git-flow/hotfix", {
      version: "v1.2.1",
      repository: "leds-conectafapes-backend-admin",
      approved: true,
    }),
    {}
  );

  assert.equal(response.status, 200);
  const payload = (await response.json()) as {
    results: { action: { type: string }; status: string; detail?: string }[];
  };
  const tag = payload.results.find((result) => result.action.type === "create_tag");
  assert.equal(tag?.status, "planned");
  assert.equal(tag?.detail, "tag_deferred_until_production_merge");
});
