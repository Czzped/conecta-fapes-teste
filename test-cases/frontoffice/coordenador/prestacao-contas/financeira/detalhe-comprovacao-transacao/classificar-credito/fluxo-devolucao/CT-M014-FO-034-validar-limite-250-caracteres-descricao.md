## ID do Cenário
[CT-M014-FO-034]

## Título
Validar limite de 250 caracteres no campo Descrição da Devolução

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Tela Classificar Crédito (`/coordenador/prestacao-financeira/classificar-credito/:paymentId`)
- Regra Canônica: M014: `RN09` (Limite de tamanho do texto de justificativa)
- Contrato/API: `M014: ClassificarDevolucaoRecurso`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Rota acessada: `/coordenador/prestacao-financeira/classificar-credito/:paymentId`.
- Campo `Classificação` definido como `Devolução`.

## Passo a Passo
1. Clicar no campo `Descrição`.
2. Digitar uma mensagem com exatamente 250 caracteres.
3. Tentar digitar caracteres adicionais além do limite de 250.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/classificar-credito/paymentId_credito_01`
- Texto com 250 caracteres: `Devolução voluntária referente à sobra de recurso de diária referente ao projeto de pesquisa conforme alinhamento prévio com a FAPES e relatório técnico apresentado no período vigente do contrato de outorga número 123456789. Saldo devolvido no prazo.` (250 chars)
- Caracteres excedentes: `12345`

## Resultado Esperado
- Ao atingir 250 caracteres, o contador exibe `250/250 caracteres`.
- O campo bloqueia a entrada de caracteres adicionais, não permitindo ultrapassar o limite estabelecido na interface.

## Tipo de Teste
[ ] Positivo  [ ] Negativo  [x] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
