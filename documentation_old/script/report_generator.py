import requests
import os
from datetime import datetime
from collections import defaultdict
from dotenv import load_dotenv

load_dotenv()
# Configuração
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN') 
ORG_NAME = 'leds-conectafapes'
PROJECT_NUMBER = 7

HEADERS = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json"
}

# Consulta GraphQL para o projeto
QUERY = """
query ($org: String!, $projectNumber: Int!, $cursor: String) {
  organization(login: $org) {
    projectV2(number: $projectNumber) {
      title
      items(first: 50, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          content {
            ... on Issue {
              title
              number
              url
              state
              createdAt
              closedAt
              assignees(first: 10) {
                nodes {
                  login
                }
              }
              labels(first: 10) {
                nodes {
                  name
                }
              }
              milestone {
                title
                dueOn
              }
            }
          }
          fieldValues(first: 20) {
            nodes {
              ... on ProjectV2ItemFieldTextValue {
                field {
                  ... on ProjectV2FieldCommon {
                    name
                  }
                }
                text
              }
              ... on ProjectV2ItemFieldSingleSelectValue {
                field {
                  ... on ProjectV2FieldCommon {
                    name
                  }
                }
                name
              }
            }
          }
        }
      }
    }
  }
}
"""

# Consulta GraphQL para buscar todas as issues da organização
ALL_ISSUES_QUERY = """
query ($org: String!, $cursor: String) {
  organization(login: $org) {
    repositories(first: 100, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        name
        issues(first: 100, states: [OPEN, CLOSED]) {
          nodes {
            title
            number
            url
            state
            createdAt
            closedAt
            assignees(first: 10) {
              nodes {
                login
              }
            }
            labels(first: 10) {
              nodes {
                name
              }
            }
            milestone {
              title
              dueOn
            }
          }
        }
      }
    }
  }
}
"""

# Função original para executar consultas GraphQL
def run_query(query, variables):
    response = requests.post(
        'https://api.github.com/graphql',
        headers=HEADERS,
        json={'query': query, 'variables': variables}
    )
    if response.status_code != 200:
        raise Exception(f"❌ Falha na query. Status code {response.status_code}: {response.text}")

    result = response.json()

    if "errors" in result:
        print("🚨 Erro na resposta da API do GitHub:")
        for error in result["errors"]:
            print(f"- {error['message']}")
        raise Exception("❌ Erro na resposta da API do GitHub.")

    return result

# Nova função para buscar todas as issues de todos os repositórios
def fetch_all_org_issues():
    all_issues = []
    repo_cursor = None
    
    print("🔍 Buscando todos os repositórios e suas issues...")
    
    while True:
        variables = {
            "org": ORG_NAME,
            "cursor": repo_cursor
        }
        result = run_query(ALL_ISSUES_QUERY, variables)
        
        try:
            repos_data = result["data"]["organization"]["repositories"]
            repos = repos_data["nodes"]
        except KeyError:
            raise Exception("❌ Verifique se o nome da organização está correto.")
        
        for repo in repos:
            repo_name = repo["name"]
            repo_issues = repo["issues"]["nodes"]
            
            for issue in repo_issues:
                all_issues.append({
                    "title": issue["title"],
                    "number": issue["number"],
                    "url": issue["url"],
                    "state": issue["state"],
                    "created_at": issue["createdAt"],
                    "closed_at": issue["closedAt"],
                    "assignees": [a["login"] for a in issue["assignees"]["nodes"]],
                    "labels": [l["name"] for l in issue["labels"]["nodes"]],
                    "milestone": issue["milestone"]["title"] if issue["milestone"] else None,
                    "milestone_due": issue["milestone"]["dueOn"] if issue["milestone"] else None,
                    "repository": repo_name,
                    "fields": {}  # Issues fora do projeto não têm campos personalizados
                })
        
        page_info = repos_data["pageInfo"]
        if not page_info["hasNextPage"]:
            break
        repo_cursor = page_info["endCursor"]
    
    print(f"✅ Total de issues encontradas em todos os repositórios: {len(all_issues)}")
    return all_issues

