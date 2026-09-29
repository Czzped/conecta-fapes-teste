## Título
[Bug] Ausência de validação de tamanho máximo de arquivo no upload de anexos de comprovação de débito, permitindo arquivos superiores ao limite de 10 MB (ex: 12 MB)

## ID
BUG-M014-FO-PAS-014

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — **Seção 2 (Anexar Comprovantes / Documentos Fiscais)**
- Regra Canônica: M014: `RN05` / Validação de limite de tamanho de arquivos anexados (Restrição declarada na UI: *"Selecione o arquivo ou arraste e solte aqui (PDF ou XML, até 10MB)"*)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #5 (Prevenção de Erros)**: Ausência de validação no client-side/dropzone de upload. O componente orienta explicitamente que o limite é de 10 MB, porém aceita a seleção e o carregamento de arquivos de 12 MB sem bloquear ou exibir mensagem de erro preventiva.
  - **Heurística #4 (Consistência e Padronização)**: Inconsistência entre a instrução textual exibida na interface ("até 10MB") e a regra implementada de fato no componente de upload.
- Caso de Teste Relacionado: `CT-M014-FO-076` / `CT-M014-FO-061` (Validar rejeição de anexo com tamanho excedente)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Componente de Dropzone de Upload de Anexos)

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [x] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato financeiro em `/coordenador/financeira` com o perfil de Coordenador.
2. Abrir uma prestação de débito em rascunho (ex.: Passagem, Invoice ou Nota Fiscal).
3. Na Seção `2. Anexar Comprovantes *`, observar o texto instrutivo da área de upload (*"Selecione o arquivo ou arraste e solte aqui (PDF ou XML, até 10MB)"*).
4. Clicar no botão de anexar comprovante e selecionar um arquivo com tamanho superior a 10 MB (ex.: `documento.pdf` de **12 MB**).
5. Observar se o arquivo é aceito e carregado na lista de anexos do formulário.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Arquivo Selecionado: `documento.pdf` (Tamanho: **12 MB**)
- Limite Declarado na Interface: **10 MB**

## Comportamento Esperado
- O componente de upload deve validar o tamanho do arquivo selecionado (`file.size <= 10 * 1024 * 1024`).
- Ao selecionar um arquivo acima de 10 MB (ex.: 12 MB), o sistema deve rejeitar o upload e exibir uma mensagem de validação clara (ex.: *"O arquivo excedeu o tamanho máximo permitido de 10MB"*).

## Comportamento Atual
- O componente de upload não aplica a validação de limite de tamanho no client-side.
- O arquivo `documento.pdf` de **12 MB** é aceito e exibido como anexado no card da despesa, violando a regra informada ao usuário no próprio rótulo do campo.

## Evidências
- 📷 **Arquivo documento.pdf de 12 MB aceito no campo com limite informado de 10 MB:**
 
<img width="973" height="389" alt="Arquivo de 12 MB anexado com sucesso" src="https://github.com/user-attachments/assets/b6d61688-dfdb-4fc2-a270-3d750c18c7e9" />

## Sugestão de Investigação
- Inspecionar a propriedade `maxFileSize` ou o método `@change`/`onFileSelect` do componente de upload de arquivos no Frontoffice (`FileUpload.vue` / `BaseDropzone.vue`):
  - Adicionar a verificação `file.size > 10 * 1024 * 1024` no manipulador de arquivos antes de adicionar o documento à lista reativa.
  - Garantir que um toast ou mensagem de erro de validação inline seja disparado notificando a rejeição do arquivo por tamanho excedente.
