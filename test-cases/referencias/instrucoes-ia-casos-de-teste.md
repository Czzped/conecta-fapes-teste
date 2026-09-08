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

### ✅ O que FAZER (Leitura Cirúrgica em 3 Passos):
1. **Consulte o Mapa Central Primeiro**: Leia PRIMEIRO o arquivo [`test-cases/MAPA-QA-GLOBAL.md`](../MAPA-QA-GLOBAL.md). Ele consolida a rota, tela, módulo proprietário, regras e pasta exata para criação do caso de teste (Frontoffice e Backoffice).
2. **Leitura Focada por Linhas (Apenas se necessário)**: Se precisar de detalhes de exceções não cobertos no mapa, acesse apenas as linhas de regras de negócio (`RNxx`) no `README.md` do módulo indicado (`docs/implementation/modules/M0xx/README.md`) usando `StartLine` e `EndLine`.
3. **Template Estruturado**: Siga rigorosamente o padrão canônico do template na Seção 2 abaixo e grave o arquivo `.md` no diretório correspondente à tela mapeada.

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
