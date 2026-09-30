## Título
[Bug] Impossibilidade de abrir/visualizar arquivos anexados à Contestação de prestação de contas no Backoffice (ausência do ícone de visualização/download)

## ID
BUG-M014-BO-INV-002

## Requisito/Regra Violada
- Fluxo/Contexto: Análise de Prestação de Contas (Backoffice) — **Seção de Contestação (Análise de Defesa/Recusa)**
- Regra Canônica: M014: `RN10` / `RN08` (Avaliação de recurso/contestação enviada pelo Coordenador com análise obrigatória de justificativa e documentos de defesa anexados)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #3 (Controle e Liberdade do Usuário)**: O funcionário da FAPES precisa tomar a decisão de "Validar" ou "Rejeitar" a contestação, mas é privado de acessar o arquivo PDF anexado como prova de defesa (`NF-Notebooks.pdf`).
  - **Heurística #4 (Consistência e Padronização)**: Inconsistência nos controles de ação de arquivos do sistema. O card do anexo da contestação exibe apenas o ícone de atualização/recarregamento (`↻`), omitindo os ícones padrão de olho (`👁`) ou download (`⬇`) presentes em outras seções.
- Caso de Teste Relacionado: `CT-M014-BO-016` / `CT-M014-FO-109` (Análise de recurso/contestação e visualização de anexos de defesa no Backoffice)
- Rota/Componente: `/admin/prestacao-contas/analise/:prestacaoId` (`AnalisePrestacaoContas.vue` / Card `Contestação`)

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Backoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o Backoffice (`/admin`) com o perfil de Funcionário/Analista FAPES.
2. Abrir uma prestação de contas que esteja em status de **Contestação / Em Análise** (recurso enviado após reprovação).
3. Localizar o bloco de **Contestação** (*"Contestação enviada pelo coordenador em resposta à reprovação"*).
4. Na lista de **Anexos** da contestação, identificar o arquivo anexado pelo Coordenador (ex.: `NF-Notebooks.pdf`).
5. Tentar clicar no card do anexo ou nos ícones à direita para abrir/visualizar o arquivo PDF.
6. Verificar se existe ação funcional de abertura/download do documento de defesa.

## Dados de Entrada
- Rota Backoffice: `/admin/prestacao-contas/analise/:prestacaoId`
- Perfil: Analista / Funcionário FAPES (Backoffice)
- Bloco: `Contestação`
- Anexo de Defesa: `NF-Notebooks.pdf`

## Comportamento Esperado
- O anexo da contestação (`NF-Notebooks.pdf`) deve exibir os controles funcionais de visualização/preview (`olho`) e download (`baixar`).
- Ao clicar no arquivo ou no ícone de visualização, o documento em PDF deve ser aberto em uma nova guia ou modal de leitura para que o Analista FAPES possa fundamentar a decisão entre `Validar` ou `Rejeitar`.

## Comportamento Atual
- O card do anexo exibe apenas o nome do arquivo (`NF-Notebooks.pdf`) e um ícone de recarregar (`↻`), sem qualquer botão ou link clicável para abrir, ler ou baixar o arquivo de defesa.
- O analista é obrigado a decidir sobre a validação ou rejeição da contestação sem conseguir visualizar o documento anexado pelo Coordenador.

## Evidências
- 📷 **Bloco de Contestação no Backoffice exibindo o anexo sem botão de abertura/download:**
 
<img width="973" height="350" alt="Anexo de contestacao sem icone de visualizacao" src="https://github.com/user-attachments/assets/6dfa3b48-732d-45cf-a73c-db90615438bd" />

## Sugestão de Investigação
- Inspecionar o componente do card de anexo da Contestação no Backoffice (`ContestacaoAnexoCard.vue` / `ContestacaoSecao.vue`):
  - Adicionar o manipulador de clique para abertura/download do arquivo (`@click="downloadAnexo(anexo.id)"` ou `target="_blank"` com a URL do storage).
  - Substituir/adicionar o ícone de visualização (`olho` / `👁`) ao lado do ícone de recarregar, padronizando a ação com o restante dos cards de anexos do sistema.
