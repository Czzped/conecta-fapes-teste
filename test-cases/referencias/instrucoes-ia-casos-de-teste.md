# 🤖 Instruções para IA — Criação de Casos de Teste e Otimização de Tokens

Este documento é um guia de comportamento e eficiência para agentes de Inteligência Artificial (LLMs) que atuam na criação, edição ou validação de casos de teste (CTs) neste projeto. 

**LEITURA OBRIGATÓRIA PARA A IA ANTES DE INICIAR QUALQUER TAREFA DE TESTE.**

---

## 🛡️ 1. REGRA DE OURO: Repositório de Produção é ESTRITAMENTE READ-ONLY

* Os repositórios de código real puxados para o workspace (como `leds-conectafapes-frontoffice-frontend-develop/` e outros futuros) são **EXCLUSIVAMENTE PARA LEITURA (READ-ONLY)**.
* **NUNCA modifique, crie, renomeie ou delete nenhum arquivo nesses diretórios de código.**
* **NUNCA execute comandos que alterem arquivos ou o estado desses repositórios.**
* Qualquer arquivo gerado pela IA (casos de teste, relatórios de bug, notas de QA) deve ser salvo **exclusivamente dentro da pasta `test-cases/`**.

---

## 🎯 2. Fluxo de Trabalho com Token-Saving e Inspeção do Código Real

Para criar casos de teste precisos com consumo mínimo de tokens, a IA deve cruzar **3 Fontes de Verdade**:
1. **Regras de Negócio Canônicas:** Módulo correspondente em `docs/implementation/modules/M0xx/` e [`test-cases/MAPA-QA-GLOBAL.md`](../MAPA-QA-GLOBAL.md).
2. **Código em Produção (Inspeção Cirúrgica Read-Only):** Inspecionar o código real em `leds-conectafapes-frontoffice-frontend-develop/` para extrair detalhes técnicos reais da implementação.
3. **Padrão de QA:** O template canônico definido na Seção 3 deste documento.

### 🔍 Como Inspecionar o Código Real sem Desperdício de Tokens:
* **Rotas e Acesso:** Leia `src/modules/{Modulo}/router.ts` e `src/common/router/index.ts` para verificar rotas exatas e guards de permissão (`requiresCapabilities`, `requiresProjetoCoordenador`, `requiresAuth`).
* **Formulários e Componentes:** Leia a view correspondente em `src/modules/{Modulo}/view/` ou `components/` para identificar campos reais, labels, seletores, botões, estados desabilitados e máscaras.
* **Validações e Schemas Zod:** Inspecione `entities/` ou schemas Zod do módulo para checar limites de caracteres, obrigatoriedade, formatos (CPF, CNPJ, e-mail) e mensagens de erro exibidas.
* **Integração e Feedback:** Inspecione `api/` ou composables do módulo para checar endpoints consumidos, payloads esperados e toasts/mensagens de sucesso ou erro reais.
* **Detecção de Discrepâncias:** Se o código real divergir da regra de negócio (`RNxx`), a IA deve documentar o teste com base na regra canônica esperada e sinalizar a divergência (ou relatar como potencial bug).

### ❌ O que NÃO fazer:
* **Não altere nenhum arquivo de código-fonte.**
* **Não liste diretórios recursivamente** buscando arquivos de regras.
* **Não leia arquivos de documentação inteiros** quando precisar apenas de uma regra específica (use leitura por linhas).
* **Não invente regras de negócio** baseando-se apenas em suposições visuais.

### ✅ O que FAZER (Processo em 4 Passos):
1. **Localize no Mapa:** Consulte [`test-cases/MAPA-QA-GLOBAL.md`](../MAPA-QA-GLOBAL.md) para achar o módulo proprietário, a regra e o caminho de destino do arquivo.
2. **Inspecione o Código Real (Cirúrgico):** Consulte o componente, rota ou schema Zod no repositório de código para validar dados de entrada, botões e mensagens reais de tela.
3. **Consulte a Regra Canônica:** Se necessário detalhar a regra além do mapa, leia o trecho de `RNxx` no `README.md` do módulo (`docs/implementation/modules/M0xx/README.md`).
4. **Grave o Caso de Teste:** Crie o arquivo `.md` no diretório mapeado em `test-cases/` usando o template da Seção 3.

---

## 📑 3. Estrutura Canônica de um Caso de Teste (CT)

Todo arquivo `.md` de caso de teste deve ser criado na pasta correspondente à funcionalidade e seguir rigorosamente o template abaixo, sem adicionar conversas ou introduções textuais no arquivo final:

```markdown
## ID do Cenário
[CT-M0XX-FO-YYY]

## Título
[Ação clara no infinitivo + resultado esperado]

## Requisito/História Relacionada
- Requisito/Issue: [Link da Issue ou ID do EPIC]
- Regra Canônica: [ID da RNxx ou RIxx do README do módulo]
- Contrato/API: [Método/Query do contrato.md]

## Pré-condições
- [Contexto do usuário, estado do sistema e permissões]

## Passo a Passo
1. [Passo 1]
2. [Passo 2]

## Dados de Entrada
- [Valores específicos usados no teste para garantir repetibilidade]

## Resultado Esperado
- [Comportamento final do sistema após os passos]

## Tipo de Teste
[ ] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [ ] Média  [ ] Baixa
```

---

## 🗣️ 4. Dicionário de Termos do Domínio (Evite Sinônimos)
Para manter o alinhamento com a arquitetura DDD do projeto, utilize **apenas** a nomenclatura oficial abaixo, sem termos alternativos:

* **`Prestacao`**: O agregado/processo de prestação de contas.
* **`JustificativaDespesa`**: Despesa declarada pelo coordenador.
* **`TransacaoFinanceira`**: Movimentação bancária importada do banco.
* **`RubricaProjeto`**: Classificação orçamentária do projeto (M013).
* **`DocumentoFiscal`**, **`ItemDocumentoFiscal`**, **`OrcamentoFornecedor`**: Elementos pertencentes à prestação (M014).

---

## 🚀 5. Instruções de Geração (Output Tokens)
Quando o usuário solicitar a criação de um arquivo de teste:
1. Gere o conteúdo markdown estritamente limpo dentro do bloco de código.
2. Evite explicações preliminares ou resumos amigáveis do tipo *"Aqui está o seu arquivo..."*. Vá direto ao ponto ou execute a ferramenta de escrita imediatamente.
