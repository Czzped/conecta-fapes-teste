## ID do Cenário
[CT-M014-FO-027]

## Título
Bloquear acesso de Coordenador a dados financeiros de projeto no qual não possui vínculo

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, autorização contextual (ABAC).
- Arquitetura: 03 — Acesso e Segurança (Zero Trust e isolamento de dados por projeto via OpenFGA).
- M006: Autorização contextual / M014: `ConsultarPrestacaoContas`.

## Pré-condições
- Usuário autenticado como Coordenador A (responsável exclusivamente pelo Projeto 101).
- Existe no sistema o Projeto 202, cujo coordenador outorgado é o Coordenador B.

## Passo a Passo
1. Autenticar no portal como Coordenador A.
2. Tentar forçar o acesso ou alterar os parâmetros da requisição para carregar a prestação financeira do Projeto 202 (`/coordenador/prestacao-financeira?projetoId=202`).

## Dados de Entrada
- Usuário: Coordenador A.
- Contexto de Projeto Alvo: Projeto 202 (não pertencente ao Coordenador A).

## Resultado Esperado
- O motor de autorização contextual (OpenFGA / PEP) valida a relação `usuario:coordenador_A -> coordenador_de -> projeto:202` e identifica ausência de vínculo.
- A requisição é rejeitada com erro de autorização (HTTP 403 Forbidden).
- A aplicação impede o carregamento e não vaza nenhuma informação do extrato ou orçamento do Projeto 202.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
