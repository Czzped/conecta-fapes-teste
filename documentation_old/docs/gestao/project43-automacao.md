---
title: Automacao do Project 43
sidebar_position: 99
---

# Automacao do Project 43

Esta automacao preenche datas do GitHub Project `Conecta Fapes` (`Project 43`) quando um item muda de status.

## Campos gerenciados

- `Area`
- `Data Alvo`
- `Iniciado em`
- `Data de Conclusão`

## Regras automaticas

- Ao mover um item para `In Progress`, a automacao preenche `Iniciado em` apenas se o campo estiver vazio.
- Ao mover um item para `Done`, a automacao grava a data atual em `Data de Conclusão`.
- Ao tirar um item de `Done`, a automacao limpa `Data de Conclusão`.
- Alteracoes em outros campos nao disparam atualizacao.

## Estrutura

O codigo fica em `tools/project43-automation/`:

- `src/index.js`: handler do Cloudflare Worker
- `src/github.js`: integracao com GitHub App e GraphQL
- `src/logic.js`: regras puras de negocio
- `scripts/sync-project-fields.mjs`: cria os campos que faltam no projeto

## Segredos do Worker

Cadastrar no Cloudflare Worker:

- `GITHUB_APP_ID`
- `GITHUB_APP_INSTALLATION_ID`
- `GITHUB_APP_PRIVATE_KEY`
- `GITHUB_WEBHOOK_SECRET`

As variaveis nao sensiveis ficam no `wrangler.jsonc`.

## Bootstrap dos campos

Com um token que tenha acesso ao projeto:

```bash
cd tools/project43-automation
npm install
GITHUB_LEDS=... npm run sync:fields
```

O script cria apenas os campos ausentes:

- `Area`
- `Data Alvo`
- `Iniciado em`
- `Data de Conclusão`

## Deploy

```bash
cd tools/project43-automation
npm install
npx wrangler secret put GITHUB_APP_ID
npx wrangler secret put GITHUB_APP_INSTALLATION_ID
npx wrangler secret put GITHUB_APP_PRIVATE_KEY
npx wrangler secret put GITHUB_WEBHOOK_SECRET
npx wrangler deploy
```

Depois do deploy, configurar o webhook do GitHub App para apontar para a URL do Worker e assinar o evento `projects_v2_item`.

## Validacao recomendada

1. Criar ou selecionar um issue de teste no Project 43.
2. Mover para `In Progress` e verificar `Iniciado em`.
3. Mover para `Done` e verificar `Data de Conclusão`.
4. Voltar para `In Progress` e verificar se `Data de Conclusão` foi limpa e `Iniciado em` foi preservado.
