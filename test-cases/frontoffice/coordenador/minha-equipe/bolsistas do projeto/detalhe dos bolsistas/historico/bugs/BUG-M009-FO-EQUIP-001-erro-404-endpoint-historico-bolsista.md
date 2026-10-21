## Título
[Bug] Falha no carregamento do histórico do bolsista com erro HTTP 404 no endpoint de histórico por pessoaId

## ID
BUG-M009-FO-EQUIP-001

## Requisito/Regra Violada
- Fluxo/Contexto: Minha Equipe — **Bolsistas do Projeto > Detalhes do Bolsista > Aba Histórico**
- Regra Canônica:
  - M009: Rastreabilidade e consulta ao ciclo de vida e movimentações da bolsa/bolsista (`Indicação`, `Aceite`, `Documentação`, `Vigência`, `Renovação` e `Encerramento`)
  - M007 / M009: Contrato de API para consultas de eventos e histórico de membros vinculados ao projeto
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #1 (Visibilidade do Status do Sistema)**: O sistema exibe um aviso amarelo superficial (*"Parte do histórico não pôde ser carregada."*) seguido do estado vazio (*"Nenhum evento no histórico - As movimentações desta solicitação aparecerão aqui."*), mascarando uma falha de indisponibilidade/inexistência de endpoint (HTTP 404 Not Found) e induzindo o usuário a acreditar que não existem eventos para aquele bolsista.
  - **Heurística #9 (Ajudar usuários a reconhecer, diagnosticar e recuperar-se de erros)**: Falha silenciosa da API que não oferece mecanismo de nova tentativa ou explicação adequada da indisponibilidade.
- Casos de Teste Relacionados:
  - *(Ausente no repositório)*: Não há caso de teste mapeado para a aba Histórico do Bolsista em `test-cases/frontoffice/coordenador/minha-equipe/bolsistas do projeto/detalhe dos bolsistas/historico/`. Recomenda-se a criação do caso de teste canônico `CT-M009-FO-001` (Visualizar histórico de movimentações e eventos do bolsista).
- Rota/Componente: `/coordenador/minha-equipe` (Página de Detalhes do Bolsista / Componente da aba `Histórico`)
- Endpoint afetado: `GET /api/portalfapes/delegacao/projeto/:projetoId/historico?pessoaId=:pessoaId`

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Desktop (1920×1080) / Chrome DevTools / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o Frontoffice com perfil de Coordenador no Ambiente de Homologação.
2. No menu lateral de navegação, clicar em `Minha Equipe` e selecionar `Bolsistas do Projeto`.
3. Na listagem de bolsistas vinculados ao projeto, selecionar um bolsista ativo (ex.: `Andre Sarmento Spalenza`) para abrir a tela de Detalhes.
4. Na tela de Detalhes, navegar até a aba `Histórico`.
5. Abrir as Ferramentas do Desenvolvedor (`F12`), nas abas Console e Rede (Network).
6. Observar os erros de requisição registrados e o estado renderizado na página.

## Dados de Entrada
- Rota: Breadcrumb `Minha Equipe > Bolsistas do Projeto > Detalhes`
- Bolsista consultado: `Andre Sarmento Spalenza`
- Query Params / IDs:
  - `projetoId`: `70f0b687-0ac1-45b7-abf7-08ddf54b091c`
  - `pessoaId`: `3b98249c-5886-4013-f853-08ddf54b0b1c`
- Requisição disparada:
  `GET https://conectafapes.hom.es.gov.br/api/portalfapes/delegacao/projeto/70f0b687-0ac1-45b7-abf7-08ddf54b091c/historico?pessoaId=3b98249c-5886-4013-f853-08ddf54b0b1c`
- Retorno HTTP: `404 (Not Found)`

## Comportamento Esperado
- O endpoint da API responsável pelo histórico do bolsista deve responder com sucesso (`HTTP 200 OK`), retornando a lista cronológica de movimentações e eventos do bolsista no projeto.
- A aba `Histórico` deve renderizar a linha do tempo completa (ex.: indicação, envio de documentos, aprovação, termo de compromisso, pagamentos ou alterações).
- Não deve ser exibido aviso de erro ou estado vazio enganoso quando houver histórico registrado.

## Comportamento Atual
- A requisição para buscar o histórico falha repetidamente com `HTTP 404 (Not Found)`.
- A interface exibe no topo da aba um banner de aviso amarelo com a mensagem:
  > **"⚠️ Parte do histórico não pôde ser carregada."**
- A área central exibe o placeholder padrão de ausência de registros:
  > **"Nenhum evento no histórico"**  
  > *"As movimentações desta solicitação aparecerão aqui."*
- O coordenador fica impedido de auditar e acompanhar o histórico de ações e movimentações do bolsista selecionado.

## Evidências
- 📷 **Console do navegador registrando erros `GET .../historico?pessoaId=... 404 (Not Found)`:**
  ![Console erro 404 GET](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/minha-equipe/bolsistas%20do%20projeto/detalhe%20dos%20bolsistas/historico/bugs/evidencias-BUG-EQUIP-001-01-console-erro-404-get-historico.png)

- 📷 **Aba Rede (Network) confirmando falha 404 na chamada ao endpoint `historico?pessoaId=...`:**
  ![Network erro 404](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/minha-equipe/bolsistas%20do%20projeto/detalhe%20dos%20bolsistas/historico/bugs/evidencias-BUG-EQUIP-001-02-network-404-historico-pessoaid.png)

- 📷 **Tela do bolsista na aba Histórico com alerta amarelo e estado vazio:**
  ![Tela Histórico Vazia com Aviso](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/minha-equipe/bolsistas%20do%20projeto/detalhe%20dos%20bolsistas/historico/bugs/evidencias-BUG-EQUIP-001-03-tela-aviso-historico-nao-carregado.png)

## Sugestão de Investigação
- **Backend / Roteamento de API Gateway / BFF:**
  - Inspecionar os controladores de delegação em `api/portalfapes/delegacao/projeto/:id` e validar se a rota `/historico` com parâmetro `pessoaId` existe ou se sofreu renomeação/depreciação na versão atual.
  - Verificar se a rota no Gateway (`M007`) redireciona corretamente para o serviço do `M009` (ex.: `/api/v1/m009/bolsas/:id/historico` ou serviço correspondente de eventos).
- **Frontend (`frontoffice`):**
  - Verificar no serviço/composable responsável pela busca de dados do bolsista (`useBolsista` ou similar) se o endpoint configurado está alinhado à documentação da API em Homologação.
