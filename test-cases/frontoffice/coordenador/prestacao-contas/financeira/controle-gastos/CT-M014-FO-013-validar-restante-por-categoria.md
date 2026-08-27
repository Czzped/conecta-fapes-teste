## ID do Cenário
[CT-M014-FO-013]

## Título
Validar listagem de Total Restante por Categoria

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, seção Controle de Gastos.
- M013: RN06 / RN08 / RN10 / RI-SLD1 (`RubricaProjeto` e saldo disponível).
- M014: `ConsultarPrestacaoContas`.

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado com saldos remanescentes em rubricas distintas (ex.: Material Permanente: R$ 80.000,00; Material de Consumo: R$ 12.642,46; Passagem: R$ 12.642,46; Diária: R$ 0,00; Pessoal: R$ 0,00).

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Aguardar o carregamento da página.
3. Localizar a seção `Controle de Gastos`.
4. Inspecionar a coluna `Total Restante por Categoria`.

## Dados de Entrada
- Perfil: `coordenador`.
- Rubricas e saldos restantes:
  - Material Permanente: R$ 80.000,00
  - Material de Consumo: R$ 12.642,46
  - Passagem: R$ 12.642,46
  - Diária: R$ 0,00
  - Pessoal: R$ 0,00

## Resultado Esperado
- A coluna exibe o título `Total Restante por Categoria`.
- Cada rubrica é listada com seu respectivo saldo disponível formatado em moeda brasileira.
- O saldo restante de cada rubrica somado ao total consumido corresponde exatamente ao valor total aprovado para aquela rubrica (`Total = Consumido + Restante`).

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
