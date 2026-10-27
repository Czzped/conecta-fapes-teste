## Título
[Bug] Tela de documentos do bolsista confia em query param (?status=REPROVADA) para ocultar botões de ação reexibindo aprovação/reprovação se o parâmetro for removido

## ID
BUG-M009-BO-NIV-001

## Requisito/Regra Violada
- Regra Canônica: `M009: RN05` (Tratamento de Reprovação e Preservação de Histórico), Heurística de Nielsen #1 (Visibilidade do Status do Sistema) e Princípio de Integridade de Estado (a interface deve derivar permissões e visibilidade de ações do status canônico da entidade no backend, não de parâmetros voláteis de consulta na URL).
- Caso de Teste Relacionado: [CT-M009-BO-002](../CT-M009-BO-002-reprovar-solicitacao-alteracao-nivel-mantendo-origem-ativa.md) (Issue https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/726).
- Rota/Componente: `/gestao-bolsa/documentos-bolsista/{idAlocacao}` / Backoffice Admin UI
- Endpoint da API: `GET /api/solicitacoes-alteracao-nivel/...` / `GET /api/alocacoes/...`

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows / Navegador Web (Chrome/Edge) / Backoffice Vue/Nuxt Admin UI

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [x] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar `/gestao-bolsa/visualizar-pendencias` e localizar uma solicitação de alteração de nível em análise.
2. Acessar a tela de avaliação de documentos e reprovar a solicitação preenchendo justificativa obrigatória e confirmando a ação.
3. Na listagem de pendências, pesquisar pelo bolsista e clicar no ícone de visualização (olho verde) da solicitação que agora consta com status de avaliação `Reprovada`.
4. Observar que a URL aberta contém o query param:
   `https://admin.conectafapes.hom.es.gov.br/gestao-bolsa/documentos-bolsista/{id}?status=REPROVADA`
5. Observar que nesta rota a tela renderiza corretamente em modo somente leitura (exibe a tarja vermelha de atenção informando que a solicitação foi reprovada e oculta os botões de ação).
6. Na barra de endereços do navegador, apagar manualmente o trecho final `?status=REPROVADA` (ficando apenas `.../documentos-bolsista/{id}`) e pressionar Enter para recarregar a página.
7. Rolar a página até o rodapé e inspecionar a seção de botões de ação.

## Dados de Entrada
- Rota com query param (somente leitura):
  `https://admin.conectafapes.hom.es.gov.br/gestao-bolsa/documentos-bolsista/8dc8a5b4-1bcc-4583-19c0-08df33838e85?status=REPROVADA`
- Rota sem query param (com falha de estado):
  `https://admin.conectafapes.hom.es.gov.br/gestao-bolsa/documentos-bolsista/8dc8a5b4-1bcc-4583-19c0-08df33838e85`

## Comportamento Esperado
- O componente de visualização de documentos deve utilizar como **fonte da verdade** o status canônico retornado pela API na resposta JSON (`destino.status === 'REPROVADA'` ou `trocaNivel.emCurso.status === 'REPROVADA'`).
- Independentemente de haver ou não parâmetros adicionais na URL (`?status=...`), a tela deve permanecer estritamente em **modo somente leitura**, mantendo a tarja informativa de reprovação e os botões de `Implementar Bolsa` e `Reprovar Solicitação` permanentemente ocultos para registros já finalizados.

## Comportamento Atual
- O frontend confia unicamente no query param `?status=REPROVADA` para travar o formulário e exibir o banner de reprovação.
- Ao remover o parâmetro da URL ou abrir o link direto da alocação sem a query string, a interface perde o estado de reprovação e renderiza novamente os botões **`Reprovar Solicitação`** e **`Implementar Bolsa`**, além de reexibir checkboxes desmarcados na seção de requisitos declaratórios, induzindo o analista a erro ou permitindo reenvio de ações sobre um registro já liquidado.

## Evidências

### Cenário A: Comportamento com a Query String (?status=REPROVADA) — Modo Leitura Ativo
- 📷 Tela renderiza corretamente a tarja vermelha e omite botões de mutação:
![Modo Leitura com Query Param](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/backoffice/admin/bolsistas/alterar-nivel-bolsa/evidencias/evidencia-CT-BO-002-04-modo-somente-leitura-status-reprovada.png)

### Cenário B: Falha após Remoção Manual do Parâmetro da URL — Reexibição Indevida de Ações
- 📷 URL limpa sem query param exibe novamente os botões de Reprovar Solicitação e Implementar Bolsa:
![Botões Reexibidos sem Query Param](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/backoffice/admin/bolsistas/alterar-nivel-bolsa/evidencias/evidencia-BUG-BO-NIV-001-01-remocao-parametro-url-reexibe-botoes.png)

## Impacto no Negócio
- **Quebra de Persistência e Rastreabilidade:** Links compartilhados entre analistas, históricos de navegação ou atualizações de página (F5) sem o parâmetro na URL exibem um estado enganoso da alocação.
- **Risco de Ambiguidade e Conflito de Ações:** Abre brecha para que o operador tente submeter novas avaliações ou implementações em uma alocação cujo ciclo de vida já foi indeferido.
