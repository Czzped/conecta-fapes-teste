---
name: qa-conecta-fapes
description: Cria relatos de bug (BUG-*.md) e casos de teste (CT-*.md) do Conecta FAPES na pasta test-cases/ do repositório, seguindo os templates de test-cases/referencias, faz o commit local e, após confirmação, abre a Issue no GitHub da FAPES e vincula ao Project 46. Use sempre que o usuário (QA) descrever um defeito, pedir para "abrir bug", "relatar bug", "criar caso de teste", "criar CT", "escrever cenário de teste" ou anexar prints/vídeos de um comportamento errado no Frontoffice ou Backoffice do Conecta FAPES, mesmo que não cite a palavra "skill", "issue" ou "template".
---

# QA Conecta FAPES — Bugs e Casos de Teste

Orquestra o fluxo de QA: **interpretar o pedido → localizar a pasta → gerar o arquivo → commit local → (com confirmação) Issue + Project 46**.

Esta skill NÃO duplica regras. Os templates, o mapa de telas e o dicionário de domínio vivem no repositório do projeto e devem ser lidos na hora, para que exista uma única fonte de verdade. Se algo aqui divergir deles, o repositório vence.

## 0. Localizar o repositório

Trabalhe a partir do workspace atual. Confirme que existe `test-cases/MAPA-QA-GLOBAL.md`; se não existir, avise o usuário e pare (esta skill só serve ao projeto Conecta FAPES).

## 1. Regras inegociáveis

- Repositórios de código (ex.: `leds-conectafapes-frontoffice-frontend-develop/`) são **somente leitura**. Inspecione, nunca altere. O motivo: QA documenta, não corrige.
- Escreva apenas dentro de `test-cases/`.
- Não declare bug só por impressão visual: valide contra regra canônica (`RNxx`/`RIxx`) ou protótipo.
- Não proponha causa raiz como fato; use a seção `Sugestão de Investigação` como hipótese.
- Use apenas os termos do domínio (`Prestacao`, `JustificativaDespesa`, `TransacaoFinanceira`, `RubricaProjeto`, `DocumentoFiscal`, ...).
- **Nunca faça `git push`.** O usuário faz push manualmente.
- **Nunca crie a Issue sem confirmação explícita** do usuário (ela é visível aos desenvolvedores da FAPES).

## 2. Decidir o tipo

- Descrição de comportamento errado / evidência de falha → **Bug**.
- Pedido de cenário, cobertura ou validação planejada → **Caso de Teste**.
- Se ambíguo, pergunte em uma frase.

## 3. Leitura mínima (economia de tokens)

1. Leia `test-cases/MAPA-QA-GLOBAL.md` (tela, rota, módulo, regras, pasta de CT, pasta de bugs, prefixo de ID, nomenclatura da seção 5).
2. Leia o manual do tipo escolhido:
   - Bug: `test-cases/referencias/instrucoes-ia-relato-de-bug.md` + `estrutura-criacao-de-bug.md`
   - CT: `test-cases/referencias/instrucoes-ia-casos-de-teste.md` + `criacao-dos-cenarios-de-teste.md`
3. Se existir `AGENTS.md` na pasta de destino ou em pai dela (ex.: `prestacao-contas/AGENTS.md`), leia: traz limites de escopo e fontes de verdade específicas.
4. Só se necessário: trecho (por intervalo de linhas) de `docs/implementation/modules/M0xx/README.md` para a regra citada, e o componente/schema Zod relevante no código (somente leitura).

Não liste diretórios recursivamente nem leia documentos inteiros.

## 4. Gerar o arquivo

- Use o template do manual **integralmente**, sem introduções no arquivo.
- Título de bug começa com `[Bug]`. Título de CT: ação no infinitivo + resultado esperado.
- Se o usuário não informar a gravidade, o ambiente ou o dispositivo, **infira o que for evidente** (ex.: homologação) e marque como "a confirmar" o que não for; não invente.
- Dados de entrada devem permitir repetir o teste.

### ID e nome do arquivo

Padrões na seção 5 do MAPA. O número sequencial é calculado assim:

1. Monte o prefixo (ex.: `BUG-M014-FO-PAS-` ou `CT-M014-FO-`).
2. Busque esse prefixo em **todo** `test-cases/` (nomes de arquivo e conteúdo do campo ID).
3. Use `maior número + 1`, com 3 dígitos. Sem ocorrências: `001`.
4. Slug: curto, minúsculo, sem acentos, separado por hífen. Arquivo: `<ID>-<slug>.md`.

Cuidado: algumas pastas existentes têm nomes irregulares (ex.: `bugs/nota fiscal/`). Reaproveite a pasta existente, não crie variantes.

### Local

- CT: pasta de testes da tela indicada no MAPA.
- Bug: sempre na subpasta `bugs/` do fluxo (conforme coluna "Pasta de Bugs" do MAPA).

### Evidências (bugs)

Se o usuário anexar prints/vídeos, copie-os para a mesma pasta `bugs/` com nomes descritivos e referencie por caminho relativo na seção `Evidências` (ex.: `![descrição](evidencia-x.png)`). Sem anexo, deixe a seção com `Pendente de anexo`.

## 5. Commit local

Faça `git add` apenas dos arquivos criados/alterados nesta tarefa e `git commit` com mensagem convencional, por exemplo:

- `test(bug): BUG-M014-FO-PAS-009 <resumo curto>`
- `test(ct): CT-M014-FO-071 <resumo curto>`

Ao final, informe que há commit local pendente de push.

## 6. Issue no GitHub (somente após confirmação)

Mostre ao usuário: ID, caminho do arquivo e título da Issue, e pergunte se pode criar. Se confirmar:

```bash
gh issue create --repo leds-conectafapes/leds-conectafapes-prestacao-de-contas --title "<Título>" --body-file <arquivo.md>
gh project item-add 46 --owner leds-conectafapes --url <URL_DA_ISSUE>
```

- Título de bug mantém `[Bug]`. Corpo = conteúdo do `.md`. Evidências em imagem não renderizam por caminho relativo na Issue: avise o usuário para anexá-las manualmente na Issue e entregue o link.
- Se o `gh` falhar (autenticação, permissão), reporte o erro e não repita às cegas.

## 7. Resposta final (curta)

Liste: arquivo(s) criado(s) (links), commit feito (hash), link da Issue (se criada) e pendências (push, anexos, campos "a confirmar").
