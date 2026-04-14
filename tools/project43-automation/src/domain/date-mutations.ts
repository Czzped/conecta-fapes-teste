import type {
  ProjectFieldNames,
  ProjectStatusNames,
} from "../config/project-config.js";

export interface SetDateMutation {
  op: "set_date";
  fieldName: string;
  date: string;
}

export interface ClearFieldMutation {
  op: "clear";
  fieldName: string;
}

export type DateMutation = SetDateMutation | ClearFieldMutation;

interface BuildDateMutationsInput {
  statusName: string | null;
  startedAt: string | null;
  doneAt: string | null;
  today: string;
  fieldNames: ProjectFieldNames;
  statusNames: ProjectStatusNames;
}

export function formatToday(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function buildDateMutations({
  statusName,
  startedAt,
  doneAt,
  today,
  fieldNames,
  statusNames,
}: BuildDateMutationsInput): DateMutation[] {
  const mutations: DateMutation[] = [];

  if (statusName === statusNames.inProgress && !startedAt) {
    mutations.push({
      op: "set_date",
      fieldName: fieldNames.startedAt,
      date: today,
    });
  }

  if (statusName === statusNames.done) {
    if (doneAt !== today) {
      mutations.push({
        op: "set_date",
        fieldName: fieldNames.doneAt,
        date: today,
      });
    }

    return mutations;
  }

  if (doneAt) {
    mutations.push({
      op: "clear",
      fieldName: fieldNames.doneAt,
    });
  }

  return mutations;
}
