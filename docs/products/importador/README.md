# Importador SIGFAPES

Ferramenta operacional para correcao e importacao de dados do sistema legado SIGFAPES para o ConectaFAPES.

[← Voltar aos Produtos](../README.md)

---

## Sobre o Produto

O Importador e uma ferramenta web operada pela equipe tecnica da FAPES que traz dados de editais, projetos e bolsistas do sistema legado SIGFAPES para o ConectaFAPES. O ciclo completo combina um job Airflow que publica dumps Parquet diarios, um backend FastAPI que gera planilhas XLSX pre-preenchidas, um frontend React com virtual scroll para edicao de 5000+ linhas, um esquema de lock exclusivo com heartbeat para evitar conflitos de edicao concorrente e uma etapa final de geracao de JSONLs consumidos pelos modulos donos do dominio.

| Atributo | Valor |
|----------|-------|
| **Perfis de usuario** | Equipe tecnica (operadores de importacao) |
| **Stack Backend** | Python 3.12, FastAPI + Uvicorn, pandas + pyarrow, xlsxwriter, boto3 |
| **Stack Frontend** | React 18 + TypeScript + Vite, xlsx, react-datepicker |
| **Armazenamento** | S3 (Parquets, JSON, XLSX, JSONL) + Supabase Postgres (locks, auditoria, jobs) |
| **Autenticacao** | Supabase Auth + JWT Bearer com cookies HttpOnly |
| **Orquestracao** | Airflow (DAG SigFapes2Conecta) |
| **Deploy** | Render |
| **Status** | Em operacao |

---

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Arquitetura](architecture.md) | Camadas do backend, fluxo ponta a ponta, modelo de dados, decisoes arquiteturais |
| [Tecnologia](technology.md) | Stack detalhada com versoes, bibliotecas, tecnicas de otimizacao e infra |
| [Integracao](integration.md) | Como o Importador se conecta a modulos, dominios e infraestrutura do ConectaFAPES |
| [Debitos Tecnicos](tech-debt.md) | Gap entre stack atual e stack padrao ConectaFAPES + roadmap de convergencia |
| [Backend](backend-structure.md) | Routers, services, use cases, adapters e feature flags |
| [Frontend](frontend-structure.md) | Paginas, hooks, componentes e virtual scroll |
| [Referencia de API](api-reference.md) | Todos os endpoints com auth, body, erros e exemplos |
| [Setup local](setup.md) | Como rodar backend + frontend em dev |
| [Backlog](backlog.md) | 18 EPICs com User Stories derivados do codigo |

---

## Modulos Backend Consumidos

| Modulo | Funcionalidade |
|--------|---------------|
| [M002](../../implementation/modules/M002-importacao-editais/README.md) | Listagem de editais do dump, correcao colaborativa da planilha e geracao de JSONLs de importacao |
