## ID do Cenário
[CT-M014-FO-098]

## Título
Validar exibição e liberação de ajustes na transação com status Em Revisão na listagem do extrato

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Extrato de Prestação Financeira (`/coordenador/financeira`)
- Regra Canônica: M014: `RN01` / `RI4` (Status de transação devolvida para complementação: EM_REVISAO)
- Contrato/API: `M014: ConsultarExtratoFinanceiro`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação cuja comprovação foi analisada pela FAPES e devolvida com solicitação de parecer de revisão/complementação.

## Passo a Passo
1. Acessar a rota da prestação financeira (`/coordenador/financeira`).
2. Localizar na listagem a transação com pendências de revisão.
3. Observar a exibição do badge de `Status`.
4. Clicar no registro para acessar a tela de detalhe.

## Dados de Entrada
- Rota: `/coordenador/financeira`
- Status Esperado: `Em Revisão` (badge laranja/alerta)

## Resultado Esperado
- A transação exibe o badge de status `Em Revisão`.
- Ao acessar a tela de detalhe, os campos de formulário e anexos voltam a ficar habilitados para edição, permitindo ao coordenador corrigir os apontamentos da FAPES e re-submeter.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