# Função original mantida para buscar issues do projeto
def fetch_project_issues():
    issues = []
    cursor = None

    print("🔍 Buscando issues do projeto...")

    while True:
        variables = {
            "org": ORG_NAME,
            "projectNumber": PROJECT_NUMBER,
            "cursor": cursor
        }
        result = run_query(QUERY, variables)

        try:
            project_data = result["data"]["organization"]["projectV2"]
        except KeyError:
            raise Exception("❌ Verifique se o nome da organização e número do projeto estão corretos.")

        project_title = project_data["title"]
        items = project_data["items"]["nodes"]

        for item in items:
            if not item["content"]:
                continue
            issue = item["content"]
            fields = {fv["field"]["name"]: fv.get("text") or fv.get("name") for fv in item["fieldValues"]["nodes"] if fv}

            issues.append({
                "title": issue["title"],
                "number": issue["number"],
                "url": issue["url"],
                "state": issue["state"],
                "created_at": issue["createdAt"],
                "closed_at": issue["closedAt"],
                "assignees": [a["login"] for a in issue["assignees"]["nodes"]],
                "labels": [l["name"] for l in issue["labels"]["nodes"]],
                "milestone": issue["milestone"]["title"] if issue["milestone"] else None,
                "milestone_due": issue["milestone"]["dueOn"] if issue["milestone"] else None,
                "fields": fields
            })

        page_info = project_data["items"]["pageInfo"]
        if not page_info["hasNextPage"]:
            break
        cursor = page_info["endCursor"]

    print(f"✅ Total de issues encontradas no projeto: {len(issues)}")
    return issues, project_title

# Função para mesclar issues do projeto com todas as issues
def merge_issues(project_issues, all_issues):
    # Criar um dicionário de issues do projeto por URL para facilitar a busca
    project_issues_dict = {issue["url"]: issue for issue in project_issues}
    
    # Mesclar informações
    for issue in all_issues:
        if issue["url"] in project_issues_dict:
            # Adicionar campos do projeto às issues que estão no projeto
            issue["fields"] = project_issues_dict[issue["url"]]["fields"]
    
    return all_issues

