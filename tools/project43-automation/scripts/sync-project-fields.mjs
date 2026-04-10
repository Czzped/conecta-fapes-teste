const PROJECT_ID = process.env.GITHUB_PROJECT_ID || "PVT_kwDOCqjXps4BUK-d";
const TOKEN =
  process.env.GITHUB_LEDS || process.env.GITHUB_PAT || process.env.GITHUB_TOKEN;

const desiredFields = [
  {
    name: "Area",
    dataType: "SINGLE_SELECT",
    singleSelectOptions: [
      { name: "Produto", color: "GRAY", description: "Demandas de produto e descoberta" },
      { name: "Frontend", color: "BLUE", description: "Interface e experiencia do usuario" },
      { name: "Backend", color: "GREEN", description: "APIs, regras e servicos" },
      { name: "Dados", color: "YELLOW", description: "Dados, analytics e integracoes de dados" },
      { name: "Infra", color: "ORANGE", description: "Infraestrutura, deploy e operacao" },
      {
        name: "Design System",
        color: "PURPLE",
        description: "Biblioteca de componentes e padroes visuais",
      },
    ],
  },
  { name: "Data Alvo", dataType: "DATE" },
  { name: "Iniciado em", dataType: "DATE" },
  { name: "Data de Conclusão", dataType: "DATE" },
];

const legacyFieldNames = new Map([["Data de Conclusão", "Data de Conclusao"]]);

if (!TOKEN) {
  throw new Error("missing GitHub token in GITHUB_LEDS, GITHUB_PAT or GITHUB_TOKEN");
}

async function githubGraphql(query, variables = {}) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "project43-field-sync",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json();

  if (!response.ok || payload.errors?.length) {
    throw new Error(
      `github graphql failed: ${response.status} ${JSON.stringify(payload.errors ?? payload)}`
    );
  }

  return payload.data;
}

async function listFields() {
  const query = `
    query ProjectFields($projectId: ID!) {
      node(id: $projectId) {
        ... on ProjectV2 {
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

  const data = await githubGraphql(query, { projectId: PROJECT_ID });
  return data.node.fields.nodes;
}

async function createField(field) {
  const mutation = `
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

  const data = await githubGraphql(mutation, {
    projectId: PROJECT_ID,
    name: field.name,
    dataType: field.dataType,
    singleSelectOptions: field.singleSelectOptions ?? null,
  });

  return data.createProjectV2Field.projectV2Field;
}

async function renameField(fieldId, name) {
  const mutation = `
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
          }
          ... on ProjectV2SingleSelectField {
            id
            name
          }
        }
      }
    }
  `;

  const data = await githubGraphql(mutation, {
    fieldId,
    name,
  });

  return data.updateProjectV2Field.projectV2Field;
}

const existingFields = await listFields();
const existingByName = new Map(existingFields.map((field) => [field.name, field]));
const summary = [];

for (const field of desiredFields) {
  const existing = existingByName.get(field.name);
  const legacyName = legacyFieldNames.get(field.name);
  const legacy = legacyName ? existingByName.get(legacyName) : null;

  if (!existing) {
    if (legacy) {
      const renamed = await renameField(legacy.id, field.name);
      summary.push({ field: field.name, action: "renamed", from: legacyName, id: renamed.id });
      continue;
    }

    const created = await createField(field);
    summary.push({ field: field.name, action: "created", id: created.id });
    continue;
  }

  if (field.name === "Area" && existing.__typename === "ProjectV2SingleSelectField") {
    const currentOptions = existing.options.map((option) => option.name).sort();
    const expectedOptions = field.singleSelectOptions.map((option) => option.name).sort();
    const matches =
      currentOptions.length === expectedOptions.length &&
      currentOptions.every((value, index) => value === expectedOptions[index]);

    summary.push({
      field: field.name,
      action: matches ? "validated" : "exists_with_different_options",
      options: currentOptions,
    });
    continue;
  }

  summary.push({ field: field.name, action: "exists", id: existing.id });
}

console.log(JSON.stringify(summary, null, 2));
