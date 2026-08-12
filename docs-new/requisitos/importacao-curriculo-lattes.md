---
title: Importação de Currículo Lattes
tipo: requisito
---

# Importação de Currículo Lattes

Para avaliar um pesquisador, a FAPES precisa conhecer sua trajetória acadêmica. Antes, isso era feito anexando manualmente o currículo Lattes em PDF. Esta funcionalidade **substitui o anexo manual pela importação automática**: o coordenador informa apenas o **número Lattes de 16 dígitos** da pessoa e o sistema traz os dados do currículo diretamente da fonte externa do CNPq, estruturados e prontos para leitura dentro do próprio sistema — sem upload de arquivo e sem que o avaliador precise sair para consultar a Plataforma Lattes.

Os dados importados são **somente leitura**. Não faz parte desta funcionalidade editar manualmente o conteúdo importado nem um fluxo formal de aceite/rejeição do currículo — apenas importar, exibir para avaliação e manter atualizado sob demanda.

## Atores

- **Coordenador (responsável pelo pesquisador)**: informa o número Lattes e dispara a importação; também pode acionar a atualização e, quando o número é desconhecido, a busca do identificador.
- **Administrador da FAPES**: abre a tela do pesquisador e lê os dados do currículo para avaliação; também pode acionar a atualização.
- **Pesquisador (titular)**: pessoa já cadastrada no sistema, dona do currículo. Não opera a funcionalidade, mas é quem fornece (por outro caminho) o link do seu Lattes.
- **Fonte externa de currículos**: o serviço de currículos do CNPq em produção, e uma **fonte simulada** em desenvolvimento. Qual fonte usar é decidido por configuração de ambiente, sem mudança de comportamento visível.

## Fluxo principal

### 1. Importar pelo número Lattes (caminho normal)

1. O coordenador abre a tela de um pesquisador **já cadastrado**.
2. Informa o **número Lattes** (16 dígitos) e confirma.
3. O sistema valida o formato; sendo válido, busca os dados na fonte externa.
4. Encontrado o currículo, os dados são importados e **associados àquela pessoa**, sem nenhum upload. Fica registrado que é a **versão 1** e a **data/hora da sincronização**.

### 2. Visualizar para avaliação

O administrador abre a tela do pesquisador e lê o currículo de forma estruturada: resumo, áreas de atuação, formações acadêmicas, artigos, livros, orientações, participações em projetos e eventos, prêmios e idiomas. Junto, vê **quando foi a última sincronização bem-sucedida** e a **data em que o currículo foi atualizado na fonte**. Se ainda não houver dados importados, a tela deixa isso claro.

### 3. Atualizar (sincronizar) sob demanda

Quando quiser dados mais recentes, o coordenador ou o administrador aciona a **atualização**. Havendo novidade e respeitado o intervalo mínimo, o sistema registra uma **nova versão** e atualiza a data da última sincronização.

### 4. Localizar o identificador quando o número é desconhecido

Se o número Lattes não é conhecido, o coordenador aciona a **busca pelo identificador** usando **CPF, nome completo e data de nascimento** (dados já presentes no cadastro da pessoa). Havendo correspondência única na fonte, o sistema devolve o identificador, que então permite seguir com a importação.

## Regras de negócio

### Entrada e formato

- O número Lattes deve conter **exatamente 16 dígitos numéricos**. Fora disso (mais, menos, caracteres não numéricos ou vazio), a entrada é recusada **antes** de qualquer consulta à fonte externa.
- A localização por CPF, nome e data de nascimento exige **os três dados** e só é conclusiva quando a fonte retorna **exatamente um** currículo.

### Unicidade e associação

- Cada **pessoa tem no máximo um currículo**, e cada **número Lattes pertence a no máximo uma pessoa**.
- Reinformar, para a mesma pessoa, um número Lattes que já é dela **atualiza** o currículo existente em vez de criar outro.
- Tentar vincular a uma pessoa um número que já pertence a outra é **bloqueado**, com mensagem clara.

### Intervalo mínimo entre sincronizações (cooldown)

- Entre duas sincronizações **bem-sucedidas do mesmo pesquisador** há um **intervalo mínimo de 1 hora**. Dentro dessa janela, uma nova atualização é **bloqueada**, informando quando será possível repetir.
- O intervalo é contado a partir da **última sincronização bem-sucedida**. Uma tentativa que falha **não** reinicia o relógio — pode-se tentar de novo.

### Preservação em caso de falha

- Se a fonte estiver indisponível ou a comunicação falhar, a **última versão importada com sucesso é preservada por inteiro**: nada é perdido e o número da versão **não** avança.
- Na **primeira importação** de uma pessoa que ainda não tinha currículo, uma falha simplesmente não associa nada; o usuário é orientado a tentar mais tarde.

### O link do pesquisador é a fonte da verdade do número

