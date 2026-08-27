## ID do Cenário
[CT-M014-FO-007]

## Título
Validar campo Total do orçamento aprovado

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, seção Controle de Gastos.
- M013: RN06 / RN09 / RI-SLD1 (orçamento aprovado e snapshot de rubricas).
- M014: `ConsultarPrestacaoContas`.

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado no contexto do portal com orçamento global aprovado de R$ 100.000,00.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Aguardar o carregamento da página.
3. Localizar a seção `Controle de Gastos`.
4. Inspecionar o campo `Total:` exibido abaixo da barra de progresso no card.

## Dados de Entrada
- Perfil: `coordenador`.
- Orçamento Global Aprovado: R$ 100.000,00.

## Resultado Esperado
- A seção exibe o texto com o total geral aprovado do projeto no formato `Total: R$ 100.000` (ou `Total: R$ 100.000,00`).
- O valor apresentado corresponde exatamente ao total contratado no Termo de Outorga / soma das dotações orçamentárias aprovadas para as rubricas do projeto.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
