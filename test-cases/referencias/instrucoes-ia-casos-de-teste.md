# 🤖 Instruções para IA — Criação de Casos de Teste e Otimização de Tokens

Este documento é um guia de comportamento e eficiência para agentes de Inteligência Artificial (LLMs) que atuam na criação, edição ou validação de casos de teste (CTs) neste projeto. 

**LEITURA OBRIGATÓRIA PARA A IA ANTES DE INICIAR QUALQUER TAREFA DE TESTE.**

---

## 🎯 1. Fluxo de Trabalho com Token-Saving (Economia de Contexto)

Para evitar consumo desnecessário de tokens (o que atrasa a execução e aumenta custos), siga estritamente estas diretrizes de leitura:

### ❌ O que NÃO fazer:
* **Não liste diretórios recursivamente** buscando arquivos de regras.
* **Não leia arquivos de documentação inteiros** (como `README.md` do módulo com centenas de linhas) se você precisa de apenas uma regra específica.
* **Não invente regras de negócio** baseando-se apenas no comportamento visual do frontend.

###  O que FAZER (Leitura Cirúrgica):
1. **Identifique a Rota e o Módulo**: Consulte a tabela em [`test-cases/frontoffice/coordenador/README.md`](../frontoffice/coordenador/README.md) para saber qual módulo (`M0xx`) é dono da regra.
2. **Leitura Focada por Linhas**: Abra o arquivo `README.md` do módulo (ex: `docs/implementation/modules/M014-prestacao-contas/README.md`) e utilize leitura de linhas delimitadas (`StartLine` e `EndLine`) apenas no trecho que descreve as regras de negócio (`RNxx`) ou invariantes (`RIxx`) relacionadas à sua tarefa.
3. **Leitura do Template**: Leia o arquivo [`test-cases/referencias/criacao-dos-cenarios-de-teste.md`](criacao-dos-cenarios-de-teste.md) para absorver o formato estruturado do cenário.

---

## 📑 2. Estrutura Canônica de um Caso de Teste (CT)

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

## 🗣️ 3. Dicionário de Termos do Domínio (Evite Sinônimos)
Para manter o alinhamento com a arquitetura DDD do projeto, utilize **apenas** a nomenclatura oficial abaixo, sem termos alternativos:

* **`Prestacao`**: O agregado/processo de prestação de contas.
* **`JustificativaDespesa`**: Despesa declarada pelo coordenador.
* **`TransacaoFinanceira`**: Movimentação bancária importada do banco.
* **`RubricaProjeto`**: Classificação orçamentária do projeto (M013).
* **`DocumentoFiscal`**, **`ItemDocumentoFiscal`**, **`OrcamentoFornecedor`**: Elementos pertencentes à prestação (M014).

---

## 🚀 4. Instruções de Geração (Output Tokens)
Quando o usuário solicitar a criação de um arquivo de teste:
1. Gere o conteúdo markdown estritamente limpo dentro do bloco de código.
2. Evite explicações preliminares ou resumos amigáveis do tipo *"Aqui está o seu arquivo..."*. Vá direto ao ponto ou execute a ferramenta de escrita imediatamente.
