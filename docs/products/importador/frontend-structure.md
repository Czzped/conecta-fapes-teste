# Estrutura do Frontend - Importador SIGFAPES

[← Voltar ao Importador](README.md)

> Mapeia paginas, hooks e componentes do frontend React em [`MateusLannes/importacao-conecta-backend/frontend`](https://github.com/MateusLannes/importacao-conecta-backend/tree/main/frontend).

---

## Stack

- **React 18** + **TypeScript 5.8** + **Vite 5**
- **react-router-dom 6** (BrowserRouter)
- **react-datepicker 9** + **date-fns 4** (campos de data na planilha)
- **xlsx 0.18** (parse/build de XLSX no browser)
- **vitest 2** + **@testing-library/react 16** + **jsdom 24**
- CSS puro (`styles.css`) com tokens (`--text-muted`, `--surface`, `--line`, etc.)
- **Sem** lib de virtual scroll externa — implementacao manual (row 52px, overscan 5)

Porta dev: `5173`. `VITE_API_BASE_URL` aponta para o backend.

---

## Mapa de rotas (`App.tsx`)

```
/login                         → LoginPage
/                              → AppShell (ProtectedRoute)
   ├── /editais                → EditaisPage (lista + grafico)
   └── /correcao/:editalId     → CorrectionPage (editor)
```

`ProtectedRoute` redireciona para `/login` se `AuthContext.token` for nulo.

---

## Paginas (`src/pages/`)

### `LoginPage.tsx`

Formulario simples email/senha que chama `api.login()` → persiste sessao em `sessionStorage` via `AuthContext` → redireciona para `/editais`.

### `EditaisPage.tsx`

Lista editais retornados por `GET /editais-latest`:

- Filtro por ID e por nome (busca textual)
- Ordenacao: por total de bolsistas (padrao) ou por "Novos" (flag `novo_este_mes`, 60 dias)
- Toggle "lista" vs "grafico" — no modo grafico, chama `/editais-grafico-metricas` e renderiza barras de cobertura (alocacao / importacao / auditoria)
- Badge "Novo" nos cards dos editais com `novo_este_mes`. Icone "ⓘ" aparece apenas no botao de ordenacao, nao nos cards
- Polling: `/locks/batch-status` para mostrar quais editais estao em edicao por outro usuario
- Badge de importado (flag `importado` vindo do backend)

Classes CSS: `program-filter-chip`, `pill`, `pill-new`, `pill-muted`, `pill-warning`, `pill-info-icon`.

### `CorrectionPage.tsx`

Orquestra a correcao da planilha de um edital. Monta:

- `useLock` — acquire/heartbeat/release + modal de conflito
- `useSheetData` — carrega planilha em base64, parse xlsx em memoria, `dirty` flag
- `useUploadPlanilha` — valida + envia ao `/upload-planilha-corrigida`
- `useProgramConfig` — quando tipo ativo e `programas`
- `usePreviousMonthSheets` — lista `GET /planilhas-mes-passado`
- `useCorrectionResource` — resolve `kind` real via `/recurso-kind`

Modais:

- `SheetSetupModal` — primeira criacao (escolhe editais vs programas)
- `ProgramConfigModal` — mapeamento projeto → area tecnica (GEPED, NUPEX, GECAP, GEINOV) com virtual scroll
- `KindSwitchModal` — troca editais ↔ programas (chama `/recurso-kind/switch`)
- `PreviousMonthModal` — download das planilhas do mes anterior
- `BolsistaDumpModal` — mostra JSON bruto via `/bolsista-dump-json`

`ValidationSidebar` exibe erros, warnings e delta de alteracoes apos chamar `/validate-upload-planilha`.

---

## Hooks (`src/hooks/`)

| Hook | Papel | Endpoints usados |
|------|-------|------------------|
| `useLock` | Acquire no mount, heartbeat 45s, release no unmount, failsafe com grace 2min | `/locks/*` |
| `useSheetData` | Carrega planilha base64, parse com `xlsx`, mantem `dirty` | `/planilha-selecionada` |
| `useProgramConfig` | Estado + validacao + save | `/dados-programas` |
| `useUploadPlanilha` | Pipeline de validacao + upload com controle de versao | `/validate-upload-planilha`, `/upload-planilha-corrigida` |
| `usePreviousMonthSheets` | Lista historico do mes anterior | `/planilhas-mes-passado`, `/planilhas-mes-passado/download` |
| `useCorrectionResource` | Resolve tipo ativo (editais/programas) e metadados | `/recurso-kind`, `/planilha-selecionada` |

Todos sao testados com `@testing-library/react` em arquivos `*.test.tsx`.

---

## Componentes-chave

### `spreadsheet/SpreadsheetEditor.tsx`

Tabela editavel com:

- **Virtual scroll manual** — `SPREADSHEET_ROW_HEIGHT = 52px`, `SPREADSHEET_OVERSCAN = 5` linhas, espacadores `<tr>` no topo/rodape para manter scrollbar correta
- **9 regras de validacao em tempo real** (datas, niveis, valores, obrigatorios)
- **Reset do scroll ao trocar filtro**
- Suporta planilhas de 5000+ linhas sem travar

### `correction/ProgramConfigModal.tsx`

Modal de mapeamento projeto → area tecnica com virtual scroll proprio. Validacoes:

- Projeto so pode aparecer em uma area
- Areas sao exatamente `{GEPED, NUPEX, GECAP, GEINOV}`
- Pelo menos um projeto por area usada

### `correction/ValidationSidebar.tsx`

Sidebar lateral com 3 secoes:

- **Erros bloqueantes** — agrupados por sumario, lista de `bolsista_ids` quando extraido da mensagem
- **Warnings** — nao bloqueantes
- **Delta** — contagem de celulas alteradas, linhas adicionadas/removidas

### `correction/KindSwitchModal.tsx`

Confirma troca de tipo (editais ↔ programas). Envia `confirm: true` + `lock_token` para `/recurso-kind/switch`, que clona a ultima versao e migra lock para a nova chave.

---

## Biblioteca de apoio (`src/lib/`)

| Arquivo | Responsabilidade |
|---------|------------------|
| `api.ts` | Cliente HTTP centralizado — tipado, `ApiError` com `status` + `detail`, injeta `Authorization: Bearer`. Base URL vem de `VITE_API_BASE_URL`. |
| `xlsx.ts` | Parse de base64 → rows e build de `Workbook` com cabecalho + linhas |
| `planilhaValidation.ts` | Regras sincronas de validacao de datas, niveis e obrigatorios |
| `planilhaHelpers.ts` | Normalizacao de headers (`normalizeHeader`), ordenacao, parsing de ID |
| `correctionPlanilha.ts` | Sumarios, deltas, extracao de cell keys a partir de mensagens de erro |
| `uiMessage.ts` | Classe `MessageTone` (info, success, warning, error) + renderizacao |

Arquivos `*.test.ts` cobrem cada utilitario.

---

## Autenticacao no frontend

### `contexts/AuthContext.tsx`

- Armazena `token`, `refreshToken`, `user` em `sessionStorage`
- Fornece `login(email, password)`, `logout()` e `token` para hooks/componentes
- `ProtectedRoute` bloqueia acesso a `/` quando `!token`

### Injecao do token no cliente HTTP

```typescript
const lock = await api.acquireLock({ editalId, kind }, token);
// lib/api.ts adiciona o header Authorization: Bearer <token>
```

Quando o backend responde `401`, o hook chama `logout()` e redireciona para `/login`.

---

## Typings (`src/types/api.ts`)

Contem as interfaces TypeScript para toda resposta da API. Exemplos:

```typescript
interface LockResponse {
  ok: boolean;
  resource_key: string;
  lock_token: string;
  acquired_at: string;
  heartbeat_at: string;
  expires_at: string;
  kind: ResourceKind;
  edital_id: string;
}

interface SelectedSheetResponse {
  ok: boolean;
  key: string;
  filename: string;
  kind: ResourceKind;
  is_programa: "SIM" | "NAO";
  month_year: string;
  resource_key: string;
  current_version: number | null;
  last_action: string | null;
  last_action_at: string | null;
  last_actor_email: string | null;
  last_actor_user_id: string | null;
  base64: string;
}
```

Consulte o arquivo para a lista completa (editais, metricas, programas, validacao, jobs).

---

## Performance crunched notes

- **Planilhas 5000+ linhas** — virtual scroll mantem DOM pequeno (overscan 5).
- **Geracao de XLSX no backend e sincrona** — timeout HTTP > 30s faz cliente ver resultado antigo; preferir `?async=true` quando habilitado.
- **Heartbeat de lock 45s** com grace de 120s no backend — se a aba do browser ficar em suspend por mais de ~3 min, o lock expira e um aviso aparece ao voltar.

---

## Testes frontend

```bash
cd frontend
npm test            # watch
npm run test:run    # single pass (CI)
```

Arquivos `*.test.ts(x)` cobrem todos os hooks, as paginas principais (`LoginPage`, `EditaisPage`, `CorrectionPage`) e utilitarios de `lib/`.
