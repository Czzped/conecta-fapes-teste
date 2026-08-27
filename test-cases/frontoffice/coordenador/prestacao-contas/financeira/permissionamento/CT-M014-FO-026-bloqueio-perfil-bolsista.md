## ID do Cenário
[CT-M014-FO-026]

## Título
Bloquear acesso à prestação financeira para perfil Bolsista / Participante sem permissão

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, autorização por perfil (RBAC).
- Arquitetura: 03 — Acesso e Segurança (Princípio do Menor Privilégio e OpenFGA).
- M006: Autorização / M009: Bolsista.

## Pré-condições
- Usuário autenticado via Acesso Cidadão com o perfil de `bolsista` ou `pesquisador participante` (sem papel de coordenação de projeto).

## Passo a Passo
1. Autenticar no portal com credenciais do perfil `bolsista`.
2. Tentar acessar diretamente a rota `/coordenador/prestacao-financeira` via navegação ou barra de endereços.

## Dados de Entrada
- Perfil: `bolsista`.
- Rota solicitada: `/coordenador/prestacao-financeira`.

## Resultado Esperado
- O sistema intercepta o acesso e impede a visualização da tela de prestação de contas financeira.
- É retornada uma resposta de acesso não autorizado (HTTP 403 Forbidden ou página personalizada de "Acesso Negado / Sem Permissão").
- Nenhum dado bancário, extrato ou saldo do projeto é exposto ao usuário.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
