import type {
  ProjectItemForSprintRollover,
  ProjectIteration,
} from "../github/project-types.js";

export interface SprintRolloverPair {
  source: ProjectIteration;
  target: ProjectIteration;
}

export interface SprintRolloverSelection {
  pair: SprintRolloverPair | null;
  reason?: "no_ended_iteration" | "no_next_iteration";
}

export interface SprintRolloverCandidate {
  id: string;
  title: string;
  url: string | null;
  statusName: string | null;
}

function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(value: string, days: number): string {
  const date = parseDate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDate(date);
}

function compareDate(left: string, right: string): number {
  return left.localeCompare(right);
}

export function getIterationEndDate(iteration: ProjectIteration): string {
  return addDays(iteration.startDate, iteration.duration);
}

export function selectSprintRolloverPair(
  iterations: ProjectIteration[],
  today: string
): SprintRolloverSelection {
  const ordered = [...iterations].sort((left, right) =>
    compareDate(left.startDate, right.startDate)
  );
  const source = ordered
    .filter((iteration) => compareDate(getIterationEndDate(iteration), today) <= 0)
    .at(-1);

  if (!source) {
    return { pair: null, reason: "no_ended_iteration" };
  }

  const sourceIndex = ordered.findIndex((iteration) => iteration.id === source.id);
  const target = ordered[sourceIndex + 1];

  if (!target) {
    return { pair: null, reason: "no_next_iteration" };
  }

  return {
    pair: {
      source,
      target,
    },
  };
}

export function selectSprintRolloverCandidates(
  items: ProjectItemForSprintRollover[],
  sourceIterationId: string,
  doneStatusName: string
): SprintRolloverCandidate[] {
  return items
    .filter((item) => item.iterationId === sourceIterationId)
    .filter((item) => item.statusName !== doneStatusName)
    .map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      statusName: item.statusName,
    }));
}
