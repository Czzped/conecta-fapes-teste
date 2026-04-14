import type { ProjectFieldNames } from "../config/project-config.js";
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
  ];
}
