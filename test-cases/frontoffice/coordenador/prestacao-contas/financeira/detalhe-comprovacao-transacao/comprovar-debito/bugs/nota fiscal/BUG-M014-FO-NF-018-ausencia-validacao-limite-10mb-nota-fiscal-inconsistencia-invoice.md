## Título
[Bug] Ausência de validação de tamanho limite no upload de Nota Fiscal (permite arquivos de 12 MB), enquanto no Invoice a restrição de 10 MB é devidamente aplicada

## ID
BUG-M014-FO-NF-018

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — **Seção 2 (Anexar Nota Fiscal / Documento Fiscal)**
- Regra Canônica: M014: `RN05` / Standard de validação de tamanho de arquivo (10 MB máximo para todos os documentos fiscais da plataforma)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #4 (Consistência e Padronização)**: Falta de consistência entre modalidades do mesmo módulo. Enquanto a modalidade *Invoice* aplica a validação e bloqueia arquivos com toast (*"FileSize: O arquivo excede o tamanho máximo permitido de 10MB."*), o formulário de *Nota Fiscal* ignora a restrição e permite anexar arquivos de 12 MB normalmente.
  - **Heurística #5 (Prevenção de Erros)**: Ausência de mensagem descritiva do limite textual no rótulo da área de upload da Nota Fiscal (*"Selecione o arquivo ou arraste e solte aqui (PDF ou XML)"* omite o limite "até 10MB") e falta de checagem prévia no upload.
- Caso de Teste Relacionado: `CT-M014-FO-061` (Validar rejeição de anexo de Nota Fiscal com tamanho excedente a 10MB)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Seção `2. Adicionar Descrição e Anexar Nota Fiscal *`)

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [x] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato financeiro em `/coordenador/financeira` com o perfil de Coordenador.
2. Abrir uma prestação de débito em rascunho e selecionar a modalidade **Nota Fiscal (NFe/NFSe)** na Seção 1.
3. Na Seção 2, clicar em `Anexar Nota Fiscal` e selecionar um arquivo de **12 MB** (ex.: `documento.pdf`).
4. Observar que o arquivo de 12 MB é aceito sem qualquer mensagem de erro no formulário de Nota Fiscal.
5. Para comparação, alterar a modalidade na Seção 1 para **Invoice (Pagamento Internacional)**.
6. Na Seção 2 do Invoice, tentar anexar o mesmo arquivo de **12 MB**.
7. Observar a exibição do toast de erro no Invoice (*"Falha ao enviar o arquivo... FileSize: O arquivo excede o tamanho máximo permitido de 10MB."*).

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Arquivo de Teste: `documento.pdf` (12 MB)
- Comportamento no Invoice: Bloqueado com erro `FileSize > 10MB`.
- Comportamento na Nota Fiscal: Aceito sem bloqueio.

## Comportamento Esperado
- O componente de upload de Nota Fiscal deve manter a mesma consistência e regra do Invoice, rejeitando arquivos com tamanho superior a 10 MB.
- Ao tentar anexar uma Nota Fiscal acima de 10 MB, o sistema deve disparar o toast de erro informando que o arquivo excede o limite permitido de 10 MB.

## Comportamento Atual
- O upload de **Nota Fiscal** permite anexar arquivos de 12 MB normalmente (sem restrição), enquanto o upload de **Invoice** valida e bloqueia o mesmo arquivo com a mensagem: *"Falha ao enviar o arquivo. Tente novamente. FileSize: O arquivo excede o tamanho máximo permitido de 10MB."*.

## Evidências
- 📷 **Nota Fiscal aceitando arquivo de 12 MB sem validação ou restrição de tamanho:**
 
<img width="973" height="389" alt="Nota fiscal aceita arquivo de 12 MB" src="https://github.com/user-attachments/assets/cfdeab65-8b36-4dd8-9449-74360e2ce1c2" />

- 📷 **Invoice validando e bloqueando o arquivo de 12 MB com o toast de erro de 10 MB:**
 
<img width="975" height="389" alt="Invoice bloqueia arquivo de 12 MB com toast" src="https://github.com/user-attachments/assets/cdfe9586-beae-4eb8-b98a-212ca87dfca6" />

## Sugestão de Investigação
- Inspecionar a integração do dropzone de upload no componente de Nota Fiscal (`AnexarNotaFiscal.vue`):
  - Certificar que o componente esteja usando a mesma diretiva/regra de validação de tamanho de arquivo (`maxFileSize: 10 * 1024 * 1024`) implementada no componente de Invoice (`AnexarInvoice.vue`).
  - Atualizar o rótulo descritivo da área de dropzone da Nota Fiscal para exibir *"PDF ou XML, até 10MB"*, garantindo a padronização das orientações ao usuário.
