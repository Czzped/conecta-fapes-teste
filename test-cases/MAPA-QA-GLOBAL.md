# 🗺️ Mapa Global de QA, Regras e Rotas — Conecta FAPES

> 🤖 **GUIA DE LEITURA OBRIGATÓRIO PARA AGENTES DE IA (TOKEN-SAVING):**
> **LEIA APENAS ESTE ARQUIVO** antes de criar ou relatar Casos de Teste (CTs) ou Bugs.
> Não leia os arquivos `README.md` de 16 módulos nem explore árvores de diretórios recursivamente.
> Este índice consolidado contém o mapeamento de 100% das telas, módulos proprietários, regras canônicas principais e caminhos exatos de arquivos.

---

## 🎯 1. Fluxo de Decisão Rápido para a IA

```text
1. Identifique o canal (Frontoffice ou Backoffice) e a Tela/Funcionalidade da solicitação.
2. Localize a linha correspondente na Matriz (Seção 2 ou 3 deste documento).
3. Obtenha:
   - O Módulo Proprietário (ex: M004, M014).
   - A Regra Canônica / Invariante a referenciar (ex: RN02, RI1).
   - O caminho exato da pasta de Testes e da pasta de Bugs.
   - O prefixo padronizado do ID (CT-... ou BUG-...).
4. Crie o arquivo diretamente na pasta indicada seguindo o template oficial em:
   - test-cases/referencias/instrucoes-ia-casos-de-teste.md
   - test-cases/referencias/instrucoes-ia-relato-de-bug.md
```

---

## 💻 2. Matriz Frontoffice (Portal Coordenador e Bolsista)

**Aplicação:** `https://frontoffice-conecta.vercel.app/` / `https://conectafapes.hom.es.gov.br`  
**Público:** Coordenador de Projeto e Bolsista

