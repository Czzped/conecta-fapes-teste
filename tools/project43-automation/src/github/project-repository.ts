import type { ProjectFieldNames } from "../config/project-config.js";
import type { DateMutation } from "../domain/date-mutations.js";
import { GitHubGraphqlClient } from "./github-graphql-client.js";
import type {
  ProjectFieldDefinition,
  ProjectFieldMetadata,
  ProjectFieldNode,
  ProjectItemState,
  ProjectV2SingleSelectField,
} from "./project-types.js";

const PROJECT_FIELDS_QUERY = `
  query ProjectFields($projectId: ID!) {
    node(id: $projectId) {
      ... on ProjectV2 {
        id
        fields(first: 50) {
          nodes {
            __typename
            ... on ProjectV2Field {
              id
              name
              dataType
            }
            ... on ProjectV2SingleSelectField {
              id
              name
              dataType
              options {
                id
                name
              }
            }
            ... on ProjectV2IterationField {
              id
              name
              dataType
            }
          }
        }
      }
    }
  }
`;

const PROJECT_ITEM_QUERY = `
  query ProjectItem($itemId: ID!) {
    node(id: $itemId) {
      ... on ProjectV2Item {
        id
        fieldValues(first: 50) {
          nodes {
            __typename
            ... on ProjectV2ItemFieldDateValue {
              date
              field {
                ... on ProjectV2Field {
                  id
                  name
                }
              }
            }
            ... on ProjectV2ItemFieldSingleSelectValue {
              name
              optionId
              field {
                ... on ProjectV2SingleSelectField {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

const SET_PROJECT_DATE_MUTATION = `
  mutation SetProjectDate(
    $projectId: ID!
    $itemId: ID!
    $fieldId: ID!
    $date: Date!
  ) {
    updateProjectV2ItemFieldValue(
      input: {
        projectId: $projectId
        itemId: $itemId
        fieldId: $fieldId
        value: { date: $date }
      }
    ) {
      projectV2Item {
        id
      }
    }
  }
`;

const CLEAR_PROJECT_DATE_MUTATION = `
  mutation ClearProjectDate(
    $projectId: ID!
    $itemId: ID!
    $fieldId: ID!
  ) {
    clearProjectV2ItemFieldValue(
      input: {
        projectId: $projectId
        itemId: $itemId
        fieldId: $fieldId
      }
    ) {
      projectV2Item {
        id
      }
    }
  }
`;

const CREATE_FIELD_MUTATION = `
  mutation CreateField(
    $projectId: ID!
    $name: String!
    $dataType: ProjectV2CustomFieldType!
    $singleSelectOptions: [ProjectV2SingleSelectFieldOptionInput!]
  ) {
    createProjectV2Field(
      input: {
        projectId: $projectId
        name: $name
        dataType: $dataType
        singleSelectOptions: $singleSelectOptions
      }
    ) {
      projectV2Field {
        __typename
        ... on ProjectV2Field {
          id
          name
          dataType
        }
        ... on ProjectV2SingleSelectField {
          id
          name
          dataType
          options {
            id
            name
          }
        }
      }
    }
  }
`;

const RENAME_FIELD_MUTATION = `
  mutation UpdateField($fieldId: ID!, $name: String!) {
    updateProjectV2Field(
      input: {
        fieldId: $fieldId
        name: $name
      }
    ) {
      projectV2Field {
        __typename
        ... on ProjectV2Field {
          id
          name
          dataType
        }
        ... on ProjectV2SingleSelectField {
          id
          name
          dataType
          options {
            id
            name
          }
        }
      }
    }
  }
