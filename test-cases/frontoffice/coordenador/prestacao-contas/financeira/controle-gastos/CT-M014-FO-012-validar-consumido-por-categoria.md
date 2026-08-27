## ID do Cenário
[CT-M014-FO-012]

## Título
Validar listagem de Total Consumido por Categoria

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, seção Controle de Gastos.
- M013: RN06 / RN09 / RN11 / RI-SLD1 (`RubricaProjeto` e despesas executadas).
- M014: `ConsultarPrestacaoContas`.

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado com despesas executadas em rubricas distintas (ex.: Material Permanente: R$ 200.000,00; Material de Consumo: R$ 31.606,15; Passagem: R$ 31.606,15; Diária: R$ 0,00; Pessoal: R$ 0,00).

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Aguardar o carregamento da página.
3. Localizar a seção `Controle de Gastos`.
4. Inspecionar a coluna `Total Consumido por Categoria`.

## Dados de Entrada
- Perfil: `coordenador`.
- Rubricas e valores consumidos:
  - Material Permanente: R$ 200.000,00
  - Material de Consumo: R$ 31.606,15
  - Passagem: R$ 31.606,15
  - Diária: R$ 0,00
  - Pessoal: R$ 0,00

## Resultado Esperado
- A coluna exibe o título `Total Consumido por Categoria`.
- Cada rubrica cadastrada no projeto é listada com seu respectivo nome e valor total gasto formatado em moeda brasileira.
- Rubricas sem gastos realizados até o momento são exibidas com o valor `R$ 0,00`.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
