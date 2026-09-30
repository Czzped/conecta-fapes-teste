## ID do Cenário
[CT-M014-BO-017]

## Título
Conferência de múltiplos anexos de Invoice e Comprovante de Fatura do Cartão de Crédito no Backoffice

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Análise de Prestação de Contas (Backoffice)
- Regra Canônica: M014: `RN08` / `RI-INV01` (Exibição e conferência completa de todos os documentos fiscais enviados pelo Coordenador na prestação de Invoice)
- Contrato/API: `M014: ObterDetalhesPrestacaoInvoice`

## Pré-condições
- Usuário autenticado com o perfil de Analista/Funcionário FAPES (`Admin` / `Operador GEPOF`).
- Existir uma prestação de contas de **Invoice** com status `Em Análise` na qual o Coordenador enviou tanto o documento de Invoice quanto o comprovante da Fatura do Cartão.

## Passo a Passo
1. Acessar o sistema Backoffice (`/admin`) com o perfil de Funcionário/Analista FAPES.
2. Abrir a lista de análise de prestação de contas e selecionar a prestação de Invoice.
3. Navegar até a **Seção 2 (Invoice - Pagamento Internacional)**.
4. Verificar se ambos os arquivos (Invoice e Comprovante da Fatura do Cartão) estão listados para conferência.
5. Clicar nos botões de visualização para conferir os dois documentos.

## Dados de Entrada
- Rota: `/admin/prestacao-contas/analise/:prestacaoId`
- Perfil: Analista / Funcionário FAPES (Backoffice)

## Resultado Esperado
- O Backoffice exibe tanto o documento principal do Invoice quanto o comprovante da fatura do cartão anexado.
- O Analista FAPES consegue abrir/baixar ambos os arquivos para validar a compra e a cotação internacional.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
