## ID do Cenário
[CT-M014-BO-015]

## Título
Visualizar e baixar arquivos de orçamentos/cotações na análise de prestação de contas no Backoffice

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Análise de Prestação de Contas (Backoffice)
- Regra Canônica: M014: `RN08` / `RI-INV01` (Acesso e download de documentos de cotação por Analistas FAPES durante a avaliação de prestações em análise)
- Contrato/API: `M014: ObterDocumentoCotacao`

## Pré-condições
- Usuário autenticado com o perfil de Analista/Funcionário FAPES (`Admin` / `Operador GEPOF`).
- Existir uma prestação de contas de **Invoice** ou **Nota Fiscal** com status `Em Análise` contendo cotações/orçamentos anexados na Seção 5.

## Passo a Passo
1. Acessar o sistema Backoffice (`/admin`) com o perfil de Funcionário/Analista FAPES.
2. Navegar para a lista de análise de prestação de contas e abrir uma prestação sob a modalidade **Invoice** ou **Nota Fiscal** com o status `Em Análise`.
3. Rolar a página até a **Seção 5 (Cotação)**, onde estão listados os orçamentos enviados pelo Coordenador.
4. Clicar no ícone de visualização (olho) ao lado do arquivo de cotação desejado.

## Dados de Entrada
- Rota: `/admin/prestacao-contas/analise/:prestacaoId`
- Perfil: Analista / Funcionário FAPES (Backoffice)

## Resultado Esperado
- O sistema processa a requisição e abre o arquivo PDF/imagem da cotação selecionada em uma nova aba do navegador ou exibe no modal de preview de documentos.
- O analista da FAPES consegue conferir as informações do orçamento para avaliação da despesa.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