| Tela / Funcionalidade | Rota do Frontend | Módulos | Regras Canônicas / Validações Chave | Pasta de Casos de Teste | Pasta de Bugs | Prefixo do ID (Bug) |
|---|---|---|---|---|---|---|
| **Página Inicial (Dashboard)** | `/coordenador/inicio` | M003, M009 | Visão geral do projeto selecionado, alertas de pendências, status da iniciativa | `frontoffice/coordenador/inicio/` | `.../inicio/bugs/` | `BUG-M003-FO-INIT-xxx` |
| **Minhas Informações (Perfil)** | `/coordenador/informacoes` | M008 | Dados pessoais, endereço, contatos, validação de CPF e dados bancários obrigatórios | `frontoffice/coordenador/informacoes/` | `.../informacoes/bugs/` | `BUG-M008-FO-PERF-xxx` |
| **Meus Pagamentos** | `/coordenador/pagamentos` | M004 | Extrato de bolsas recebidas pelo próprio usuário, mês de referência, situação | `frontoffice/coordenador/pagamentos/` | `.../pagamentos/bugs/` | `BUG-M004-FO-PAG-xxx` |
| **Meu Projeto** | `/coordenador/projetos` | M003, M009 | Dados gerais da iniciativa, vigência, edital vinculado, instituição executora | `frontoffice/coordenador/projetos/` | `.../projetos/bugs/` | `BUG-M003-FO-PROJ-xxx` |
| **Minha Equipe** | `/coordenador/minha-equipe` | M003, M009 | Lista de membros, bolsistas ativos, plano de trabalho e período de vigência de bolsa | `frontoffice/coordenador/minha-equipe/` | `.../minha-equipe/bugs/` | `BUG-M009-FO-EQUIP-xxx` |
| **Cadastrar Bolsista** | `/coordenador/cadastrar-bolsista` | M009, M008 | Validação de CPF, dados bancários, modalidade de bolsa compatível, não acumulação | `frontoffice/coordenador/minha-equipe/cadastrar-bolsista/` | `.../cadastrar-bolsista/bugs/` | `BUG-M009-FO-CADB-xxx` |
| **Solicitar Auxílio** | `/coordenador/solicitar-auxilio` | M003, M009 | Solicitação de benefícios, limites de auxílio por edital | `frontoffice/coordenador/minha-equipe/solicitar-auxilio/` | `.../solicitar-auxilio/bugs/` | `BUG-M003-FO-AUXI-xxx` |
| **Pagamentos do Projeto** | `/coordenador/pagamentos-projeto` | M004 | Visão consolidada da folha do projeto, histórico de remessas e depósitos | `frontoffice/coordenador/minha-equipe/pagamentos-projeto/` | `.../pagamentos-projeto/bugs/` | `BUG-M004-FO-FOLHA-xxx` |
| **Certificados / Diárias** | `/coordenador/certificados` | M014, M003 | Solicitação operacional de diária, aceite do bolsista, relatório de viagem | `frontoffice/coordenador/certificados/` | `.../certificados/bugs/` | `BUG-M014-FO-DIAR-xxx` |
| **Prestação Financeira (Geral)** | `/coordenador/financeira` | M014, M013 | `RN01` (Rascunho/Revisão), `RN02` (Conciliação extrato x despesa), `RN08` (Terminal) | `frontoffice/coordenador/prestacao-contas/financeira/` | `.../financeira/bugs/` | `BUG-M014-FO-PREST-xxx` |
| **Comprovar Débito — Passagem** | `/coordenador/prestacao-financeira/detalhes/:id` | M014, M013 | `RN12` (Comprovante pgto + viagem), `RI-PAS01` (Origem ≠ Destino), `RI-PAS02` (Chegada > Saída) | `.../comprovar-debito/passagem/` | `.../comprovar-debito/bugs/passagem/` | `BUG-M014-FO-PAS-xxx` |
| **Comprovar Débito — Nota Fiscal** | `/coordenador/prestacao-financeira/detalhes/:id` | M014, M013 | `RN05` (Até 3 orçamentos > R$ 1.400), `RN06` (Chave NF 44 dígitos), `RN07` (Rubrica) | `.../comprovar-debito/nota-fiscal/` | `.../comprovar-debito/bugs/nota fiscal/` | `BUG-M014-FO-NF-xxx` |
| **Comprovar Débito — Invoice** | `/coordenador/prestacao-financeira/detalhes/:id` | M014, M013 | Comprovante de remessa/câmbio, invoice comercial, conversão cambial na data | `.../comprovar-debito/invoice/` | `.../comprovar-debito/bugs/invoice/` | `BUG-M014-FO-INV-xxx` |
| **Classificar Crédito** | `/coordenador/prestacao-financeira/classificar-credito/:id` | M014 | `RN11` (Estorno, Rendimento, Pendente), `RN13` (Associação crédito x débito) | `.../classificar-credito/` | `.../classificar-credito/bugs/` | `BUG-M014-FO-CRED-xxx` |
| **Prestação Técnica** | `/coordenador/prestacao-contas-tecnica` | M014 | Relatório de cumprimento do objeto, metas alcançadas, produtos gerados | `frontoffice/coordenador/prestacao-contas/tecnica/` | `.../tecnica/bugs/` | `BUG-M014-FO-TEC-xxx` |
| **Remanejamento Orçamentário** | `/coordenador/remanejamento` | M013 | Transferência de saldo entre rubricas aprovadas, limite percentual sem aditivo | `frontoffice/coordenador/prestacao-contas/remanejamento/` | `.../remanejamento/bugs/` | `BUG-M013-FO-REM-xxx` |

---

## 🏛️ 3. Matriz Backoffice (Portal Admin / FAPES)

**Aplicação:** Portal Admin  
**Público:** Operadores GEPOF, Analistas FAPES, Diretores (DIRAF), Administradores

