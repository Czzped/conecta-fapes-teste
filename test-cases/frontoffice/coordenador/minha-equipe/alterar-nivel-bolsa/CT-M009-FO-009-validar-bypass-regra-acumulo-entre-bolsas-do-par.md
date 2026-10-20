## ID do Cenário
[CT-M009-FO-009]

## Título
Validar bypass pareado da regra de não acúmulo de bolsas com validação de bolsas externas

## Requisito/História Relacionada
- Requisito/Issue: https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/714 (Feature: https://github.com/leds-conectafapes/conectafapes-project/issues/2550, Subtarefa: #2675)
- Regra Canônica: M009: RI1 (Regra de não acúmulo de bolsas), Bypass pareado no servidor via `alocacaoSubstituidaId`
- Contrato/API: `POST /api/alocacoes-bolsistas/{id}/alterar-nivel` e endpoint de pré-checagem de acúmulo

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Cenário A: Bolsista possui apenas a bolsa ativa do projeto em questão.
- Cenário B: Bolsista possui a bolsa ativa do projeto E uma segunda bolsa ativa concomitante em outro edital/projeto (não acumulável).

## Passo a Passo
1. **Executar Cenário A (Bypass do par legítimo):**
   - Abrir os Detalhes do bolsista que possui apenas a bolsa atual.
   - Abrir o modal `Alterar Nível da Bolsa`, preencher novo nível e data de início.
   - Confirmar a solicitação.
   - Observar o processamento da regra de acúmulo.
2. **Executar Cenário B (Bloqueio por bolsa externa não acumulável):**
   - Abrir os Detalhes do bolsista que possui outra bolsa externa incompatível.
   - Tentar submeter alteração de nível.
   - Observar a validação da regra de acúmulo.

## Dados de Entrada
- Bolsista CPF Cenário A: `111.222.333-44` (sem vínculos externos adicionais)
- Bolsista CPF Cenário B: `555.666.777-88` (com bolsa ativa não acumulável no projeto Y)
- Novo Nível: `BPIG-I`
- Data de Início: `01/11/2026`

## Resultado Esperado
- **Cenário A:** O backend aplica o bypass da regra de acúmulo exclusivamente para a bolsa de origem associada ao par (`alocacaoSubstituidaId` resolvido internamente pelo servidor, e não fornecido no payload da requisição). A criação da bolsa nova é permitida sem erro de acúmulo.
- **Cenário B:** O bypass pareado NÃO isenta o bolsista de checagens contra bolsas terceiras. A existência da bolsa externa incompatível dispara a violação de RI1, bloqueando a solicitação com erro: "O bolsista possui outra bolsa ativa incompatível e não pode assumir nova alocação."

## Tipo de Teste
[x] Positivo  [x] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
