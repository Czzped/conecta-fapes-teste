import assert from "node:assert/strict";
import test from "node:test";

import { GitHubGraphqlClient } from "../src/github/github-graphql-client.js";
import { GitHubProjectRepository } from "../src/github/project-repository.js";

const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("reads repository, issue number and title from Project item issue content", async () => {
  globalThis.fetch = (() =>
    Promise.resolve(
      new Response(
        JSON.stringify({
          data: {
            node: {
              content: {
                __typename: "Issue",
                title: "Implementar login do cidadão",
                number: 2090,
                repository: { name: "leds-conectafapes-backend-admin" },
              },
            },
          },
        }),
        { status: 200 }
      )
    )) as typeof fetch;

  const repository = new GitHubProjectRepository(
    new GitHubGraphqlClient("token", "test", { maxRetries: 0 })
  );

  const context = await repository.getItemGitFlowContext("item-1");

  assert.deepEqual(context, {
    title: "Implementar login do cidadão",
    repositoryName: "leds-conectafapes-backend-admin",
    issueNumber: 2090,
  });
});

test("does not create branch context for DraftIssue without repository", async () => {
  globalThis.fetch = (() =>
    Promise.resolve(
      new Response(
        JSON.stringify({
          data: {
            node: {
              content: {
                __typename: "DraftIssue",
                title: "Demanda sem repositorio definido",
              },
            },
          },
        }),
        { status: 200 }
      )
    )) as typeof fetch;

  const repository = new GitHubProjectRepository(
    new GitHubGraphqlClient("token", "test", { maxRetries: 0 })
  );

  const context = await repository.getItemGitFlowContext("item-2");

  assert.deepEqual(context, {
    title: "Demanda sem repositorio definido",
    repositoryName: null,
    issueNumber: null,
  });
});

test("uses Repositório single-select field as repository for draft project items", async () => {
  globalThis.fetch = (() =>
    Promise.resolve(
      new Response(
        JSON.stringify({
          data: {
            node: {
              content: {
                __typename: "DraftIssue",
                title: "Demanda com repositorio no campo do Project",
              },
              fieldValues: {
                nodes: [
                  {
                    __typename: "ProjectV2ItemFieldSingleSelectValue",
                    name: "leds-conectafapes/leds-conectafapes-frontend-backoffice",
                    field: { name: "Repositório" },
                  },
                ],
              },
            },
          },
        }),
        { status: 200 }
      )
    )) as typeof fetch;

  const repository = new GitHubProjectRepository(
    new GitHubGraphqlClient("token", "test", { maxRetries: 0 })
  );

  const context = await repository.getItemGitFlowContext("item-3", [
    "Repositório",
  ]);

  assert.deepEqual(context, {
    title: "Demanda com repositorio no campo do Project",
    repositoryName: "leds-conectafapes/leds-conectafapes-frontend-backoffice",
    issueNumber: null,
  });
});
