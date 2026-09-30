## Título
[Bug] Erro HTTP 403 (Forbidden / Access Denied) ao clicar no botão de abertura de anexo de Contestação no Backoffice

## ID
BUG-M014-BO-INV-002

## Requisito/Regra Violada
- Fluxo/Contexto: Análise de Prestação de Contas (Backoffice) — **Seção de Contestação (Análise de Defesa/Recusa)**
- Regra Canônica: M014: `RN10` / `RN08` (Avaliação de recurso/contestação enviada pelo Coordenador com análise obrigatória de justificativa e documentos de defesa anexados)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #3 (Controle e Liberdade do Usuário)**: O funcionário da FAPES tenta abrir o arquivo anexado à contestação pelo botão de ação do card, mas é bloqueado pelo sistema por erro de permissão.
  - **Heurística #9 (Ajudar usuários a reconhecer, diagnosticar e recuperar-se de erros)**: Retorno de erro técnico de acesso negado em segundo plano (`403 Access Denied`) impedindo o Analista FAPES de fundamentar a decisão entre `Validar` ou `Rejeitar` a contestação.
- Caso de Teste Relacionado: `CT-M014-BO-016` / `CT-M014-FO-109` (Análise de recurso/contestação e abertura de anexos de defesa no Backoffice)
- Rota/Componente: `/admin/prestacao-contas/analise/:prestacaoId` (`AnalisePrestacaoContas.vue` / Card `Contestação`)
- Endpoint afetado: `GET /api/prestacao-de-contas/projeto/{id}/prestacoes-contas/defesa-prestacao/documentos/{id}/presigned-url`

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Backoffice Vue-Nuxt UI em `https://admin.conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o Backoffice (`/admin`) com o perfil de Funcionário/Analista FAPES.
2. Abrir uma prestação de contas que esteja em status de **Contestação / Em Análise** (recurso enviado após reprovação).
3. Localizar o bloco de **Contestação** (*"Contestação enviada pelo coordenador em resposta à reprovação"*).
4. Na lista de **Anexos** da contestação, identificar o arquivo anexado pelo Coordenador (ex.: `NF-Notebooks.pdf`).
5. Clicar no botão/ícone de ação no lado direito do card do anexo.
6. Observar a falha de requisição no DevTools (`F12` - abas Console e Rede).

## Dados de Entrada
- Rota Backoffice: `/admin/prestacao-contas/analise/:prestacaoId`
- Perfil: Analista / Funcionário FAPES (Backoffice)
- Bloco: `Contestação`
- Anexo de Defesa: `NF-Notebooks.pdf`
- Endpoint requisitado: `GET https://admin.conectafapes.hom.es.gov.br/api/prestacao-de-contas/projeto/70.../prestacao/documentos/260be81b.../presigned-url`
- Resposta HTTP (`403 Forbidden`):
  ```json
  {
    "status": 403,
    "message": "Access Denied",
    "details": "Your account does not have the required permissions to access this endpoint: api/prestacao-de-contas/projeto/{id}/prestacoes-contas/defesa-prestacao/documentos/{id}/presigned-url"
  }
  ```

## Comportamento Esperado
- O funcionário da FAPES deve possuir autorização para obter a URL assinada (`presigned-url`) e abrir qualquer documento anexado em contestações de prestação de contas.
- Ao clicar no botão de ação do anexo, a API deve retornar HTTP 200 com a URL temporária do arquivo no S3/Storage, permitindo o download ou a abertura do documento PDF.

## Comportamento Atual
- Ao clicar no botão do anexo, o backend rejeita a chamada `GET .../defesa-prestacao/documentos/{id}/presigned-url` com HTTP `403 Forbidden` informando: *"Your account does not have the required permissions to access this endpoint"*.
- O console do navegador exibe o erro `403 (Forbidden)` e o arquivo de defesa anexado pelo Coordenador não é aberto, deixando o Analista FAPES sem acesso às provas enviadas no recurso.

## Evidências
- 📷 **Bloco de Contestação no Backoffice e botão de ação do anexo:**
 
<img width="973" height="350" alt="Bloco de contestacao no Backoffice" src="https://github.com/user-attachments/assets/6dfa3b48-732d-45cf-a73c-db90615438bd" />

- 📷 **Ícone de ação no card do anexo acionado pelo usuário:**
 
<img width="200" height="150" alt="Icone de acao do anexo" src="https://github.com/user-attachments/assets/69d1237c-3f4a-4d2d-a2f0-1017efad8b9f" />

- 📷 **Console registrando erro HTTP 403 (Forbidden) no endpoint presigned-url:**
 
<img width="967" height="152" alt="Console com erro 403 presigned url" src="https://github.com/user-attachments/assets/cd113f9a-14d2-4467-897c-95b77df23bb0" />

- 📷 **Aba Rede (Network) confirmando Access Denied para a role do Backoffice:**
 
<img width="977" height="385" alt="Network payload 403 Access Denied presigned url" src="https://github.com/user-attachments/assets/b835ec96-2ee9-43c2-bf72-cd89e1a8bb23" />

## Sugestão de Investigação
- Inspecionar as políticas de autorização (`Authorization Policy` / `Role Claims`) no controller do backend responsável por gerar URLs assinadas de documentos de defesa de prestação:
  - O endpoint `GET api/prestacao-de-contas/projeto/{id}/prestacoes-contas/defesa-prestacao/documentos/{id}/presigned-url` está rejeitando requisições do perfil de Funcionário/Analista FAPES.
  - Adicionar a permissão/claim de leitura de documentos de defesa para as roles de administradores e analistas do Backoffice (`Admin`, `Operador GEPOF`, `Analista FAPES`).
