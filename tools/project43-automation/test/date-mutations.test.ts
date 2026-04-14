import assert from "node:assert/strict";
import test from "node:test";

import { createProjectConfig } from "../src/config/project-config.js";
import {
  buildDateMutations,
  formatToday,
} from "../src/domain/date-mutations.js";
import { shouldHandleStatusChange } from "../src/domain/project-webhook.js";

const defaults = createProjectConfig({});

test("fills started date only once when entering In Progress", () => {
  const today = "2026-04-10";
  const result = buildDateMutations({
    fieldNames: defaults.fieldNames,
    statusNames: defaults.statusNames,
    statusName: "In Progress",
    startedAt: null,
    doneAt: null,
    today,
  });

  assert.deepEqual(result, [
    {
      op: "set_date",
      fieldName: defaults.fieldNames.startedAt,
      date: today,
    },
  ]);
});

test("does not overwrite started date on re-entry to In Progress", () => {
  const result = buildDateMutations({
    fieldNames: defaults.fieldNames,
    statusNames: defaults.statusNames,
    statusName: "In Progress",
    startedAt: "2026-04-09",
    doneAt: null,
    today: "2026-04-10",
  });

  assert.deepEqual(result, []);
});

test("sets completion date when entering Done", () => {
  const today = "2026-04-10";
  const result = buildDateMutations({
    fieldNames: defaults.fieldNames,
    statusNames: defaults.statusNames,
    statusName: "Done",
    startedAt: "2026-04-09",
    doneAt: null,
    today,
  });

  assert.deepEqual(result, [
    {
      op: "set_date",
      fieldName: defaults.fieldNames.doneAt,
      date: today,
    },
  ]);
});

test("clears completion date when leaving Done", () => {
  const result = buildDateMutations({
    fieldNames: defaults.fieldNames,
    statusNames: defaults.statusNames,
    statusName: "Paused",
    startedAt: "2026-04-09",
    doneAt: "2026-04-10",
    today: "2026-04-11",
  });

  assert.deepEqual(result, [
    {
      op: "clear",
      fieldName: defaults.fieldNames.doneAt,
    },
  ]);
});

test("status change filter ignores non-status edits", () => {
  const shouldHandle = shouldHandleStatusChange({
    eventName: "projects_v2_item",
    projectId: "project-43",
    statusFieldId: "status-field",
    payload: {
      action: "edited",
      projects_v2_item: {
        project_node_id: "project-43",
      },
      changes: {
        field_value: {
          field_node_id: "priority-field",
        },
      },
    },
  });

  assert.equal(shouldHandle, false);
});

test("formats dates as yyyy-mm-dd", () => {
  const value = formatToday(new Date("2026-04-10T13:00:00Z"));
  assert.equal(value, "2026-04-10");
});
