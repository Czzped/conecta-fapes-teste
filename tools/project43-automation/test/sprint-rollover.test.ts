import assert from "node:assert/strict";
import test from "node:test";

import {
  getIterationEndDate,
  selectSprintRolloverCandidates,
  selectSprintRolloverPair,
} from "../src/domain/sprint-rollover.js";
import type {
  ProjectItemForSprintRollover,
  ProjectIteration,
} from "../src/github/project-types.js";

const iterations: ProjectIteration[] = [
  {
    id: "sprint-1",
    title: "Sprint 1",
    startDate: "2026-05-01",
    duration: 7,
  },
  {
    id: "sprint-2",
    title: "Sprint 2",
    startDate: "2026-05-08",
    duration: 7,
  },
  {
    id: "sprint-3",
    title: "Sprint 3",
    startDate: "2026-05-15",
    duration: 7,
  },
];

test("selects the latest ended sprint and its next sprint", () => {
  const result = selectSprintRolloverPair(iterations, "2026-05-08");

  assert.equal(result.pair?.source.id, "sprint-1");
  assert.equal(result.pair?.target.id, "sprint-2");
});

test("does not roll over before any sprint ends", () => {
  const result = selectSprintRolloverPair(iterations, "2026-05-07");

  assert.equal(result.pair, null);
  assert.equal(result.reason, "no_ended_iteration");
});

test("reports when there is no next sprint", () => {
  const result = selectSprintRolloverPair(iterations, "2026-05-22");

  assert.equal(result.pair, null);
  assert.equal(result.reason, "no_next_iteration");
});

test("treats iteration duration end date as exclusive", () => {
  assert.equal(getIterationEndDate(iterations[0]), "2026-05-08");
});

test("selects only non-Done items from the source sprint", () => {
  const items: ProjectItemForSprintRollover[] = [
    {
      id: "item-1",
      title: "Move me",
      url: "https://example.com/1",
      statusName: "In Progress",
      iterationId: "sprint-1",
    },
    {
      id: "item-2",
      title: "Already done",
      url: "https://example.com/2",
      statusName: "Done",
      iterationId: "sprint-1",
    },
    {
      id: "item-3",
      title: "Different sprint",
      url: "https://example.com/3",
      statusName: "Todo",
      iterationId: "sprint-2",
    },
  ];

  const result = selectSprintRolloverCandidates(items, "sprint-1", "Done");

  assert.deepEqual(result, [
    {
      id: "item-1",
      title: "Move me",
      url: "https://example.com/1",
      statusName: "In Progress",
    },
  ]);
});
