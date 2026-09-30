## ID do Cenário
[CT-M014-BO-016]

## Título
Visualizar e baixar anexos de defesa na seção de Contestação de prestação de contas no Backoffice

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Análise de Contestação / Defesa (Backoffice)
- Regra Canônica: M014: `RN10` / `RN08` (Avaliação de recurso/contestação enviada pelo Coordenador com análise obrigatória de justificativa e documentos de defesa anexados)
- Contrato/API: `M014: ObterAnexoContestacao`

## Pré-condições
- Usuário autenticado com o perfil de Analista/Funcionário FAPES (`Admin` / `Operador GEPOF`).
- Existir uma prestação de contas reprovada com contestação enviada pelo Coordenador contendo documento de defesa anexado.

## Passo a Passo
1. Acessar o sistema Backoffice (`/admin`) com o perfil de Funcionário/Analista FAPES.
2. Navegar para a lista de análise de prestação de contas e abrir uma prestação com o status de contestação.
3. Rolar a página até a seção **Contestação**.
4. Clicar no ícone de visualização (olho) ou no link do arquivo de defesa anexado (ex.: `NF-Notebooks.pdf`).

## Dados de Entrada
- Rota: `/admin/prestacao-contas/analise/:prestacaoId`
- Perfil: Analista / Funcionário FAPES (Backoffice)

## Resultado Esperado
- O sistema abre o documento anexado na contestação em uma nova guia do navegador ou exibe o preview do PDF.
- O analista consegue avaliar o documento de defesa para decidir entre as opções `Validar` ou `Rejeitar`.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
