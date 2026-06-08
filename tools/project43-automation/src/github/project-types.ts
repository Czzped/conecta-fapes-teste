export interface ProjectFieldOption {
  id: string;
  name: string;
}

interface ProjectFieldBase {
  id: string;
  name: string;
  dataType: string;
}

export interface ProjectV2Field extends ProjectFieldBase {
  __typename: "ProjectV2Field";
}

export interface ProjectV2SingleSelectField extends ProjectFieldBase {
  __typename: "ProjectV2SingleSelectField";
  options: ProjectFieldOption[];
}

export interface ProjectIteration {
  id: string;
  title: string;
  startDate: string;
  duration: number;
}

export interface ProjectV2IterationField extends ProjectFieldBase {
  __typename: "ProjectV2IterationField";
  configuration?: {
    iterations: ProjectIteration[];
    completedIterations: ProjectIteration[];
  };
}

export type ProjectFieldNode =
  | ProjectV2Field
  | ProjectV2SingleSelectField
  | ProjectV2IterationField;

export interface ProjectFieldMetadata {
  fieldsByName: Map<string, ProjectFieldNode>;
  fieldLookup: Map<string, ProjectFieldNode>;
  statusField: ProjectFieldNode | null;
}

export interface ProjectItemState {
  statusName: string | null;
  startedAt: string | null;
  doneAt: string | null;
}

export interface ProjectItemForSprintRollover {
  id: string;
  title: string;
  url: string | null;
  statusName: string | null;
  iterationId: string | null;
}

export interface ProjectItemGitFlowContext {
  title: string | null;
  repositoryName: string | null;
  issueNumber: number | null;
}

export type ProjectCustomFieldType = "DATE" | "SINGLE_SELECT";

export interface ProjectSingleSelectOptionInput {
  name: string;
  color: string;
  description?: string;
}

export interface ProjectFieldDefinition {
  name: string;
  dataType: ProjectCustomFieldType;
  singleSelectOptions?: ProjectSingleSelectOptionInput[];
  legacyNames?: string[];
}
