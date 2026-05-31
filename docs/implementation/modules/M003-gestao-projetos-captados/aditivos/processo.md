# Processo - Consulta de Aditivos da Projeto

[← Voltar](README.md)

## Fluxo no Front-Office

1. O usuario acessa **Meu Projeto**.
2. O sistema exibe o bloco **Vigencia e aditivos** acima do **Ciclo de Fomento**.
3. Na aba **Resumo**, o sistema apresenta data inicial, data final vigente e indicadores de aditivo de tempo e financeiro.
4. Na aba **Dados dos aditivos**, o sistema apresenta data de aprovacao original e orcamento original.
5. Se existirem aditivos, o sistema lista os registros vinculados ao projeto.
6. Se nao existirem aditivos, o sistema apresenta estado vazio.

## Fluxo em Projetos

1. O usuario acessa o detalhe de um projeto.
2. O sistema disponibiliza acesso consultivo aos dados de aditivos.
3. O usuario consulta os aditivos existentes, respeitando permissoes do perfil.

## Estados de interface

| Estado | Comportamento |
|--------|---------------|
| Sem aditivos | Exibir data de aprovacao original, orcamento original e estado vazio |
| Com aditivo de tempo | Exibir impacto de prazo, data anterior e data aditada |
| Com aditivo financeiro | Exibir valor aditivado e documento de referencia quando disponivel |
| Com aditivo de tempo e financeiro | Exibir impacto de prazo e valor no mesmo registro |
