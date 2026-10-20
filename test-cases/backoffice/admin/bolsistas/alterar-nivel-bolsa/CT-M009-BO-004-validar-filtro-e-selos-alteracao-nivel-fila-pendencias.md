## ID do Cenário
[CT-M009-BO-004]

## Título
Validar filtro segmentado, indicadores e selos visuais de alteração de nível na fila de pendências do backoffice

## Requisito/História Relacionada
- Requisito/Issue: https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/714 (Feature: https://github.com/leds-conectafapes/conectafapes-project/issues/2550, Subtarefa: #3024)
- Regra Canônica: M009: Visualização e triagem de solicitações de bolsas pela Área Técnica FAPES
- Contrato/API: `GET /api/pendencias/bolsistas`

## Pré-condições
- Usuário autenticado com o perfil `analista_fapes` ou `administrador`.
- Existem solicitações pendentes de tipos variados: bolsas novas regulares e pelo menos duas alterações de nível (uma de promoção e uma de rebaixamento).

## Passo a Passo
1. Acessar o Portal Admin e navegar até `Gestão de Bolsistas › Visualizar Pendências` (`/gestao-bolsa/visualizar-pendencias`).
2. Verificar os cards de indicadores de topo (`InfoCard.vue`):
   - Conferir se o indicador "Alterações de nível na fila" exibe a contagem correta de solicitações de troca pendentes.
3. Inspecionar o controle segmentado de filtro acima da lista:
   - Opções: `Todas`, `Bolsa nova`, `Alteração de nível`, com suas respectivas contagens.
4. Clicar na aba/filtro `Alteração de nível`.
5. Inspecionar os cards da listagem filtrada:
   - Verificar a presença do selo roxo `Alteração de nível` abaixo do nome do bolsista.
   - Na coluna `Modalidade`, verificar a exibição formatada: `NÍVEL ATUAL` (riscado) → `NOVO NÍVEL` (destaque roxo).
   - Verificar o sentido da alteração indicado abaixo do nível: "Nível superior" (↑) ou "Nível inferior" (↓).
6. Alternar o filtro para `Bolsa nova` e confirmar que apenas bolsas com selo cinza neutro "Bolsa nova" são exibidas.
7. Alternar o filtro para `Todas` e verificar a exibição mista completa.

## Dados de Entrada
- Rota: `/gestao-bolsa/visualizar-pendencias`
- Filtros testados: `Alteração de nível`, `Bolsa nova`, `Todas`

## Resultado Esperado
- O filtro segmentado aplica a filtragem reativa instantânea sem recarregar a página inteira.
- Ao selecionar `Alteração de nível`, a lista exibe exclusivamente as solicitações originadas de troca de nível.
- O card de cada pendência apresenta o selo roxo com ícone de setas ↑↓, a transição clara entre os níveis com texto riscado no antigo e o sentido (superior/inferior).
- Nenhuma colisão visual ocorre com outros selos existentes (como chips de status ou selo SIGFAPES).
- O indicador de topo reflete com precisão o volume de alterações em análise.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
