import type { SprintRolloverConfig } from "../config/sprint-rollover-config.js";
import {
  getIterationEndDate,
  selectSprintRolloverCandidates,
  selectSprintRolloverPair,
  type SprintRolloverCandidate,
} from "../domain/sprint-rollover.js";
import { GitHubProjectRepository } from "../github/project-repository.js";
import type { ProjectIteration } from "../github/project-types.js";

export interface SprintRolloverSummary {
  dryRun: boolean;
  today: string;
  source?: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
  };
  target?: {
    id: string;
    title: string;
    startDate: string;
  };
  scannedItems: number;
  movedItems: number;
  skippedReason?: string;
  candidates: SprintRolloverCandidate[];
}

function uniqueIterations(iterations: ProjectIteration[]): ProjectIteration[] {
  const byId = new Map<string, ProjectIteration>();

  for (const iteration of iterations) {
    byId.set(iteration.id, iteration);
  }

  return [...byId.values()];
}

export async function runSprintRollover(
  repository: GitHubProjectRepository,
  config: SprintRolloverConfig
): Promise<SprintRolloverSummary> {
  const iterationField = await repository.getIterationField(
    config.project.projectId,
    config.iterationFieldNames
  );
  const iterationConfig = iterationField.configuration;

  if (!iterationConfig) {
    throw new Error(`iteration field has no configuration: ${iterationField.name}`);
  }

  const iterations = uniqueIterations([
    ...iterationConfig.completedIterations,
    ...iterationConfig.iterations,
  ]);
  const selection = selectSprintRolloverPair(iterations, config.today);

  if (!selection.pair) {
    return {
      dryRun: config.dryRun,
      today: config.today,
      scannedItems: 0,
      movedItems: 0,
      skippedReason: selection.reason,
      candidates: [],
    };
  }

  const items = await repository.listItemsForSprintRollover(
    config.project.projectId,
    config.project.fieldNames.statusAliases,
    config.iterationFieldNames
  );
  const candidates = selectSprintRolloverCandidates(
    items,
    selection.pair.source.id,
    config.project.statusNames.done
  );

  if (!config.dryRun) {
    for (const candidate of candidates) {
      await repository.setItemIteration(
        config.project.projectId,
        candidate.id,
        iterationField.id,
        selection.pair.target.id
      );
    }
  }

  return {
    dryRun: config.dryRun,
    today: config.today,
    source: {
      id: selection.pair.source.id,
      title: selection.pair.source.title,
      startDate: selection.pair.source.startDate,
      endDate: getIterationEndDate(selection.pair.source),
    },
    target: {
      id: selection.pair.target.id,
      title: selection.pair.target.title,
      startDate: selection.pair.target.startDate,
    },
    scannedItems: items.length,
    movedItems: candidates.length,
    candidates,
  };
}
