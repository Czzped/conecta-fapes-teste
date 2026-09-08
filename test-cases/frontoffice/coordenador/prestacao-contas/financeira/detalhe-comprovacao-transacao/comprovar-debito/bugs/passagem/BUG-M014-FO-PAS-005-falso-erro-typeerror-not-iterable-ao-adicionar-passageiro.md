## Título
[Bug] Falso erro "Não foi possível salvar a passagem. Tente novamente" com TypeError "is not iterable" ao submeter passageiros pela segunda vez (reenvio com novo passageiro após primeiro envio bem-sucedido)

## ID
BUG-M014-FO-PAS-005

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — Tipo de Documento: **Passagem**
- Regra Canônica: M014: `RN12` (Registro e integridade de passagens e passageiros) / Heurística de Nielsen #1 (Visibilidade do Status do Sistema — o frontend não deve emitir alerta falso de erro quando a operação foi persistida com sucesso)
- Gatilho Específico: O erro ocorre obrigatoriamente quando **já houve um primeiro envio bem-sucedido de passageiros** e o usuário realiza um **segundo envio** (adicionando outro passageiro), disparando requisições combinadas de atualização (`PUT`) e inclusão (`POST`).
- Caso de Teste Relacionado: `CT-M014-FO-054` (Adicionar múltiplos passageiros à mesma comprovação de passagem)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Seção `3. Informações da Passagem *`)
- Endpoints da API envolvidos:
  - `PUT /api/prestacao-de-contas/projeto/:id/justificativa-passagem/:id/passageiros` (Atualização dos existentes — HTTP 200 OK)
  - `POST /api/prestacao-de-contas/projeto/:id/justificativa-passagem/:id/passageiros` (Criação do novo — HTTP 201 Created)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o sistema com perfil de `coordenador` e abrir uma comprovação de débito de passagem em branco.
2. Preencher a Seção 1 (Informações Gerais) e Seção 2 (Comprovantes).
3. Na Seção 3, cadastrar os passageiros iniciais (ex.: Passageiro 1 e Passageiro 2) e clicar em `Enviar passageiros`.
4. Observar que o primeiro envio é concluído com sucesso e exibe notificação verde (*"Justificativa de passagem salva com sucesso!"*).
5. Em seguida, acionar a inclusão de um novo passageiro (`+ Adicionar passageiro`) para cadastrar o `Passageiro 3`, redistribuindo os valores válidos entre eles.
6. Clicar no botão ciano `Enviar passageiros` pela **segunda vez**.
7. Observar que a interface exibe imediatamente um toast vermelho de erro: *"Não foi possível salvar a passagem. Tente novamente"* acompanhado da mensagem técnica de console `oo is not iterable`.
8. Abrir o DevTools (`F12`) na aba **Rede (Network)** e constatar que:
   - A requisição `PUT` para atualizar os passageiros existentes retornou `200 OK`.
   - A requisição `POST` para criar o novo passageiro retornou `201 Created`.
9. Recarregar a página (`F5`) e verificar que os dados foram persistidos perfeitamente no banco de dados, confirmando que a falha é exclusiva do tratamento da resposta no frontend durante o segundo envio.

## Dados de Entrada
- Endpoint: `https://conectafapes.hom.es.gov.br/api/prestacao-de-contas/projeto/70f0b687-0ac1-45b7-abf7-08ddf54b091c/justificativa-passagem/8aa82b58-4b1e-4f73-a0e9-f380ba768474/passageiros`
- Status HTTP retornados: `201 Created` (POST) e `200 OK` (PUT)
- Passageiro 1: `R$ 324,32`
- Passageiro 2: `R$ 10,00`
- Passageiro 3: `R$ 10,00`

## Comportamento Esperado
- O frontend deve processar adequadamente a resposta de sucesso da API (`201 Created` / `200 OK`), exibir notificação verde de sucesso (*"Passageiros salvos com sucesso!"*) e sincronizar a lista reativa de passageiros sem disparar exceção JavaScript de iteração.

## Comportamento Atual
- O frontend sofre uma exceção de runtime JavaScript (`TypeError: oo is not iterable`), cai no bloco `catch` e emite um alerta falso de erro em vermelho (*"Não foi possível salvar a passagem. Tente novamente"*), desorientando o usuário, apesar de o dado ter sido persistido com sucesso no banco. Após recarregar a tela (`F5`), os 3 passageiros são exibidos normalmente.

## Evidências
- 📷 **Passageiros iniciais salvos com sucesso:**
  ![Passageiros iniciais salvos](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-005-sucesso-inicial-dois-passageiros.png)

- 📷 **Toast de erro falso com exceção "is not iterable":**
  ![Toast de erro falso](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-005-toast-erro-falso-not-iterable.png)

- 📷 **DevTools Network: Requisição PUT retornando 200 OK:**
  ![DevTools PUT 200 OK](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-005-api-put-passageiros-200-ok.png)

- 📷 **DevTools Network: Requisição POST retornando 201 Created:**
  ![DevTools POST 201 Created](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-005-api-post-passageiros-201-created.png)

- 📷 **Recarregamento da página (F5) confirmando persistência correta no servidor:**
  ![Recarregamento confirmando salvamento](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-005-reload-confirma-passageiros-salvos.png)

## Sugestão de Investigação (Opcional)
- No primeiro envio, apenas uma chamada inicial `POST` é executada e o fluxo conclui com sucesso.
- No **segundo envio** (ou reenvios subsequentes), o frontend dispara requisições simultâneas: `PUT` para atualizar os passageiros que já possuem ID gerado e `POST` para incluir o novo passageiro.
- A função que processa o retorno combinado dessas requisições (ex.: manipulação de `Promise.all` ou desestruturação da resposta) tenta iterar com spread `[...res]`, `for...of` ou `.map()` sobre um retorno que não é um iterável (ex.: resposta de `PUT` sem corpo ou com payload encapsulado), gerando o `TypeError: oo is not iterable` e caindo no bloco `catch` que exibe o falso erro.
- Tratar as respostas de `PUT` e `POST` de forma defensiva e separada (ex.: `Array.isArray(res) ? ... : []`).
