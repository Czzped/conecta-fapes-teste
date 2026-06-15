# Eventos de Dominio — M024 Curriculo do Pesquisador

Referencia de dominio e regras: [README.md](README.md) | [Modelo Estrutural](modelo-estrutural.md) | [Adapter Lattes (M023)](../M023-integracoes/lattes/adapter.md) | [Catalogo de Eventos de Notificacao (M020)](../M020-comunicacao/notificacoes/catalogo-eventos.md)

M024 opera de forma **sincrona** com o adapter [M023/lattes](../M023-integracoes/lattes/README.md): a chamada ao adapter retorna um snapshot academico normalizado ou um erro. M024 persiste esse snapshot em transacao propria. **Nao ha eventos assincronos consumidos do adapter** -- erros do adapter sao propagados em-linha como excecao/codigo de erro HTTP `502 ADAPTER_LATTES_FALHOU`.

Apos cada mutacao com sucesso, M024 publica eventos de dominio para os consumidores. Os eventos sao **dominio puro** (in-process); cada consumidor escolhe se trata sincronamente (handler in-process) ou assincronamente (subscriber no barramento).

---

## Eventos Publicados

### `PesquisadorVinculado`

Publicado quando uma `PessoaFisica` recebe `Curriculo` pela primeira vez (resposta com sucesso a `VincularCurriculo`).

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `cpf` | string | CPF da PessoaFisica |
| `numeroLattes` | string | Numero Lattes recem-vinculado |
| `dataVinculacao` | datetime | Data e hora da vinculacao |
| `versaoInicial` | integer | Versao do snapshot apos a primeira importacao (sempre 1) |

**Consumidores:**
- M020 -- notifica pesquisador (email/portal) que o curriculo foi vinculado com sucesso.
- M018 -- atualiza indicador de pesquisadores cadastrados.
- M008 -- recalcula `PessoaFisica.nivelAcademico` a partir do nivel mais alto concluido em `FormacaoAcademica`.

---

### `CurriculoAtualizado`

Publicado a cada `SincronizarCurriculo` concluido com sucesso (apos a primeira vinculacao).

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `cpf` | string | CPF da PessoaFisica |
| `numeroLattes` | string | Numero Lattes |
| `versao` | integer | Nova versao do snapshot |
| `dataSincronizacao` | datetime | Data da sincronizacao |
| `contagens` | object | Numero de itens por entidade pos-import: formacoes, artigos, livros, orientacoes, projetos, premios, eventos, idiomas |

**Consumidores:**
- M011 -- revalida selecao de Ad Hoc para captacoes em andamento.
- M018 -- recalcula indicadores de producao cientifica.
- M019 -- atualiza vitrine publica.
- M020 -- notifica pesquisador.
- M008 -- recalcula `PessoaFisica.nivelAcademico`.

---

### `AreaConhecimentoNaoMapeada`

Publicado quando a sincronizacao encontra no Lattes uma area de conhecimento que nao bate com o cadastro canonico CNPq em M008 §1.3.6 (RN-M024-06). Disparado in-line durante a importacao -- nao bloqueia o `SincronizarCurriculo`.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `cpf` | string | CPF da PessoaFisica |
| `areaLattesString` | string | Rotulo bruto vindo do Lattes |
| `dataSincronizacao` | datetime | Data da sincronizacao que detectou a discrepancia |

**Consumidores:**
- Log estruturado / dashboard de curadoria do cadastro de Area de Conhecimento (M008).

---

### `PesquisadorSuspenso`

Publicado quando o `Curriculo` de um pesquisador passa a ser inelegivel por suspensao da `PessoaFisica` em M008 (RN-M024-05). M024 assina o evento `PessoaSuspensa` de M008 e republica em forma especifica para consumidores do dominio do curriculo.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `cpf` | string | CPF da PessoaFisica suspensa |
| `numeroLattes` | string | Numero Lattes vinculado, quando houver |
| `dataSuspensao` | datetime | Data e hora da suspensao |

**Consumidores:**
- M011 -- remove pesquisador do pool de Ad Hoc.
- M019 -- oculta da vitrine publica.

---

### `PesquisadorReativado`

Publicado quando uma `PessoaFisica` previamente suspensa e reativada em M008 e possui `Curriculo` vinculado.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `cpf` | string | CPF da PessoaFisica reativada |
| `numeroLattes` | string | Numero Lattes vinculado, quando houver |
| `dataReativacao` | datetime | Data e hora da reativacao |

**Consumidores:**
- M011 -- reinsere pesquisador no pool de Ad Hoc, se curriculo valido por RN-M024-04.
- M019 -- reativa exibicao na vitrine publica.

---

## Resumo das integracoes

| Direcao | Evento | Origem | Destinos |
|---------|--------|--------|----------|
| Publica | `PesquisadorVinculado` | M024 | M008, M018, M020 |
| Publica | `CurriculoAtualizado` | M024 | M008, M011, M018, M019, M020 |
| Publica | `AreaConhecimentoNaoMapeada` | M024 | Log/curadoria |
| Publica | `PesquisadorSuspenso` | M024 | M011, M019 |
| Publica | `PesquisadorReativado` | M024 | M011, M019 |
| Consome | `PessoaSuspensa` | M008 | M024 |
| Consome | `PessoaReativada` | M008 | M024 |

## Eventos Consumidos

### `PessoaSuspensa`

Consumido de M008 quando uma `PessoaFisica` entra em estado suspenso. Se a pessoa possuir `Curriculo` vinculado, M024 publica `PesquisadorSuspenso` para consumidores do dominio academico.

### `PessoaReativada`

Consumido de M008 quando uma `PessoaFisica` suspensa e reativada. Se a pessoa possuir `Curriculo` vinculado, M024 publica `PesquisadorReativado`; consumidores aplicam RN-M024-04 para decidir se o curriculo volta a ser elegivel.

> **Nao ha eventos consumidos do adapter M023/lattes.** Toda comunicacao com o adapter e por chamada sincrona retornando snapshot ou erro -- ver [M023/lattes/adapter.md](../M023-integracoes/lattes/adapter.md).