`;

interface ProjectFieldsQueryResult {
  node: {
    fields: {
      nodes: ProjectFieldNode[];
    };
  } | null;
}

interface ProjectItemFieldDateValueNode {
  __typename: "ProjectV2ItemFieldDateValue";
  date: string | null;
  field: {
    id: string;
    name: string;
  } | null;
}

interface ProjectItemFieldSingleSelectValueNode {
  __typename: "ProjectV2ItemFieldSingleSelectValue";
  name: string | null;
  optionId: string | null;
  field: {
    id: string;
    name: string;
  } | null;
}

type ProjectItemFieldValueNode =
  | ProjectItemFieldDateValueNode
  | ProjectItemFieldSingleSelectValueNode;

interface ProjectItemQueryResult {
  node: {
    fieldValues: {
      nodes: ProjectItemFieldValueNode[];
    };
  } | null;
}

interface CreateFieldMutationResult {
  createProjectV2Field: {
    projectV2Field: ProjectFieldNode;
  };
}

interface RenameFieldMutationResult {
  updateProjectV2Field: {
    projectV2Field: ProjectFieldNode;
  };
}

function resolveFieldByAliases(
  fieldsByName: Map<string, ProjectFieldNode>,
  aliases: string[]
): ProjectFieldNode | null {
  for (const alias of aliases) {
    const field = fieldsByName.get(alias);

    if (field) {
      return field;
    }
  }

  return null;
}

function createFieldMetadata(
  fieldsByName: Map<string, ProjectFieldNode>,
  fieldNames: ProjectFieldNames
): ProjectFieldMetadata {
  const fieldLookup = new Map<string, ProjectFieldNode>();

  const registerAliases = (aliases: string[]): ProjectFieldNode | null => {
    const field = resolveFieldByAliases(fieldsByName, aliases);

    if (!field) {
      return null;
    }

    for (const alias of aliases) {
      fieldLookup.set(alias, field);
    }

    return field;
  };

  const statusField = registerAliases(fieldNames.statusAliases);
  registerAliases(fieldNames.startedAtAliases);
  registerAliases(fieldNames.doneAtAliases);

  return {
    fieldsByName,
    fieldLookup,
    statusField,
  };
}

function resolveTrackedField(
  metadata: ProjectFieldMetadata,
  fieldName: string
): ProjectFieldNode | null {
  return (
    metadata.fieldLookup.get(fieldName) ??
    metadata.fieldsByName.get(fieldName) ??
    null
  );
}

export function isSingleSelectField(
  field: ProjectFieldNode
): field is ProjectV2SingleSelectField {
  return field.__typename === "ProjectV2SingleSelectField";
}

export class GitHubProjectRepository {
  constructor(private readonly client: GitHubGraphqlClient) {}

  async listFields(projectId: string): Promise<ProjectFieldNode[]> {
    const data = await this.client.request<ProjectFieldsQueryResult>(
      PROJECT_FIELDS_QUERY,
      { projectId }
    );

    if (!data.node) {
      throw new Error(`project not found: ${projectId}`);
    }

    return data.node.fields.nodes;
  }

  async getFieldMetadata(
    projectId: string,
    fieldNames: ProjectFieldNames
  ): Promise<ProjectFieldMetadata> {
    const fields = await this.listFields(projectId);
    const fieldsByName = new Map(fields.map((field) => [field.name, field]));
    return createFieldMetadata(fieldsByName, fieldNames);
  }

  async getItemState(
    itemId: string,
    fieldNames: ProjectFieldNames
  ): Promise<ProjectItemState> {
    const data = await this.client.request<ProjectItemQueryResult>(
      PROJECT_ITEM_QUERY,
      { itemId }
    );

    if (!data.node) {
      throw new Error(`project item not found: ${itemId}`);
    }

    const statusAliases = new Set(fieldNames.statusAliases);
    const startedAtAliases = new Set(fieldNames.startedAtAliases);
    const doneAtAliases = new Set(fieldNames.doneAtAliases);

    const result: ProjectItemState = {
      statusName: null,
      startedAt: null,
      doneAt: null,
    };

    for (const node of data.node.fieldValues.nodes) {
      const fieldName = node.field?.name;

      if (!fieldName) {
        continue;
      }

      if (
        node.__typename === "ProjectV2ItemFieldSingleSelectValue" &&
        statusAliases.has(fieldName)
      ) {
        result.statusName = node.name;
      }

      if (
        node.__typename === "ProjectV2ItemFieldDateValue" &&
        startedAtAliases.has(fieldName)
      ) {
        result.startedAt = node.date;
      }

      if (
        node.__typename === "ProjectV2ItemFieldDateValue" &&
        doneAtAliases.has(fieldName)
      ) {
        result.doneAt = node.date;
      }
    }

    return result;
  }

  async applyDateMutations(
    projectId: string,
    itemId: string,
    metadata: ProjectFieldMetadata,
    mutations: DateMutation[]
  ): Promise<void> {
    for (const mutation of mutations) {
      const field = resolveTrackedField(metadata, mutation.fieldName);

      if (!field) {
        throw new Error(`field not found: ${mutation.fieldName}`);
      }

      if (mutation.op === "set_date") {
        await this.client.request(SET_PROJECT_DATE_MUTATION, {
          projectId,
          itemId,
          fieldId: field.id,
          date: mutation.date,
        });
        continue;
      }

      await this.client.request(CLEAR_PROJECT_DATE_MUTATION, {
        projectId,
        itemId,
        fieldId: field.id,
      });
    }
  }

  async createField(
    projectId: string,
    definition: ProjectFieldDefinition
  ): Promise<ProjectFieldNode> {
    const data = await this.client.request<CreateFieldMutationResult>(
      CREATE_FIELD_MUTATION,
      {
        projectId,
        name: definition.name,
        dataType: definition.dataType,
        singleSelectOptions: definition.singleSelectOptions ?? null,
      }
    );

    return data.createProjectV2Field.projectV2Field;
  }

  async renameField(fieldId: string, name: string): Promise<ProjectFieldNode> {
    const data = await this.client.request<RenameFieldMutationResult>(
      RENAME_FIELD_MUTATION,
      {
        fieldId,
        name,
      }
    );

    return data.updateProjectV2Field.projectV2Field;
  }
}
