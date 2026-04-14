import {
  GitHubProjectRepository,
  isSingleSelectField,
} from "../github/project-repository.js";
import type {
  ProjectFieldDefinition,
  ProjectFieldNode,
} from "../github/project-types.js";

export interface ProjectFieldSyncSummaryEntry {
  field: string;
  action:
    | "created"
    | "renamed"
    | "exists"
    | "validated"
    | "exists_with_different_options";
  id?: string;
  from?: string;
  options?: string[];
}

function findLegacyField(
  existingByName: Map<string, ProjectFieldNode>,
  definition: ProjectFieldDefinition
): { field: ProjectFieldNode; name: string } | null {
  for (const legacyName of definition.legacyNames ?? []) {
    const legacyField = existingByName.get(legacyName);

    if (legacyField) {
      return {
        field: legacyField,
        name: legacyName,
      };
    }
  }

  return null;
}

function hasMatchingSingleSelectOptions(
  existingField: ProjectFieldNode,
  definition: ProjectFieldDefinition
): boolean {
  if (!definition.singleSelectOptions?.length || !isSingleSelectField(existingField)) {
    return false;
  }

  const currentOptions = existingField.options.map((option) => option.name).sort();
  const expectedOptions = definition.singleSelectOptions
    .map((option) => option.name)
    .sort();

  return (
    currentOptions.length === expectedOptions.length &&
    currentOptions.every((value, index) => value === expectedOptions[index])
  );
}

export async function syncProjectFields(
  repository: GitHubProjectRepository,
  projectId: string,
  definitions: ProjectFieldDefinition[]
): Promise<ProjectFieldSyncSummaryEntry[]> {
  const existingFields = await repository.listFields(projectId);
  const existingByName = new Map(existingFields.map((field) => [field.name, field]));
  const summary: ProjectFieldSyncSummaryEntry[] = [];

  for (const definition of definitions) {
    const existingField = existingByName.get(definition.name);

    if (!existingField) {
      const legacyField = findLegacyField(existingByName, definition);

      if (legacyField) {
        const renamedField = await repository.renameField(
          legacyField.field.id,
          definition.name
        );

        existingByName.delete(legacyField.name);
        existingByName.set(definition.name, renamedField);

        summary.push({
          field: definition.name,
          action: "renamed",
          from: legacyField.name,
          id: renamedField.id,
        });

        continue;
      }

      const createdField = await repository.createField(projectId, definition);
      existingByName.set(definition.name, createdField);

      summary.push({
        field: definition.name,
        action: "created",
        id: createdField.id,
      });

      continue;
    }

    if (definition.singleSelectOptions?.length) {
      summary.push({
        field: definition.name,
        action: hasMatchingSingleSelectOptions(existingField, definition)
          ? "validated"
          : "exists_with_different_options",
        options: isSingleSelectField(existingField)
          ? existingField.options.map((option) => option.name).sort()
          : undefined,
      });

      continue;
    }

    summary.push({
      field: definition.name,
      action: "exists",
      id: existingField.id,
    });
  }

  return summary;
}
