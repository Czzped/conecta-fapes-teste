import type { ProjectFieldNames } from "../config/project-config.js";
import type { DateMutation } from "../domain/date-mutations.js";
import { GitHubGraphqlClient } from "./github-graphql-client.js";
import type {
  ProjectFieldDefinition,
  ProjectFieldMetadata,
  ProjectFieldNode,
  ProjectItemForSprintRollover,
  ProjectItemGitFlowContext,
  ProjectItemState,
  ProjectV2IterationField,
  ProjectV2SingleSelectField,
} from "./project-types.js";

const PROJECT_FIELDS_QUERY = `
  query ProjectFields($projectId: ID!) {
    node(id: $projectId) {
      ... on ProjectV2 {
        id
        fields(first: 100) {
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
              configuration {
                iterations {
                  id
                  title
                  startDate
                  duration
                }
                completedIterations {
                  id
                  title
                  startDate
                  duration
                }
              }
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

const PROJECT_ITEM_GIT_FLOW_CONTEXT_QUERY = `
  query ProjectItemGitFlowContext($itemId: ID!) {
    node(id: $itemId) {
      ... on ProjectV2Item {
        content {
          __typename
          ... on DraftIssue {
            title
          }
          ... on Issue {
            id
            title
            number
            repository {
              name
            }
          }
          ... on PullRequest {
            title
            number
            repository {
              name
            }
          }
        }
        fieldValues(first: 50) {
          nodes {
            __typename
            ... on ProjectV2ItemFieldSingleSelectValue {
              name
              field {
                ... on ProjectV2SingleSelectField {
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

const PROJECT_ITEMS_QUERY = `
  query ProjectItems($projectId: ID!, $first: Int!, $after: String) {
    node(id: $projectId) {
      ... on ProjectV2 {
        items(first: $first, after: $after) {
          nodes {
            id
            content {
              __typename
              ... on DraftIssue {
                title
              }
              ... on Issue {
                title
                url
              }
              ... on PullRequest {
                title
                url
              }
            }
            fieldValues(first: 100) {
              nodes {
                __typename
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
                ... on ProjectV2ItemFieldIterationValue {
                  iterationId
                  title
                  startDate
                  duration
                  field {
                    ... on ProjectV2IterationField {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  }
`;

const SPRINT_ROLLOVER_ITEMS_PAGE_SIZE = 20;

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

const SET_PROJECT_STATUS_MUTATION = `
  mutation SetProjectStatus(
    $projectId: ID!
    $itemId: ID!
    $fieldId: ID!
    $singleSelectOptionId: String!
  ) {
    updateProjectV2ItemFieldValue(
      input: {
        projectId: $projectId
        itemId: $itemId
        fieldId: $fieldId
        value: { singleSelectOptionId: $singleSelectOptionId }
      }
    ) {
      projectV2Item {
        id
      }
    }
  }
`;

const FIND_ITEM_BY_ISSUE_QUERY = `
  query FindItemByIssue($projectId: ID!, $issueNumber: Int!, $first: Int!, $after: String) {
    node(id: $projectId) {
      ... on ProjectV2 {
        items(first: $first, after: $after) {
          nodes {
            id
            content {
              __typename
              ... on Issue {
                number
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  }
`;

const SET_PROJECT_ITERATION_MUTATION = `
  mutation SetProjectIteration(
    $projectId: ID!
    $itemId: ID!
    $fieldId: ID!
    $iterationId: String!
  ) {
    updateProjectV2ItemFieldValue(
      input: {
        projectId: $projectId
        itemId: $itemId
        fieldId: $fieldId
        value: { iterationId: $iterationId }
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

const FIND_PROJECT_ITEM_BY_ISSUE_QUERY = `
  query FindProjectItemByIssue($owner: String!, $repo: String!, $number: Int!) {
    repository(owner: $owner, name: $repo) {
      issue(number: $number) {
        id
        projectItems(first: 10) {
          nodes {
            id
            project {
              id
              number
            }
          }
        }
      }
    }
  }
`;

const SET_PROJECT_SINGLE_SELECT_MUTATION = `
  mutation SetProjectSingleSelect(
    $projectId: ID!
    $itemId: ID!
    $fieldId: ID!
    $optionId: String!
  ) {
    updateProjectV2ItemFieldValue(
      input: {
        projectId: $projectId
        itemId: $itemId
        fieldId: $fieldId
        value: { singleSelectOptionId: $optionId }
      }
    ) {
      projectV2Item {
        id
      }
    }
  }
`;

interface FindProjectItemByIssueQueryResult {
  repository: {
    issue: {
      id: string;
      projectItems: {
        nodes: {
          id: string;
          project: {
            id: string;
            number: number;
          };
        }[];
      };
    } | null;
  } | null;
}

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

interface ProjectItemFieldIterationValueNode {
  __typename: "ProjectV2ItemFieldIterationValue";
  iterationId: string | null;
  title: string | null;
  startDate: string | null;
  duration: number | null;
  field: {
    id: string;
    name: string;
  } | null;
}

type ProjectSprintRolloverFieldValueNode =
  | ProjectItemFieldSingleSelectValueNode
  | ProjectItemFieldIterationValueNode;

interface ProjectItemQueryResult {
  node: {
    fieldValues: {
      nodes: ProjectItemFieldValueNode[];
    };
  } | null;
}

interface ProjectItemGitFlowContentNode {
  __typename: "DraftIssue" | "Issue" | "PullRequest";
  id?: string | null;
  title?: string | null;
  number?: number | null;
  repository?: { name?: string | null } | null;
}

interface ProjectItemGitFlowContextQueryResult {
  node: {
    content: ProjectItemGitFlowContentNode | null;
    fieldValues?: {
      nodes: ProjectItemFieldSingleSelectValueNode[];
    } | null;
  } | null;
}

interface ProjectItemContentNode {
  __typename: "DraftIssue" | "Issue" | "PullRequest";
  title: string;
  url?: string;
}

interface ProjectSprintRolloverItemNode {
  id: string;
  content: ProjectItemContentNode | null;
  fieldValues: {
    nodes: ProjectSprintRolloverFieldValueNode[];
  };
}

interface ProjectItemsQueryResult {
  node: {
    items: {
      nodes: ProjectSprintRolloverItemNode[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
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

function createFieldNameSet(fieldNames: string[]): Set<string> {
  return new Set(fieldNames.map((fieldName) => fieldName.trim()).filter(Boolean));
}

function resolveProjectRepositorySelection(
  values: ProjectItemFieldSingleSelectValueNode[] | undefined,
  repositoryFieldNames: string[]
): string | null {
  const fieldNameSet = createFieldNameSet(repositoryFieldNames);

  if (fieldNameSet.size === 0) {
    return null;
  }

  for (const value of values ?? []) {
    const fieldName = value.field?.name;

    if (fieldName && fieldNameSet.has(fieldName) && value.name) {
      return value.name;
    }
  }

  return null;
}

function createRolloverItem(
  node: ProjectSprintRolloverItemNode,
  statusFieldNames: Set<string>,
  iterationFieldNames: Set<string>
): ProjectItemForSprintRollover {
  let statusName: string | null = null;
  let iterationId: string | null = null;

  for (const value of node.fieldValues.nodes) {
    const fieldName = value.field?.name;

    if (!fieldName) {
      continue;
    }

    if (
      value.__typename === "ProjectV2ItemFieldSingleSelectValue" &&
      statusFieldNames.has(fieldName)
    ) {
      statusName = value.name;
      continue;
    }

    if (
      value.__typename === "ProjectV2ItemFieldIterationValue" &&
      iterationFieldNames.has(fieldName)
    ) {
      iterationId = value.iterationId;
    }
  }

  return {
    id: node.id,
    title: node.content?.title ?? "Untitled project item",
    url: node.content?.url ?? null,
    statusName,
    iterationId,
  };
}

export function isSingleSelectField(
  field: ProjectFieldNode
): field is ProjectV2SingleSelectField {
  return field.__typename === "ProjectV2SingleSelectField";
}

function isIterationField(
  field: ProjectFieldNode
): field is ProjectV2IterationField {
  return field.__typename === "ProjectV2IterationField";
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

  async listItemsForSprintRollover(
    projectId: string,
    statusFieldNames: string[],
    iterationFieldNames: string[]
  ): Promise<ProjectItemForSprintRollover[]> {
    const statusFieldNameSet = createFieldNameSet(statusFieldNames);
    const iterationFieldNameSet = createFieldNameSet(iterationFieldNames);
    const items: ProjectItemForSprintRollover[] = [];
    let after: string | null = null;

    do {
      const data: ProjectItemsQueryResult =
        await this.client.request<ProjectItemsQueryResult>(PROJECT_ITEMS_QUERY, {
          projectId,
          first: SPRINT_ROLLOVER_ITEMS_PAGE_SIZE,
          after,
        });

      if (!data.node) {
        throw new Error(`project not found: ${projectId}`);
      }

      for (const node of data.node.items.nodes) {
        items.push(
          createRolloverItem(node, statusFieldNameSet, iterationFieldNameSet)
        );
      }

      after = data.node.items.pageInfo.endCursor;

      if (!data.node.items.pageInfo.hasNextPage) {
        after = null;
      }
    } while (after);

    return items;
  }

  async getFieldMetadata(
    projectId: string,
    fieldNames: ProjectFieldNames
  ): Promise<ProjectFieldMetadata> {
    const fields = await this.listFields(projectId);
    const fieldsByName = new Map(fields.map((field) => [field.name, field]));
    return createFieldMetadata(fieldsByName, fieldNames);
  }

  async getIterationField(
    projectId: string,
    fieldNames: string[]
  ): Promise<ProjectV2IterationField> {
    const fields = await this.listFields(projectId);
    const fieldNameSet = createFieldNameSet(fieldNames);
    const field = fields.find(
      (candidate): candidate is ProjectV2IterationField =>
        isIterationField(candidate) && fieldNameSet.has(candidate.name)
    );

    if (!field) {
      throw new Error(`iteration field not found: ${fieldNames.join(", ")}`);
    }

    return field;
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

  async getItemGitFlowContext(
    itemId: string,
    repositoryFieldNames: string[] = []
  ): Promise<ProjectItemGitFlowContext> {
    const data = await this.client.request<ProjectItemGitFlowContextQueryResult>(
      PROJECT_ITEM_GIT_FLOW_CONTEXT_QUERY,
      { itemId }
    );

    if (!data.node) {
      throw new Error(`project item not found: ${itemId}`);
    }

    const content = data.node.content;
    const repositoryFromField = resolveProjectRepositorySelection(
      data.node.fieldValues?.nodes ?? [],
      repositoryFieldNames
    );
    const repositoryFromIssue =
      content?.__typename === "Issue" ? content.repository?.name ?? null : null;

    return {
      title: content?.title ?? null,
      repositoryName: repositoryFromField ?? repositoryFromIssue,
      issueId: content?.__typename === "Issue" ? content.id ?? null : null,
      issueNumber: content?.__typename === "Issue" ? content.number ?? null : null,
    };
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

  async setItemIteration(
    projectId: string,
    itemId: string,
    fieldId: string,
    iterationId: string
  ): Promise<void> {
    await this.client.request(SET_PROJECT_ITERATION_MUTATION, {
      projectId,
      itemId,
      fieldId,
      iterationId,
    });
  }

  async findItemByIssueNumber(
    projectId: string,
    issueNumber: number
  ): Promise<string | null> {
    type FindItemPage = {
      node: {
        items: {
          nodes: {
            id: string;
            content: { __typename: string; number?: number } | null;
          }[];
          pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
          };
        };
      } | null;
    };

    const pageSize = 100;
    let after: string | null = null;

    do {
      const result: FindItemPage = await this.client.request(FIND_ITEM_BY_ISSUE_QUERY, {
        projectId,
        issueNumber,
        first: pageSize,
        after,
      });

      if (!result.node) {
        throw new Error(`project not found: ${projectId}`);
      }

      for (const node of result.node.items.nodes) {
        if (
          node.content?.__typename === "Issue" &&
          node.content.number === issueNumber
        ) {
          return node.id;
        }
      }

      after = result.node.items.pageInfo.hasNextPage
        ? result.node.items.pageInfo.endCursor
        : null;
    } while (after);

    return null;
  }

  async updateItemStatus(
    projectId: string,
    itemId: string,
    statusFieldId: string,
    optionId: string
  ): Promise<void> {
    await this.client.request(SET_PROJECT_STATUS_MUTATION, {
      projectId,
      itemId,
      fieldId: statusFieldId,
      singleSelectOptionId: optionId,
    });
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

  /**
   * Encontra o ID do item do projeto associado a uma issue pelo numero.
   * Usa `Issue.projectItems` para buscar diretamente (evita scan do projeto inteiro).
   *
   * @returns o item ID ou null se a issue nao estiver no projeto alvo.
   */
  async findItemIdByIssue(
    projectId: string,
    owner: string,
    repo: string,
    issueNumber: number
  ): Promise<string | null> {
    const data = await this.client.request<FindProjectItemByIssueQueryResult>(
      FIND_PROJECT_ITEM_BY_ISSUE_QUERY,
      { owner, repo, number: issueNumber }
    );

    const issue = data.repository?.issue;
    if (!issue) {
      return null;
    }

    const match = issue.projectItems.nodes.find(
      (node) => node.project.id === projectId
    );

    return match?.id ?? null;
  }

  /**
   * Define o valor de um campo single-select (ex.: Status) para um item do projeto.
   */
  async setSingleSelectValue(
    projectId: string,
    itemId: string,
    fieldId: string,
    optionId: string
  ): Promise<void> {
    await this.client.request(SET_PROJECT_SINGLE_SELECT_MUTATION, {
      projectId,
      itemId,
      fieldId,
      optionId,
    });
  }
}
