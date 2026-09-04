## ID do Cenário
[CT-M014-FO-105]

## Título
Submeter e confirmar envio das cotações de fornecedores preenchidas com sucesso

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Nota Fiscal)
- Regra Canônica: M014: `RN07` / `RI-COT01` (Envio e validação do lote de cotações para itens de valor superior a R$ 1.400,00)
- Contrato/API: `M014: EnviarCotacoesFornecedor` (`POST /api/prestacao-de-contas/orcamento-fornecedor/batch`)

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Item da Nota Fiscal com valor total superior a R$ 1.400,00 associado na Seção 3.
- As 3 cotações de fornecedores anexadas, preenchidas (`Fornecedor`, `Valor`, `Data`) e confirmadas na Seção 4.
- Cotação de menor valor (ou selecionada) devidamente marcada via radio button.

## Passo a Passo
1. Acessar `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId`.
2. Navegar até a seção `4. Cotação`.
3. Verificar se as 3 cotações anexadas exibem o status de confirmadas (`Anexar Cotação 3/3`).
4. Conferir a seleção do radio button no card da cotação de menor valor.
5. Clicar no botão ciano `Enviar cotações` no canto inferior direito da seção 4.
6. Aguardar o processamento e a resposta do sistema.

## Dados de Entrada
- Rota: `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId`
- Cotação 1: `CENTRAL FORROS E DIVISÓRIAS LTDA` | Valor: `R$ 950,00` | Data: `01/09/2026` (Selecionada)
- Cotação 2: `FORNECEDOR SECUNDÁRIO` | Valor: `R$ 1.123,00` | Data: `01/09/2026`
- Cotação 3: `FAST DRYWALL SERRA MATERIAIS DE CONSTRUCAO LTDA` | Valor: `R$ 463,31` | Data: `01/09/2026`
- Botão: `Enviar cotações`

## Resultado Esperado
- A requisição de envio do lote de cotações é processada pelo servidor com status `200 OK`.
- É exibida a mensagem/toast de confirmação de sucesso: *"Cotações salvas com sucesso."* (ou equivalente).
- A seção `4. Cotação` é concluída, desabilitando edições adicionais e permitindo prosseguir para o envio final da comprovação de débito.
- Nenhum erro de comunicação HTTP (400/500) ou exceção no console JavaScript é disparado.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa