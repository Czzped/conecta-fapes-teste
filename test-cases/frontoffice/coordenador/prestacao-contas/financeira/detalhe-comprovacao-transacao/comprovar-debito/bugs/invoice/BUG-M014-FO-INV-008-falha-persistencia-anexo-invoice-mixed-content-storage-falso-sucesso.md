## Título
[Bug] Anexo de documento fiscal do Invoice não persiste após envio com toast de falso sucesso e erro de Mixed Content no console

## ID
BUG-M014-FO-INV-008

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito de Invoice — **Seção 2 (Anexar Arquivos do Invoice)**
- Regra Canônica:
  - M014 / M013: `RN02` (Conciliação Extrato x Despesa) e `ConsultarPrestacaoContas` (Visualização agregada da prestação e suas justificativas com documento fiscal anexado).
  - M014: `RN05` / `RI-INV01` (Integridade, guarda e persistência do documento fiscal comprobatório de Invoice).
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #1 (Visibilidade do Status do Sistema)**: Exibição de notificação verde de sucesso (*"Invoice atualizado com sucesso!"*), transmitindo falsa confirmação de persistência enquanto a aplicação falha internamente no console e descarta o anexo.
  - **Heurística #9 (Ajudar usuários a reconhecer, diagnosticar e recuperar-se de erros)**: As falhas `Mixed Content`, `ERR_CONNECTION_TIMED_OUT` e `TypeError: Failed to fetch` ocorrem no console sem nenhum tratamento ou mensagem amigável ao coordenador na interface.
- Caso de Teste Relacionado: `CT-M014-FO-073` / `CT-M014-FO-084` (Inclusão e persistência do anexo de Invoice)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue`, `usePrestacao.ts`, Seção `2. Anexar Arquivos do Invoice`)

## Ambiente
[ ] Produção  [x] Staging  [ ] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120+ / Frontoffice Vue-Nuxt UI em `https://stage.conectafapes.leds.dev.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o Frontoffice no ambiente de Staging (`https://stage.conectafapes.leds.dev.br`) com o perfil de Coordenador.
2. Navegar para a prestação de contas financeira e abrir uma transação de débito associada a **Invoice** (ex.: rota `/prestacao-financeira/9927ee4d-0c3c-4a94-b2a5-005b546ec794`).
3. Na **Seção 2 (Anexar Arquivos do Invoice)**, realizar o upload do documento fiscal em PDF que justifica o pagamento (ex.: `github-leds-conectafapes-receipt-2025-08-08 (1).pdf` de 59 KB).
4. Preencher ou revisar as informações do Invoice na Seção 3 e clicar em submeter/atualizar o Invoice.
5. Observar a exibição da notificação verde (*"Invoice atualizado com sucesso!"*).
6. Abrir as Ferramentas de Desenvolvedor (`F12` / Console) e verificar os logs de execução.
7. Recarregar a página (`F5` / `Ctrl+R`) e inspecionar o estado da Seção 2.

## Dados de Entrada
- Ambiente: Staging (`https://stage.conectafapes.leds.dev.br`)
- Rota: `/prestacao-financeira/9927ee4d-0c3c-4a94-b2a5-005b546ec794`
- Tipo de documento: Invoice (Valor: R$ 1.120,00, Moeda: BRL, Câmbio: 1)
- Arquivo anexado: `github-leds-conectafapes-receipt-2025-08-08 (1).pdf` (59 KB)
- Ação: Envio/atualização do Invoice

## Comportamento Esperado
- O arquivo de documento fiscal enviado na Seção 2 deve ser salvo com sucesso no storage com URL pública/segura HTTPS resolvida externamente.
- O vínculo do anexo à justificativa de despesa deve ser persistido no banco de dados.
- Ao recarregar a página (`F5`), o arquivo anexado deve permanecer visível na Seção 2 com seu nome, tamanho e opção de visualização/exclusão.
- Nenhum erro de `Mixed Content` ou `ERR_CONNECTION_TIMED_OUT` deve ocorrer no console.

## Comportamento Atual
- O frontend dispara um toast de falso sucesso: *"Invoice atualizado com sucesso!"*.
- Imediatamente no console do navegador são registrados erros críticos:
  - `Mixed Content: The page at 'https://stage.conectafapes.leds.dev.br/...' was loaded over HTTPS, but requested an insecure resource 'http://100.118.9.175:9000/prestacao-contas-dev/...'`
  - `Failed to load resource: net::ERR_CONNECTION_TIMED_OUT` para `100.118.9.175:9000`
  - `Error: Erro ao obter o arquivo da justificativa de despesa: TypeError: Failed to fetch at usePrestacao-BWfK1iTG.js`
- Ao recarregar a página (`F5`), a Seção 2 volta ao estado vazio, exibindo a área de upload limpa (*"Selecione os arquivos ou arraste e solte aqui"*), perdendo completamente o documento anexado.

## Evidências
- 📷 **Toast de confirmação ("Invoice atualizado com sucesso!") com arquivo anexado:**
  ![Toast de sucesso com arquivo](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/invoice/evidencias-BUG-INV-008-01-toast-sucesso-anexo-invoice.png)

- 📷 **Console DevTools exibindo Mixed Content, ERR_CONNECTION_TIMED_OUT e falha de fetch:**
  ![Console com erros de Mixed Content e timeout](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/invoice/evidencias-BUG-INV-008-02-console-mixed-content-failed-to-fetch.png)

- 📷 **Página recarregada (F5) exibindo a Seção 2 sem o arquivo anexado (campo vazio):**
  ![Anexo desaparece após recarregar](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/invoice/evidencias-BUG-INV-008-03-anexo-desaparece-pos-recarregar-pagina.png)

## Sugestão de Investigação
- **Configuração de Endpoint do Storage / MinIO em Staging:**
  - O serviço backend em Stage está gerando presigned URLs utilizando o IP interno do cluster/infraestrutura (`http://100.118.9.175:9000/prestacao-contas-dev/...`) com protocolo HTTP inseguro.
  - Como o Frontoffice é servido via HTTPS (`https://stage.conectafapes.leds.dev.br`), o navegador bloqueia a requisição por violar as políticas de segurança de conteúdo misto (*Mixed Content*), além do IP interno ser inalcançável externamente pela rede do cliente (`ERR_CONNECTION_TIMED_OUT`).
  - Configurar no MinIO/S3 do backend a variável de URL pública/externa (ex.: `S3__EXTERNAL_ENDPOINT` ou Caddy proxy reverso HTTPS) para que as URLs de download de anexos sejam retornadas com domínio HTTPS válido e acessível ao navegador.
- **Tratamento de Exceção no Frontend:**
  - Em `usePrestacao.ts`, verificar se o erro em `obter o arquivo da justificativa de despesa` deve alertar o usuário de falha de conexão com o storage em vez de exibir notificação verde de sucesso.