| Tela / Funcionalidade | Rota / Área | Módulos | Regras Canônicas / Validações Chave | Pasta de Casos de Teste | Pasta de Bugs | Prefixo do ID (Bug) |
|---|---|---|---|---|---|---|
| **Gestão de Modalidades** | `/admin/modalidades` | M001 | Cadastro de modalidades de bolsa, valores tabelados, vigências e critérios | `backoffice/admin/modalidades/` | `.../modalidades/bugs/` | `BUG-M001-BO-MODAL-xxx` |
| **Importação SIGFAPES** | `/admin/importacao` | M002 | Lotes de importação de iniciativas e orçamentos legados, reprocessamento de falhas | `backoffice/admin/importacao/` | `.../importacao/bugs/` | `BUG-M002-BO-IMP-xxx` |
| **Gestão de Iniciativas** | `/admin/iniciativas` | M003 | Termos de outorga, contas bancárias vinculadas, vigências e bloqueios | `backoffice/admin/iniciativas/` | `.../iniciativas/bugs/` | `BUG-M003-BO-INIT-xxx` |
| **Folhas e Remessas Bancárias** | `/admin/pagamentos` | M004 | Fechamento de folha mensal, geração de remessa CNAB Banestes, processamento de retorno | `backoffice/admin/pagamentos-folhas/` | `.../pagamentos-folhas/bugs/` | `BUG-M004-BO-FOLHA-xxx` |
| **Cadastros Corporativos** | `/admin/cadastros` | M008 | Gestão de Pessoas, Instituições executoras/parceiras, Áreas Técnicas FAPES | `backoffice/admin/cadastros/` | `.../cadastros/bugs/` | `BUG-M008-BO-CAD-xxx` |
| **Gestão Geral de Bolsistas** | `/admin/bolsistas` | M009 | Homologação de bolsistas, verificação de pendências impeditivas, histórico | `backoffice/admin/bolsistas/` | `.../bolsistas/bugs/` | `BUG-M009-BO-BOLS-xxx` |
| **Análise de Prestação de Contas** | `/admin/prestacao-contas` | M014 | `RN03` (Bloqueio em análise), `RN08` (Terminal), `RN10` (Aprovar, Negar ou Diligência/Revisão) | `backoffice/admin/prestacao-contas-analise/` | `.../prestacao-contas-analise/bugs/` | `BUG-M014-BO-PREST-xxx` |
| **Suspensões e Cancelamentos** | `/admin/suspensoes` | M015 | Bloqueio temporário de pagamentos por inadimplência, cancelamento com cancelamento de saldos | `backoffice/admin/suspensoes/` | `.../suspensoes/bugs/` | `BUG-M015-BO-SUSP-xxx` |

---

## 📐 4. Invariantes Globais e Regras de Validação de Interface

Regras transversais aplicáveis a formulários de todo o sistema:

1. **Valores Monetários (`RI1`)**: Todo campo monetário deve ser >= 0,00. Valores negativos são estritamente bloqueados na digitação ou submissão.
2. **Datas Cronológicas**:
   * Vigências, itinerários e períodos: `Data Fim / Chegada` deve ser estritamente posterior à `Data Início / Saída`.
   * Datas de emissão e notas fiscais: Não podem ser datas futuras (`Data <= DataAtual`).
3. **Documentos de Identificação**:
   * CPF: 11 dígitos com validação de dígitos verificadores (algoritmo Módulo 11).
   * Chave de NF-e: Exatamente 44 dígitos numéricos válidos.
4. **Arquivos Anexos**:
   * Formatos permitidos: PDF, PNG, JPG (XML para notas fiscais).
   * Tamanho máximo individual por arquivo: 10MB (ou 15MB conforme edital).
5. **Cotações e Orçamentos de Fornecedor (`RN05`)**:
   * Obrigatório até 3 cotações se valor da despesa for superior ao limite normativo (R$ 1.400,00).

---

## 🏷️ 5. Padrões Canônicos de Nomenclatura

### Casos de Teste (CT)
- **ID:** `CT-M0XX-[CANAL]-[NUMERO]` (ex: `CT-M014-FO-070`, `CT-M004-BO-001`)
- **Arquivo:** `CT-M0XX-[CANAL]-[NUMERO]-[slug-descritivo].md`
- **Título:** `[Ação clara no infinitivo] + [Resultado esperado]`

### Relatórios de Bug (BUG)
- **ID:** `BUG-M0XX-[CANAL]-[TAG_TELA]-[NUMERO]` (ex: `BUG-M014-FO-PAS-001`, `BUG-M004-BO-FOLHA-001`)
- **Arquivo:** `BUG-M0XX-[CANAL]-[TAG_TELA]-[NUMERO]-[slug-resumido].md`
- **Título:** Obrigatoriamente com a tag `[Bug]` no início:
  `## Título`
  `[Bug] [O que acontece] + [Onde acontece]`

---

## 📁 6. Regra Universal de Armazenamento de Arquivos
* Casos de Teste ficam no diretório da funcionalidade: `.../{perfil}/{tela}/CT-...md`
* Relatos de Bugs e suas evidências ficam SEMPRE na subpasta `bugs/` do fluxo testado: `.../{perfil}/{tela}/bugs/BUG-...md`