# Função para gerar o relatório mantida como está
def generate_report(issues, title="Todas as Issues"):
    report = []
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    total_issues = len(issues)
    closed_issues = sum(1 for issue in issues if issue['state'] == 'CLOSED')
    
    report.append(f"---\n")
    report.append(f"title: 📊 Relatório Analítico\n")
    report.append(f"sidebar_position: 3\n")
    report.append(f"---\n")
    
    report.append(f"- 📅 Data de geração: {now}")
    report.append(f"- ✅ Total de Issues: {total_issues}")
    report.append(f"- 🔒 Issues Fechadas: {closed_issues}")
    report.append(f"- 🚧 Issues Abertas: {total_issues - closed_issues}\n")

    # Resumo geral por status
    status_summary = defaultdict(int)
    type_summary = defaultdict(int)
    repo_summary = defaultdict(int)

    # Função auxiliar para pegar o campo Tipo dinamicamente
    def get_issue_type(issue):
        # Primeiro tenta pegar do campo do projeto
        for key in issue["fields"].keys():
            if key.lower() in ("tipo", "type", "issue type", "tipo de issue"):
                return issue["fields"][key]
        # Se não tiver, tenta pelas labels
        label_types = ["bug", "feature", "enhancement", "task", "documentation"]
        for label in issue['labels']:
            if label.lower() in label_types:
                return label.capitalize()
        return "Não definido"

    # Preenche os resumos
    for issue in issues:
        status_summary[issue["state"]] += 1
        issue_type = get_issue_type(issue)
        type_summary[issue_type] += 1
        repo_summary[issue.get("repository", "Desconhecido")] += 1

    report.append("## 📈 Resumo Geral por Status")
    for status, count in status_summary.items():
        report.append(f"- **{status}**: {count}")
    report.append("")

    # Resumo por repositório
    report.append("## 📁 Resumo por Repositório")
    for repo, count in sorted(repo_summary.items(), key=lambda x: x[1], reverse=True):
        report.append(f"- **{repo}**: {count}")
    report.append("")

    # Resumo por tipo de issue
    report.append("## 📂 Resumo por Tipo de Issue")
    for issue_type, count in type_summary.items():
        report.append(f"- **{issue_type}**: {count}")
    report.append("")

    # Função auxiliar para pegar o campo Prioridade dinamicamente
    def get_priority(fields):
        for key in fields.keys():
            if key.lower() in ("prioridade", "priority"):
                return fields[key]
        return "Sem prioridade"

    # Função auxiliar para ícones por status
    def get_status_emoji(status):
        return {
            "OPEN": "🟢",
            "CLOSED": "✅",
        }.get(status, "❔")

    # Função para ordenar issues por prioridade e data de criação
    def sort_issues(issues):
        priority_order = {
            "Alta": 1,
            "Média": 2,
            "Baixa": 3,
            "Sem prioridade": 4
        }
        return sorted(
            issues,
            key=lambda x: (
                priority_order.get(get_priority(x['fields']), 99),
                x['created_at']
            )
        )

    # Função para gerar tabela de issues
    def generate_issue_table(issues_grouped):
        table = [
            "| Título | Repositório | Tipo | Status | Criado em | Fechado em | Labels |",
            "|--------|-------------|------|--------|-----------|------------|--------|"
        ]
        for issue in issues_grouped:
            title = f"[{issue['title']}]({issue['url']})"
            repository = issue.get("repository", "Desconhecido")
            issue_type = get_issue_type(issue)
            status = f"{get_status_emoji(issue['state'])} {issue['state']}"
            created_at = issue['created_at'].split("T")[0]
            closed_at = issue['closed_at'].split("T")[0] if issue['closed_at'] else 'Em aberto'
            labels = ', '.join(issue['labels']) or 'Nenhum'
            table.append(f"| {title} | {repository} | {issue_type} | {status} | {created_at} | {closed_at} | {labels} |")
        table.append("")  # Linha em branco ao final da tabela
        return table

    # Tabela Geral por Repositório
    report.append("## 📚 Detalhamento por Repositório")
    repo_groups = defaultdict(list)
    for issue in issues:
        repo = issue.get("repository", "Desconhecido")
        repo_groups[repo].append(issue)

    for repo, repo_issues in sorted(repo_groups.items()):
        closed = sum(1 for issue in repo_issues if issue["state"] == "CLOSED")
        progress = (closed / len(repo_issues)) * 100 if repo_issues else 0
        report.append(f"### 📁 Repositório: {repo} ({len(repo_issues)} issues, {progress:.1f}% concluído)\n")
        sorted_issues = sort_issues(repo_issues)
        report.extend(generate_issue_table(sorted_issues))

    # Tabela Geral por Responsável
    report.append("## 👥 Tabela Geral por Responsável")
    assignee_groups_global = defaultdict(list)
    for issue in issues:
        assignees = issue['assignees'] or ["Nenhum"]
        for assignee in assignees:
            assignee_groups_global[assignee].append(issue)

    for assignee, group_issues in sorted(assignee_groups_global.items()):
        report.append(f"### 👤 Responsável: {assignee}")
        sorted_issues = sort_issues(group_issues)
        report.extend(generate_issue_table(sorted_issues))

    # 📌 Detalhamento por Sprint (apenas para issues do projeto)
    issues_with_sprint = [issue for issue in issues if issue["fields"].get("Sprint")]
    if issues_with_sprint:
        report.append("## 🧩 Detalhamento por Sprint")
        sprints = defaultdict(list)
        for issue in issues_with_sprint:
            sprint = issue["fields"].get("Sprint", "Sem Sprint")
            if sprint != "Sem Sprint":
                sprints[sprint].append(issue)

        for sprint, sprint_issues in sorted(sprints.items()):
            closed = sum(1 for issue in sprint_issues if issue["state"] == "CLOSED")
            progress = (closed / len(sprint_issues)) * 100 if sprint_issues else 0
            report.append(f"### 🏃 Sprint: {sprint} ({len(sprint_issues)} issues, {progress:.1f}% concluído)\n")

            # Agrupar por responsável
            assignee_groups = defaultdict(list)
            for issue in sprint_issues:
                assignees = issue['assignees'] or ["Nenhum"]
                for assignee in assignees:
                    assignee_groups[assignee].append(issue)

            for assignee, group_issues in sorted(assignee_groups.items()):
                report.append(f"#### 👤 Responsável: {assignee}")
                sorted_issues = sort_issues(group_issues)
                report.extend(generate_issue_table(sorted_issues))

    # 📌 Detalhamento por Milestone
    issues_with_milestone = [issue for issue in issues if issue["milestone"]]
    if issues_with_milestone:
        report.append("## 🏁 Detalhamento por Milestone")
        milestones = defaultdict(list)
        for issue in issues_with_milestone:
            milestone = issue["milestone"] or "Sem Milestone"
            if milestone != "Sem Milestone":
                milestones[milestone].append(issue)

        for milestone, milestone_issues in sorted(milestones.items()):
            milestone_due = milestone_issues[0]["milestone_due"] if milestone_issues and milestone_issues[0]["milestone_due"] else "Sem data"
            closed = sum(1 for issue in milestone_issues if issue["state"] == "CLOSED")
            progress = (closed / len(milestone_issues)) * 100 if milestone_issues else 0
            report.append(f"### 🎯 Milestone: {milestone}")
            report.append(f"- 📆 Data de entrega: {milestone_due}")
            report.append(f"- 📌 Total de Issues: {len(milestone_issues)}")
            report.append(f"- 🔒 Fechadas: {closed}")
            report.append(f"- 🚧 Abertas: {len(milestone_issues) - closed}")
            report.append(f"- 📊 Progresso: {progress:.1f}%\n")

            # Agrupar por responsável
            assignee_groups = defaultdict(list)
            for issue in milestone_issues:
                assignees = issue['assignees'] or ["Nenhum"]
                for assignee in assignees:
                    assignee_groups[assignee].append(issue)

            for assignee, group_issues in sorted(assignee_groups.items()):
                report.append(f"#### 👤 Responsável: {assignee}")
                sorted_issues = sort_issues(group_issues)
                report.extend(generate_issue_table(sorted_issues))

    return "\n".join(report)

def save_report(report, filename="relatorio_analitico_github.md", folder="docs/relatorios"):
    """
    Salva o relatório em um arquivo no diretório especificado.
    
    Args:
        report (str): Conteúdo do relatório
        filename (str): Nome do arquivo
        folder (str): Pasta onde salvar o relatório (padrão: docs/relatorios)
    """
    # Garantir que o diretório exista
    import os
    if not os.path.exists(folder):
        os.makedirs(folder)
    
    filepath = os.path.join(folder, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"✅ Relatório salvo como {filepath}")

if __name__ == "__main__":
    try:
        # Pasta onde os relatórios serão salvos
        relatorios_folder = "docs/gestao/trilha_desenvolvimento/negocio"
        
        # Buscar issues do projeto
        project_issues, project_title = fetch_project_issues()
        
        # Buscar todas as issues da organização
        all_issues = fetch_all_org_issues()
        
        # Mesclar as informações
        merged_issues = merge_issues(project_issues, all_issues)
        
        # Gerar e salvar apenas o relatório da organização
        report = generate_report(merged_issues, f"Organização {ORG_NAME}")
        save_report(report, f"relatorio_analitico_{ORG_NAME}.md", relatorios_folder)
        
    except Exception as e:
        print(str(e))