- O link do Lattes guardado na pessoa (fornecido por ela em outro caminho) é tratado como a **verdade sobre qual é o número Lattes**.
- Se esse link passar a apontar um **número diferente** do que está guardado no currículo (ou seja, o pesquisador corrigiu o número), a próxima atualização **re-importa a partir do número novo**, atualizando o mesmo currículo (mantendo o vínculo com a pessoa). Nesse caso de **correção de fonte**, o sistema **ignora o intervalo de 1 hora** e a verificação de "não há novidade" — porque é conserto, não atualização de rotina.
- Se o número novo já pertencer a outra pessoa, a re-importação é **bloqueada**. Se a busca do currículo novo falhar, o currículo atual é preservado.

### Conteúdo importado é somente leitura

Os dados vindos da fonte não podem ser editados manualmente dentro do sistema. Não há, nesta entrega, um fluxo de aceitar ou rejeitar o currículo — apenas visualizá-lo para a avaliação.

### Fonte externa configurável por ambiente

- Qual fonte usar (a oficial do CNPq ou a simulada) é definido **por configuração de ambiente**, sem alterar o comportamento observável.
- Em **desenvolvimento** usa-se uma **fonte simulada** que se comporta como a oficial (mesmas entradas, saídas e condições de erro).
- Em **produção**, a fonte é o serviço oficial de currículos do CNPq. Como detalhe operacional (não de negócio), o acesso ao CNPq exige que a consulta parta de um endereço previamente cadastrado junto à instituição.

## Estados e transições

O ciclo abaixo descreve o currículo de um único pesquisador. A "versão" indica quantas importações bem-sucedidas já ocorreram.

| Situação atual | Ação | Resultado |
|---|---|---|
| Sem currículo | Vincular (sucesso) | Versão 1; registra data da sincronização |
| Sem currículo | Vincular (falha na fonte) | Continua sem currículo; nada é associado |
| Versão n | Atualizar (mesmo número, menos de 1 h) | **Bloqueado**; estado inalterado |
| Versão n | Atualizar (mesmo número, 1 h ou mais, sucesso) | Versão n+1; nova data de sincronização |
| Versão n | Atualizar (falha na fonte) | Versão n preservada; nada muda |
| Versão n | Atualizar (link da pessoa aponta número diferente, sucesso) | Passa a valer o número novo; versão n+1 (ignora o intervalo de 1 h) |
| Versão n | Atualizar (número novo já é de outra pessoa) | **Bloqueado**; estado inalterado |

## Casos especiais e exceções

- **Número mal formado**: recusa imediata, sem consultar a fonte.
- **Número bem formado, mas inexistente na fonte**: informa "não localizado" e não cria nem associa dados.
- **Fonte indisponível**: importação/atualização não conclui; dados existentes ficam intactos.
- **Atualização dentro de 1 hora**: bloqueada, com indicação de quando será possível repetir.
- **Correção do número via link do pesquisador**: re-importa do número novo ignorando o intervalo; se o número já for de outra pessoa, bloqueia.
- **Busca por CPF/nome/data ambígua ou vazia**: nenhum identificador é escolhido automaticamente; o coordenador é avisado (nenhum ou vários resultados).
- **Número já associado a outra pessoa**: o mesmo número Lattes nunca é vinculado a duas pessoas.
- **Configuração da fonte ausente ou errada para o ambiente**: as operações falham de forma controlada, informando indisponibilidade, sem corromper dados já importados.
- **Textos muito longos vindos da fonte** (por exemplo, listas enormes de coautores ou muitas variações do nome em citações): são acomodados sem quebrar a importação.

## Dados envolvidos

Núcleo:
[[Curriculo]] · [[Pessoa]]

Seções do currículo (todas ligadas ao [[Curriculo]]):
[[FormacaoAcademica]] · [[Artigo]] · [[Livro]] · [[OrientacaoAcademica]] · [[ParticipacaoProjeto]] · [[ParticipacaoEvento]] · [[Premio]] · [[Idioma]] · [[AreaAtuacaoCurriculo]] · [[AreaConhecimento]]

Observações de leitura:
- O [[Curriculo]] guarda o número Lattes (único), o número da versão, o resumo, as variações do nome em citações, o identificador ORCID, a **data de atualização na fonte** e a **data da última sincronização bem-sucedida** (base para o intervalo de 1 hora). Liga-se a uma única [[Pessoa]].
- Na [[Pessoa]] os campos usados são o **link do Lattes** (fonte da verdade do número), além de nome, CPF e data de nascimento (usados na busca do identificador quando o número é desconhecido).
- As referências externas do Lattes (instituições, periódicos) são guardadas como **texto** nas seções — por exemplo, a [[FormacaoAcademica]] guarda o nome da instituição e o [[Artigo]] guarda o nome do periódico —, e não como vínculos a cadastros internos.

## Funcionalidades relacionadas

- [[gestao-pessoas-fisicas]] — o currículo pertence a uma pessoa já cadastrada; o link do Lattes vem do cadastro dela.
- [[captacao-de-projetos]] — a avaliação de proponentes usa o currículo importado.
- [[meu-perfil]] — origem do link do Lattes informado pelo próprio pesquisador.
- [[autenticacao-autorizacao]] — coordenador e administrador precisam estar autenticados para importar, visualizar e sincronizar.
- [[painel-e-indicadores]] — dados de trajetória acadêmica podem alimentar indicadores de avaliação.
