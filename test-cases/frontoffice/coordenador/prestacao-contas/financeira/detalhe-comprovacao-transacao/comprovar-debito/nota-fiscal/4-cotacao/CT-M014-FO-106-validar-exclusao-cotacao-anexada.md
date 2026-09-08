## ID do Cenário
[CT-M014-FO-106]

## Título
Validar exclusão de uma cotação anexada na seção de cotações

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Cotações de Fornecedores)
- Regra Canônica: M014: `RN07` / `RI-COT02` (Exclusão e gerenciamento de OrcamentoFornecedor anexado)
- Contrato/API: `M014: RemoverOrcamentoFornecedor`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Etapa `4. Cotação` visível e expandida.
- Pelo menos 1 cotação (arquivo PDF e metadados de fornecedor, valor e data) previamente anexada.

## Passo a Passo
1. Navegar até a seção `4. Cotação`.
2. Localizar o card ou item da cotação previamente anexada.
3. Clicar no ícone de remoção/exclusão (lixeira) correspondente à cotação.
4. Confirmar a exclusão na modal ou mensagem de confirmação (se solicitada).
5. Inspecionar o estado da seção `4. Cotação`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Cotação selecionada para exclusão: `Orcamento_Fornecedor_01.pdf` (Fornecedor: `FAST SHOP` | Valor: `R$ 5.854,83`)
- Ação: Clicar no botão/ícone de exclusão (lixeira) e confirmar

## Resultado Esperado
- A cotação selecionada é removida do painel da seção `4. Cotação`.
- O arquivo e seus dados associados são descartados e o slot do orçamento retorna ao estado pendente de anexação.
- O sistema exibe notificação de sucesso informando a remoção da cotação.
- Se a quantidade total de cotações ativas ficar abaixo de 3 (para itens acima do limite), a validação de envio de cotações permanece pendente.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
