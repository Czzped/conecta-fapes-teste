## Título
[Bug] Erro "Não foi possível baixar o arquivo" ao tentar abrir/visualizar anexos de Cotação em prestação de Invoice no Backoffice (enquanto no Frontoffice abre normalmente)

## ID
BUG-M014-BO-INV-001

## Requisito/Regra Violada
- Fluxo/Contexto: Análise de Prestação de Contas (Backoffice) — **Seção 5 (Cotação / Visualização de Orçamentos)**
- Regra Canônica: M014: `RN08` / `RI-INV01` (Acesso e download de documentos de cotação por Analistas FAPES durante a avaliação de prestações em análise)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #1 (Visibilidade do Status do Sistema)**: O botão de visualização (olho) na Seção 5 aciona uma requisição de download, mas o sistema falha e dispara o toast vermelho *"Erro ao abrir orçamento - Não foi possível baixar o arquivo. Tente novamente."*.
  - **Heurística #4 (Consistência e Padronização)**: Quebra de consistência de acesso entre perfis. O mesmo arquivo de cotação abre e é visualizado sem problemas pelo Coordenador no Frontoffice, mas é bloqueado com erro no Backoffice FAPES.
- Caso de Teste Relacionado: `CT-M014-BO-015` / `CT-M014-FO-106` (Visualização e download de arquivos de cotação por analistas da FAPES no Backoffice)
- Rota/Componente: `/admin/prestacao-contas/analise/:prestacaoId` (`AnalisePrestacaoContas.vue` / Seção `5. Cotação`)

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Backoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o sistema Backoffice (`/admin`) com o perfil de Funcionário/Analista FAPES.
2. Navegar para a lista de análise de prestação de contas e abrir uma prestação sob a modalidade **Invoice** com o status `Em Análise`.
3. Rolar a página até a **Seção 5 (Cotação)**, onde estão listados os orçamentos enviados (ex.: `4c7d493e...Cópia de cotacao_notebook_vaio...pdf`).
4. Clicar no ícone de visualização (olho) ao lado do arquivo de cotação desejado.
5. Observar a exibição do toast de erro no canto inferior direito.
6. Para comparação, acessar a mesma prestação no Frontoffice com a conta do Coordenador e clicar no mesmo ícone de visualização (olho).

## Dados de Entrada
- Rota Backoffice: `/admin/prestacao-contas/analise/:prestacaoId`
- Perfil: Analista / Funcionário FAPES (Backoffice)
- Arquivo de Cotação: `4c7d493e-a704-409f-a71e-a64845ca3a67-Cópia de cotacao_notebook_vaio_americanas_compressed.pdf`

## Comportamento Esperado
- O funcionário da FAPES no Backoffice deve ter permissão total para visualizar e baixar qualquer arquivo de cotação associado à prestação de contas em análise.
- Ao clicar no ícone de olho, o arquivo em PDF deve ser aberto em uma nova aba do navegador ou exibido no modal de preview de documentos (assim como ocorre no Frontoffice).

## Comportamento Atual
- No Backoffice, ao tentar abrir a cotação, a requisição de download falha e dispara o toast de erro: *"Erro ao abrir orçamento - Não foi possível baixar o arquivo. Tente novamente."*.
- O mesmo arquivo funciona e abre normalmente em tela cheia quando acionado através da interface do Frontoffice pelo Coordenador.

## Evidências
- 📷 **Lista de cotações enviadas na Seção 5 da prestação de contas em análise:**
 
<img width="973" height="240" alt="Lista de cotações na Seção 5" src="https://github.com/user-attachments/assets/77d9c669-7ae5-4ad9-bf95-23cbbfecefb4" />

- 📷 **Toast de erro disparado no Backoffice ao tentar abrir o orçamento ("Erro ao abrir orçamento - Não foi possível baixar o arquivo"):**
 
<img width="986" height="350" alt="Toast de erro ao abrir orçamento no Backoffice" src="https://github.com/user-attachments/assets/ae0f94ef-64b5-4fe0-84cf-cf5ce0f10cb0" />

- 📷 **Mesmo arquivo de cotação abrindo normalmente no Frontoffice pelo Coordenador:**
 
<img width="975" height="700" alt="Arquivo abrindo normalmente no Frontoffice" src="https://github.com/user-attachments/assets/bfa1a4e1-efad-452f-b472-886d38e21a20" />

## Sugestão de Investigação
- Inspecionar o endpoint de download/visualização de documentos de cotação acionado pelo Backoffice:
  - Verificar se a URL ou endpoint consumido no Backoffice (`/api/admin/.../cotacao/:id/download` ou equivalente) está com falha de permissão (`Authorization Header` / `Role Claim` para o perfil Admin/Analista) ou se está construindo a URL do blob de armazenamento de forma diferente do Frontoffice.
  - Verificar se a política de CORS ou o middleware de segurança do storage/S3 está bloqueando requisições originadas pelas rotas do Backoffice.
