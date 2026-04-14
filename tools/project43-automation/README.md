# Project 43 automation

Cloudflare Worker em TypeScript que reage ao webhook `projects_v2_item`
do GitHub App e atualiza as datas do Project 43 da organizacao
`leds-conectafapes`.

## O que ele faz

- cria os campos ausentes do projeto via script
- preenche `Iniciado em` ao entrar em `In Progress`
- preenche `Data de Conclusao` ao entrar em `Done`
- limpa `Data de Conclusao` quando o item sai de `Done`

## Estrutura

- `src/app`: ponto de entrada do worker e orquestracao do webhook
- `src/config`: leitura e validacao de configuracao
- `src/domain`: regras de negocio da automacao
- `src/github`: autenticacao, GraphQL e acesso ao Project
- `src/project`: sincronizacao e definicao dos campos gerenciados
- `scripts`: comandos operacionais
- `test`: testes unitarios

## Comandos

```bash
npm install
npm run typecheck
npm test
npm run sync:fields
```

## Variaveis

### `wrangler.jsonc`

- `GITHUB_ORG`
- `GITHUB_PROJECT_ID`
- `GITHUB_PROJECT_NUMBER`
- `STATUS_FIELD_NAME`
- `STARTED_AT_FIELD_NAME`
- `DONE_AT_FIELD_NAME`
- `IN_PROGRESS_OPTION_NAME`
- `DONE_OPTION_NAME`

### Segredos

- `GITHUB_APP_ID`
- `GITHUB_APP_INSTALLATION_ID`
- `GITHUB_APP_PRIVATE_KEY`
- `GITHUB_WEBHOOK_SECRET`
