## Título
[Bug] Erro HTTP 403 Forbidden e falha ao carregar seções ao abrir transação de crédito para classificação

## ID
BUG-M014-FO-CRED-004

## Requisito/Regra Violada
- Fluxo/Contexto: Prestação de Contas > Financeira > **Classificar Crédito**
- Regra Canônica: M014: `RN11` (Classificação de Crédito — Todo lançamento de crédito na conta bancária do projeto deve ser passível de classificação pelo Coordenador em Estorno de Pagamento, Rendimento de Aplicação, Devolução de Saldo ou Aporte) / Invariante de Acesso e Autorização às Transações Financeiras do Projeto
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #9 (Ajudar usuários a reconhecer, diagnosticar e recuperar-se de erros)**: A mensagem genérica *"Não foi possível carregar a transação"* oculta o erro de autorização (403 Forbidden) e não oferece ação clara de recuperação.
  - **Heurística #1 (Visibilidade do Status do Sistema)**: A interface entra em estado vazio/preto sem fornecer feedback específico sobre a recusa de permissão da requisição.
- Caso de Teste Relacionado: `CT-M014-FO-101` (Acesso e carregamento da tela de classificação de crédito)
- Rota/Componente: `/coordenador/prestacao-financeira/classificar-credito/:id` (`ClassificarCredito.vue`)
- Endpoint API: `GET /api/prestacao-de-contas/transacao-financeira/{id}`

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[x] 🔴 Bloqueante  [ ] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Fazer login no portal com o perfil `coordenador`.
2. Acessar o extrato financeiro do projeto em `/coordenador/financeira`.
3. Localizar uma transação bancária do tipo Crédito pendente de classificação.
4. Clicar sobre a transação para abrir a tela de classificação de crédito (`/coordenador/prestacao-financeira/classificar-credito/:id`).
5. Observar o comportamento visual da tela e as mensagens no DevTools (`F12` - abas Console e Rede/Network).

## Dados de Entrada
- Rota acessada: `/coordenador/prestacao-financeira/classificar-credito/d5c0a100-0000-4000-8000-000000000048`
- Endpoint requisitado: `GET https://conectafapes.hom.es.gov.br/api/prestacao-de-contas/transacao-financeira/d5c0a100-0000-4000-8000-000000000048`
- Status HTTP retornado: `403 Forbidden`

## Comportamento Esperado
- A requisição `GET` deve autorizar a consulta da transação financeira pelo coordenador responsável pelo projeto, retornando `200 OK` com os dados do lançamento bancário.
- A tela deve exibir os Detalhes do Pagamento/Crédito e renderizar as seções e opções para seleção do tipo de crédito (`Estorno`, `Rendimento de Aplicação`, `Devolução`, etc.).

## Comportamento Atual
- O servidor backend responde à requisição `GET /api/prestacao-de-contas/transacao-financeira/:id` com código HTTP `403 Forbidden`.
- No cabeçalho da página é exibido um card/banner de erro com o texto: *"Não foi possível carregar a transação."*.
- Um toast de aviso é disparado no canto inferior direito: *"Algumas informações não foram carregadas. Se você não conseguir concluir sua ação, por favor entre em contato com a FAPES."*.
- O corpo da página fica totalmente em branco/preto, sem renderizar as seções de classificação de crédito, impossibilitando qualquer ação do usuário.

## Evidências
- 📷 **Tela de Classificar Crédito exibindo mensagem de erro e ausência dos componentes:**
  ![Erro ao carregar transação](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/classificar-credito/bugs/evidencias-BUG-CRED-004-tela-erro-nao-foi-possivel-carregar-transacao.png)

- 📷 **Console do navegador registrando 403 Forbidden na requisição GET:**
  ![Console 403 Forbidden](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/classificar-credito/bugs/evidencias-BUG-CRED-004-console-erro-403-forbidden.png)

- 📷 **Aba Rede (Network) confirmando a chamada GET com status 403 Forbidden para o endpoint de transação financeira:**
  ![Network GET 403 Forbidden](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/classificar-credito/bugs/evidencias-BUG-CRED-004-network-inspecionar-get-403-forbidden.png)

## Sugestão de Investigação
- Verificar a configuração de autorização e *policies* no endpoint `GET /api/prestacao-de-contas/transacao-financeira/{id}` no backend (Kestrel / .NET).
- Investigar se a regra de validação de permissão de posse do projeto (*Project Ownership / Multi-tenancy*) está rejeitando requisições para transações de Crédito de forma equivocada para o perfil `Coordenador`.
- Avaliar se há divergência no token/cookie de sessão (`oidc-conecta-fapes`) ou ausência de uma claim/escopo específico exigido pelo handler de autorização ao consultar transações de crédito.
