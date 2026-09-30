## ID do Cenário
[CT-M014-BO-017]

## Título
Visualizar e abrir anexos de contestação de uma compra por Invoice em análise no Backoffice

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Análise de Contestação de Invoice (Backoffice)
- Regra Canônica: M014: `RN08` / `RN10` (Avaliação de recurso/contestação de despesa internacional/Invoice por funcionário FAPES com acesso aos documentos de defesa)
- Contrato/API: `GET api/prestacao-de-contas/projeto/{id}/prestacoes-contas/defesa-prestacao/documentos/{id}/presigned-url`

## Pré-condições
- Usuário autenticado no Portal Admin/Backoffice com perfil de Funcionário/Analista FAPES (`Admin`, `Operador GEPOF` ou `Analista FAPES`).
- Existir uma prestação de contas de compra por Invoice reprovada previamente, que esteja com o status de `Em Análise` após o envio de recurso/contestação pelo Coordenador.
- Pelo menos um documento de defesa ou comprovante anexado na seção de **Contestação**.

## Passo a Passo
1. Acessar o sistema Backoffice em `/admin/prestacao-contas`.
2. Filtrar ou localizar a prestação de contas de compra por Invoice que está em status `Em Análise` (com contestação/recurso enviado).
3. Clicar na prestação de contas para abrir a tela de análise em `/admin/prestacao-contas/analise/:prestacaoId`.
4. Rolar a página até o bloco de **Contestação** (*"Contestação enviada pelo coordenador em resposta à reprovação"*).
5. Localizar o arquivo de defesa/comprovante anexado na lista de anexos da contestação (ex.: `NF-Notebooks.pdf`).
6. Clicar no botão/ícone de ação para abrir ou visualizar o arquivo anexado.

## Dados de Entrada
- Rota Backoffice: `/admin/prestacao-contas/analise/:prestacaoId`
- Perfil: Funcionário / Analista FAPES (Backoffice)
- Tipo de Compra: `Invoice` (Despesa Internacional)
- Status da prestação: `Em Análise` (com recurso/contestação ativo)
- Ação: Clicar no botão de abertura do anexo da contestação

## Resultado Esperado
- O sistema obtém com sucesso a URL temporária de visualização do documento (`presigned-url`) retornando status HTTP 200.
- O arquivo anexado à contestação é aberto em uma nova guia do navegador ou no leitor de documentos sem erros de autorização (sem erro `403 Forbidden`).
- O funcionário da FAPES consegue examinar os documentos de defesa enviados na Invoice para tomar a decisão final (`Validar` ou `Rejeitar` a contestação).

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
