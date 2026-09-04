# 🤖 Instruções para IA — Relato de Bugs e Otimização de Tokens

Este documento é um guia de comportamento, padrão e eficiência para agentes de Inteligência Artificial (LLMs) que atuam na identificação, registro ou documentação de **bugs (defeitos de software)** neste projeto.

**LEITURA OBRIGATÓRIA PARA A IA ANTES DE CRIAR OU EDITAR RELATÓRIOS DE BUG.**

---

## 🎯 1. Fluxo de Trabalho com Token-Saving (Economia de Contexto)

Para relatar um bug com máxima eficiência, sem desperdício de tokens de contexto e sem adivinhações, siga estritamente estas diretrizes:

### ❌ O que NÃO fazer:
* **Não adivinhe a solução técnica ou causa raiz**: O papel do relato de bug é documentar o comportamento observado com evidências e fatos. Não parta do princípio de que você sabe a resolução do código nem imponha correções técnicas; no máximo, inclua uma seção opcional de sugestão.
* **Não adivinhe regras de negócio**: Não declare que um comportamento é bug baseado apenas em impressão visual. Valide sempre contra as regras de negócio (`RNxx`) ou invariantes (`RIxx`) do módulo.
* **Não leia arquivos gigantes por inteiro**: Se precisa saber o comportamento esperado de um módulo, leia apenas o arquivo `README.md` do módulo correspondente em `docs/implementation/modules/M0xx-name/README.md` usando leitura por intervalo de linhas (`StartLine` / `EndLine`).
* **Não prolixize a descrição**: Evite textos longos ou narrativos. Seja direto, técnico e estruture o problema em passos acionáveis.

### ✅ O que FAZER (Investigação Cirúrgica):
1. **Confira o Template Padrão**: Consulte [`test-cases/referencias/estrutura-criacao-de-bug.md`](estrutura-criacao-de-bug.md) para absorver o padrão visual e campos obrigatórios.
2. **Localize o Módulo e Regra Relacionada**: Verifique qual módulo (`M001` a `M016`) gerencia a funcionalidade afetada para referenciar a `RN` ou `RI` exata que foi violada.
3. **Extraia Evidências Precisas**: Inclua mensagens de erro reais, payloads HTTP de falha, status codes REST (ex: 400, 403, 404, 500) ou caminhos de arquivos anexos.

---

## 📑 2. Estrutura Canônica de um Relatório de Bug (`.md`)

Todo relatório de bug gerado por uma IA deve seguir o template markdown abaixo, sem introduções textuais descartáveis no arquivo final:

```markdown
## Título
[Resumo direto: O que acontece + Onde acontece]

## ID
[BUG-M0XX-YYY ou ID da ferramenta de gestão]

## Requisito/Regra Violada
- Regra Canônica: [ID da RNxx ou RIxx do README do módulo]
- Rota/Componente: [/rota-do-frontend ou Endpoint da API]

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
[Ex: Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI]

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. [Ação inicial, ex: Acessar a rota X]
2. [Ação intermediária, ex: Selecionar o campo Y]
3. [Ação disparadora, ex: Clicar no botão Z]
4. [Observação da falha]

## Dados de Entrada
- [Valores específicos utilizados no momento da reprodução do erro]

## Comportamento Esperado
- [O que o sistema deveria fazer de acordo com os requisitos e documentação]

## Comportamento Atual
- [O que o sistema realmente fez, detalhando o erro visual ou retorno da API]

## Evidências
- 📷 Screenshots / Vídeos: [Caminho do arquivo ou link do anexo]
- 🧾 Logs / Retorno da API: `[StatusCode / Mensagem de Erro]`
```

---

## 🚦 3. Matriz de Gravidade e Prioridade

A IA deve classificar a severidade do bug com precisão objetiva:

| Nível | Ícone | Critério de Aplicação para a IA |
|---|---|---|
| **Bloqueante** | 🔴 | O erro impede a conclusão do fluxo principal (ex: crash da tela, erro 500 irrecuperável, incapacidade de salvar/enviar prestação). Não há contorno. |
| **Alta** | 🟠 | Funcionalidade importante com falha grave, mas existe uma alternativa/contorno manual temporário. |
| **Média** | 🟡 | Erro em funcionalidade secundária, falha em validações de contorno, desalinhamento de estado não crítico. |
| **Baixa** | 🟢 | Erro visual/cosmético (espaçamento, erro de digitação em label, desalinhamento de ícone) sem impacto funcional. |

---

## 🗣️ 4. Dicionário Ubíquo / Termos Oficiais do Domínio

Para manter a integridade com o DDD e documentação do Conecta FAPES, a IA deve utilizar **somente** os termos oficiais:

* **`Prestacao`**: O processo/agregado de prestação de contas (M014).
* **`TransacaoFinanceira`**: O lançamento/movimento bancário (Crédito ou Débito).
* **`JustificativaDespesa`**: O registro de comprovante de despesa (NF, Diária, Passagem, Invoice).
* **`RubricaProjeto`**: A classificação orçamentária vinculada no M013/M008.
* **`DocumentoFiscal`**, **`ItemDocumentoFiscal`**, **`OrcamentoFornecedor`**: Entidades filhas de comprovação.

---

## 🚀 5. Instruções de Execução Direct-to-File (Output Tokens)

Ao ser solicitada para registrar um bug:
1. **Escreva o arquivo `.md` diretamente** na pasta adequada utilizando as ferramentas de arquivo (`write_to_file`).
2. **Não faça introduções longas** no chat. Apresente um resumo sucinto com o link para o arquivo criado no formato markdown `[nome-do-arquivo.md](file:///caminho/completo)`.
