# M021 - Gestao de Formularios

[Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 06 - Suporte e Inteligencia](../../../discovery/domains/06-suporte-inteligencia.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST concreta |
| [Backlog](backlog.md) | EPICs e rastreabilidade do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Entidades de formulario, versao, campos e classificacao |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclo de vida da versao do formulario |

---

## Sobre o Modulo

O M021 centraliza a base de formularios reutilizaveis da FAPES. O Gestor da FAPES pode criar, versionar, classificar, publicar, inativar e consultar formularios usados por outros modulos, especialmente no M011 para submissao de propostas, avaliacao ad hoc e revisao de resultado.

Esse modulo evita que cada captacao crie formularios do zero. Em vez disso, os processos selecionam formularios e versoes existentes na base, garantindo padronizacao, rastreabilidade e reuso.

---

## Dominio

Um `Formulario` representa um instrumento reutilizavel de coleta de informacoes. Ele possui classificacao, finalidade e uma ou mais versoes. A estrutura editavel fica em `VersaoFormulario`, que contem secoes, campos, regras de obrigatoriedade, tipos de resposta e criterios de validacao.

Uma versao publicada nao pode ser alterada diretamente. Quando for necessario mudar um formulario em uso, deve ser criada uma nova versao.

O M021 nao executa o fluxo de captacao nem armazena as respostas das propostas; ele fornece a definicao versionada dos formularios. O M011 seleciona os formularios da base e usa suas versoes na configuracao da captacao.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Todo formulario deve possuir nome, classificacao e finalidade. | Must |
| RN02 | Todo formulario deve possuir ao menos uma versao antes de ser publicado para uso. | Must |
| RN03 | Uma versao publicada de formulario nao pode ser alterada diretamente. | Must |
| RN04 | Alteracoes em formulario publicado devem gerar nova versao. | Must |
| RN05 | Uma versao de formulario so pode ser publicada se possuir ao menos uma secao e um campo. | Must |
| RN06 | Campos podem ser obrigatorios, opcionais ou condicionais. | Must |
| RN07 | Campos condicionais devem possuir regra de exibicao ou dependencia explicitada. | Must |
| RN08 | Formularios podem ser classificados por uso, como submissao, avaliacao ad hoc, revisao de resultado, cadastro ou acompanhamento. | Must |
| RN09 | Apenas versoes publicadas e ativas podem ser selecionadas por outros modulos. | Must |
| RN10 | Formularios inativados permanecem historicos e nao podem ser selecionados para novas configuracoes. | Must |

## Integracoes

| Modulo | Uso |
|--------|-----|
| M011 | Seleciona formularios e versoes para configuracao de captacao. |
| M003 | Pode consultar a definicao original dos formularios que originaram uma iniciativa. |
| M008 | Fornece usuarios/gestores responsaveis pela criacao e publicacao. |
