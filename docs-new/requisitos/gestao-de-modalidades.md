---
title: Gestão de modalidades
tipo: requisito
---
# Gestão de modalidades

A gestão de modalidades é a área em que a equipe da FAPES define os tipos de bolsa que o sistema oferece e todas as regras que os acompanham: níveis, valores, moedas, base legal (resoluções) e requisitos exigidos dos bolsistas. É o cadastro-base sobre o qual toda a concessão de bolsas se apoia. Quando um edital é importado e uma alocação é criada, o sistema encontra aqui a definição de qual bolsa está sendo concedida, quanto ela vale e o que o bolsista precisa comprovar.

O conceito central é o **versionamento**. Uma modalidade (por exemplo, "Mestrado") não é editada livremente ao longo do tempo; em vez disso, ela ganha **versões**, cada uma com sua vigência, sua resolução de base, seus níveis, valores e requisitos. Isso preserva o histórico: bolsas concedidas sob uma versão antiga continuam regidas por ela, enquanto novas concessões passam a usar a versão vigente. A regra que amarra tudo é a de **uma única versão ativa por modalidade a cada momento**.

Este requisito descreve o comportamento da área administrativa (equipe interna da FAPES). O operador é o perfil que mantém esses cadastros.

## Atores

- **Operador da FAPES**: perfil responsável por criar, editar, versionar e inativar modalidades, níveis, valores, moedas, resoluções e requisitos. Todas as operações de cadastro descritas aqui são realizadas por esse perfil.
- **Administrador**: possui acesso amplo e também pode manter esses cadastros.
- **Demais funcionalidades (consumidoras)**: a importação de editais e a implementação de bolsa consultam esses cadastros para resolver qual versão de nível se aplica a cada bolsa e quais documentos são exigidos. Não editam o cadastro, apenas o utilizam.

## Fluxo principal

1. O operador cria uma **modalidade** informando sigla e nome. A sigla é padronizada em maiúsculas.
2. O operador cria uma **versão** da modalidade, associando-a a uma **resolução** (base legal) e definindo a data de início de vigência e a redução por vínculo. A versão nasce em edição.
3. Ao criar a nova versão, o sistema **copia automaticamente** os requisitos e os níveis da versão ativa anterior, poupando retrabalho.
4. Ainda com a versão em edição, o operador ajusta os **níveis** (por exemplo, N1, N2), associando a cada nível um **valor** em uma **moeda**.
5. O operador associa os **requisitos** (documentos e condições) à versão da modalidade e, quando aplicável, a níveis específicos.
6. Quando a versão está pronta, o operador a **ativa**. A versão passa a ser a vigente e a versão ativa anterior é automaticamente inativada, com data de fim de vigência preenchida.
7. A partir daí, novas alocações de bolsa passam a se apoiar na versão recém-ativada; as bolsas já concedidas permanecem vinculadas à versão sob a qual nasceram.
8. Modalidades, moedas e resoluções podem ser consultadas, editadas (dentro das regras) e, quando não houver vínculos, excluídas.

## Regras de negócio

### Modalidade

- A **sigla** é única, de até 10 caracteres, sempre armazenada em maiúsculas. Sigla duplicada é recusada com a mensagem de que já existe um registro com esta sigla.
- O **nome** é único, de até 100 caracteres. Nome duplicado é recusado com a mensagem de que já existe um registro com este nome.
- Enquanto a modalidade tiver **mais de uma versão**, seu nome e sua sigla não podem mais ser alterados (a mudança é bloqueada por restrição), preservando a identidade histórica.
- Uma modalidade **sem versões** pode ser excluída. Uma modalidade **com versões** não pode ser excluída, e a tentativa é recusada com a mensagem de que não é possível excluir modalidade com versões.

### Versões e a regra de uma versão ativa

- Cada versão tem um ciclo de vida em três estados: **em edição → ativa → inativa**.
- **Não pode existir mais de uma versão em edição** ao mesmo tempo para a mesma modalidade. Tentar criar uma segunda versão em edição é recusado com a mensagem de que já existe uma versão em edição.
- **Uma única versão ativa por vez**: ao ativar uma versão, a versão que estava ativa é automaticamente inativada e recebe data de fim de vigência. Assim, em qualquer momento, no máximo uma versão da modalidade está vigente.
- A data de início de vigência de uma nova versão precisa ser **posterior** à da versão ativa. Uma data anterior é recusada com a mensagem de que a data de início deve ser posterior à versão ativa.
- Ao criar uma versão, se a sigla não for informada, ela é **gerada automaticamente** no formato sigla da modalidade seguida do ano.
- Ao criar a versão, **requisitos e níveis da versão ativa anterior são copiados** automaticamente para a nova versão.
- **Somente versões em edição podem ser editadas ou excluídas.** Tentar editar uma versão ativa (ou inativa) é recusado com a mensagem de que somente versões em edição podem ser alteradas.
- Ao excluir uma versão em edição, os níveis que ficarem órfãos são removidos junto (em cascata).
- **Desativar** uma versão ativa a leva ao estado inativa e preenche a data de fim de vigência com a data atual.

### Redução por vínculo

