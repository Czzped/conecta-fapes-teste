# Título
[Bug] Card "Verificar Informações da Nota Fiscal" permanece expandido após exclusão do arquivo na edição

## ID
BUG-M014-FO-NF-002

## Requisito/Regra Violada
- Regra Canônica: M014: `RN05` — Reatividade de estado do painel `Verificar Informações da Nota Fiscal` condicionado à presença de `DocumentoFiscal` no upload
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` — Seção `2. Adicionar Descrição e Anexar Nota Fiscal *` (`usePrestacao-Dj_ayRuN.js`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [x] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo

> **Pré-condição:** A NF-e foi anexada e confirmada pelo próprio testador na sessão atual (upload realizado na mesma sessão, sem recarregar a página).

1. Acessar `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` com transação de débito sem NF-e prévia.
2. Na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, anexar um arquivo XML ou PDF válido de NF-e.
3. Aguardar a leitura automática dos dados — o card `Verificar Informações da Nota Fiscal` deve expandir exibindo chave de acesso, impostos e itens.
4. Clicar em `Confirmar` na seção de verificação.
5. Clicar no botão de edição da seção `2. Adicionar Descrição e Anexar Nota Fiscal *`.
6. Remover o arquivo de NF-e do campo de upload (ícone de lixeira no pill do arquivo).
7. Observar o estado do card `Verificar Informações da Nota Fiscal`.

## Dados de Entrada
- URL: `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId`
- Arquivo NF-e: XML ou PDF válido com chave de acesso de 44 dígitos
- Ação disparadora: exclusão do arquivo no campo de upload durante a edição da seção

## Comportamento Esperado
- Ao remover o arquivo de NF-e do campo de upload, o card `Verificar Informações da Nota Fiscal` deve **recolher automaticamente** (colapsar/ocultar).
- Os campos de chave de acesso, data de emissão, impostos e tabela de itens devem ser limpos da interface, indicando que não há documento fiscal vinculado.

## Comportamento Atual
- Após a exclusão do arquivo no campo de upload, o card `Verificar Informações da Nota Fiscal` **permanece expandido**, mantendo todos os dados extraídos da NF-e anterior visíveis (Chave de Acesso, Data de Emissão, Identificador do Emitente, UF, totais de impostos e tabela de itens).
- A área de upload exibe o estado vazio (*"Selecione o arquivo ou arraste e solte aqui"*) em contradição com o card de verificação que segue expandido com dados desatualizados.

## Evidências
- 📷 **Card de verificação expandido após remoção do arquivo (campo de upload vazio, card ainda visível):**

  `evidencias-BUG-NF-002-card-verificacao-nfe-persiste-apos-exclusao.png`

## Sugestão de Investigação (Opcional)
- Verificar se o watcher/computed que controla a visibilidade do card `Verificar Informações da Nota Fiscal` está reagindo à remoção do arquivo no estado reativo do composable `usePrestacao` durante o modo de edição — possível ausência de reset do flag de exibição ao limpar o campo de upload.