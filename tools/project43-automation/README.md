# Project 43 automation

Cloudflare Worker que reage ao webhook `projects_v2_item` do GitHub App e atualiza datas do Project 43 da organizacao `leds-conectafapes`.

## O que ele faz

- cria os campos ausentes do projeto via script
- preenche `Iniciado em` ao entrar em `In Progress`
- preenche `Data de Conclusão` ao entrar em `Done`
- limpa `Data de Conclusão` quando o item sai de `Done`

## Comandos

```bash
npm install
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