- Cada versão carrega um fator de **redução por vínculo**, usado quando o bolsista possui outro vínculo que reduz o valor da bolsa. Esse fator é a base para o sistema localizar, na importação, o nível de bolsa com valor reduzido correspondente (ver [[importacao-de-editais]]).

### Níveis e valores

- Um **nível de bolsa** tem sigla única, armazenada em maiúsculas. Sigla duplicada é recusada.
- A associação de um nível a uma versão (nível da versão) define o **valor** e a **moeda**. O valor precisa ser **maior que zero**; valor zero ou negativo é recusado com erro de validação.
- Um mesmo nível não pode ser associado duas vezes à mesma versão. A duplicação é recusada com a mensagem de que o nível já está associado a esta versão.

### Moedas

- Uma moeda tem **símbolo** único e **nome** único; o nome é armazenado em maiúsculas. Símbolo ou nome duplicado é recusado com mensagem específica.

### Resoluções (base legal) e validações de resolução

- Uma resolução tem número, data, ementa, link e número de rastreio de processo eletrônico.
- O **número** da resolução é único; número duplicado é recusado com a mensagem de que já existe uma resolução com este número.
- A **ementa** é limitada a 500 caracteres.
- O **link** da resolução deve apontar para o domínio oficial da FAPES; links de outros domínios são recusados.
- Uma resolução **vinculada a versões de modalidade não pode ser excluída**; a tentativa é recusada com a mensagem de que não é possível excluir resolução com modalidades vinculadas.

### Requisitos

- Um requisito descreve uma exigência: tipo, descrição, se possui comprovante, qual o comprovante e se o comprovante é **perene** (permanece válido entre bolsas do mesmo bolsista, dispensando reenvio).
- O **tipo** é obrigatório; criar requisito sem tipo é recusado com erro de validação.
- Um requisito pode ser associado a uma **versão de modalidade** ou a uma **versão de nível** específica. A associação (e sua remoção) é feita por meio do vínculo entre requisito e versão.
- Ao remover a associação, o vínculo entre requisito e versão é excluído, sem apagar o requisito em si.

## Estados e transições

Estados de uma versão de modalidade:

- **Em edição**: estado inicial; único estado em que a versão pode ser editada ou excluída. No máximo uma por modalidade.
- **Ativa**: versão vigente; no máximo uma por modalidade. Não pode ser editada.
- **Inativa**: versão encerrada, com data de fim de vigência preenchida.

Transições:

- (nova) → **Em edição**: criação da versão (copia requisitos e níveis da versão ativa anterior).
- Em edição → **Ativa**: ativação. A versão ativa anterior passa a inativa, com data de fim de vigência.
- Ativa → **Inativa**: desativação direta, com data de fim de vigência na data atual.
- Em edição → (excluída): exclusão da versão; níveis órfãos removidos em cascata.

Transições bloqueadas:

- Criar segunda versão em edição: recusada.
- Editar/excluir versão ativa ou inativa: recusada.
- Ativar versão com data de início anterior à da versão ativa: recusada.

## Casos especiais e exceções

- **Cópia automática ao versionar**: a nova versão já nasce com os requisitos e níveis herdados da versão ativa; o operador ajusta a partir daí, em vez de recomeçar.
- **Sigla de versão automática**: se não informada, é derivada da sigla da modalidade e do ano.
- **Ementa acima de 500 caracteres**: recusada.
- **Link de resolução fora do domínio da FAPES**: recusado.
- **Exclusões bloqueadas por vínculo**: modalidade com versões e resolução com versões vinculadas não podem ser excluídas.
- **Bloqueio de edição de identidade**: com mais de uma versão, nome e sigla da modalidade tornam-se imutáveis.
- **Valor não positivo**: valor de nível igual a zero ou negativo é recusado.
- **Duplicidades**: sigla de modalidade, nome de modalidade, sigla de nível, símbolo e nome de moeda, e número de resolução são todos únicos.

## Dados envolvidos

- [[ModalidadeBolsa]] — a modalidade: sigla e nome únicos.
- [[VersaoModalidade]] — cada versão: descrição, datas de início e fim de vigência, estado (em edição / ativa / inativa), redução por vínculo, sigla, vínculo com [[ModalidadeBolsa]] e [[Resolucao]].
- [[Versao]] — controle de versionamento associado.
- [[ModalidadeBolsaVersaoModalidade]] — relação entre modalidade e suas versões.
- [[NivelBolsa]] — os níveis de bolsa (sigla única).
- [[VersaoNivel]] — associação de um nível a uma versão, com valor e moeda.
- [[Moeda]] — moedas (símbolo e nome únicos).
- [[Resolucao]] — base legal: número, data, ementa (até 500 caracteres), link (domínio FAPES), número de rastreio de processo eletrônico.
- [[RequisitoBolsa]] — requisitos: tipo, descrição, comprovante e marcação de comprovante perene.
- [[RequisitoVersao]] — vínculo entre requisito e versão de modalidade ou de nível.

## Funcionalidades relacionadas

- [[importacao-de-editais]]
- [[implementacao-de-bolsa]]
- [[solicitacao-de-bolsa]]
- [[gestao-de-documentos]]
- [[pagamentos]]
- [[remanejamento-de-cotas]]
- [[painel-e-indicadores]]
- [[autenticacao-autorizacao]]
- [[gestao-usuarios-backoffice]]
