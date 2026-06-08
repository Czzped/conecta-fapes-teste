import type { ProjectFieldNames } from "../config/project-config.js";
import {
  DEFAULT_GIT_FLOW_ORG,
  DEFAULT_REPOSITORIES,
} from "../config/git-flow-config.js";
import type { ProjectFieldDefinition } from "../github/project-types.js";

export function createManagedProjectFields(
  fieldNames: ProjectFieldNames
): ProjectFieldDefinition[] {
  return [
    {
      name: "Area",
      dataType: "SINGLE_SELECT",
      singleSelectOptions: [
        {
          name: "Produto",
          color: "GRAY",
          description: "Demandas de produto e descoberta",
        },
        {
          name: "Frontend",
          color: "BLUE",
          description: "Interface e experiencia do usuario",
        },
        {
          name: "Backend",
          color: "GREEN",
          description: "APIs, regras e servicos",
        },
        {
          name: "Dados",
          color: "YELLOW",
          description: "Dados, analytics e integracoes de dados",
        },
        {
          name: "Infra",
          color: "ORANGE",
          description: "Infraestrutura, deploy e operacao",
        },
        {
          name: "Design System",
          color: "PURPLE",
          description: "Biblioteca de componentes e padroes visuais",
        },
      ],
    },
    {
      name: "Data Alvo",
      dataType: "DATE",
    },
    {
      name: fieldNames.startedAt,
      dataType: "DATE",
    },
    {
      name: fieldNames.doneAt,
      dataType: "DATE",
      legacyNames: fieldNames.doneAtAliases.filter(
        (alias) => alias !== fieldNames.doneAt
      ),
    },
    {
      name: fieldNames.repository,
      dataType: "SINGLE_SELECT",
      singleSelectOptions: DEFAULT_REPOSITORIES.map((repo) => ({
        name: `${DEFAULT_GIT_FLOW_ORG}/${repo.name}`,
        color: "GRAY",
        description: `Repositorio tecnico ${repo.name}`,
      })),
      legacyNames: fieldNames.repositoryAliases.filter(
        (alias) => alias !== fieldNames.repository
      ),
    },
  ];
}
