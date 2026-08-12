---
title: Gestão de Pessoas Físicas
tipo: requisito
---

# Gestão de Pessoas Físicas

A equipe interna da FAPES precisa de uma visão administrativa completa — "360°" — de cada pessoa física cadastrada no ConectaFapes, sobretudo dos bolsistas. Este requisito descreve como a equipe localiza uma pessoa (listagem paginada com busca por CPF ou nome e filtro por vínculo de bolsista), consulta um resumo geral, abre o painel consolidado da pessoa (contadores, projetos e bolsas), acessa o detalhe cadastral completo, edita os dados com auditoria de cada alteração, consulta o histórico da pessoa, busca por CPF para preencher relacionamentos e verifica se o cadastro está completo.

## Atores

- **Administrador (perfil ADMIN)** — pode consultar todos os fluxos de leitura e é o único que pode **editar** os dados cadastrais de uma pessoa.
- **Gerente GEPOF (perfil GERENTE_GEPOF)** — pode consultar os fluxos de leitura (listagem, resumo, painel, detalhe, histórico, busca por CPF e verificação de cadastro completo), mas não edita.
- **Sistema** — apura contadores, aplica as regras de acesso, registra a auditoria e mantém o estado atual e o histórico da pessoa.

## Fluxo principal

1. O usuário interno abre a **listagem de pessoas físicas**, que vem paginada e ordenada por nome.
2. Ele pode **buscar** digitando um CPF (completo ou parcial, com ou sem máscara) ou parte de um nome, e pode **filtrar** por quem é bolsista ativo ou não.
3. Um **resumo** apresenta os totais consolidados (total de pessoas e total de bolsistas).
4. Ao escolher uma pessoa, ele abre o **painel (dashboard) da pessoa**, com contadores, projetos vinculados e bolsas vinculadas em uma visão única.
5. Pode abrir o **detalhe cadastral completo**, com dados pessoais, documento, endereços, dados bancários, estado atual e responsável legal.
6. O administrador pode **editar** os dados; cada alteração é registrada individualmente (auditoria por campo) e mudanças de estado (suspensão/reativação) exigem justificativa.
7. Qualquer usuário autorizado pode consultar o **histórico consolidado** da pessoa e verificar se o **cadastro está completo**, com a lista de pendências quando houver.
8. Para preencher o responsável legal, o usuário pode **buscar uma pessoa por CPF**.

## Regras de negócio

### Listagem e resumo

- A listagem retorna, para cada pessoa, sua identificação: nome, CPF e a indicação de **se é bolsista**.
- Ela é sempre **paginada**, com metadados de navegação (página atual, tamanho da página, total de registros, total de páginas e se há página seguinte/anterior), e **ordenada por nome** (em caso de empate, por identificador).
- O tamanho de página é limitado (entre 1 e 100).
- **Ser bolsista** é calculado pela existência de ao menos uma alocação de bolsista com status **ativa**. Bolsa inativa, cancelada, suspensa ou finalizada não caracteriza a pessoa como bolsista.
- O filtro por vínculo permite listar apenas quem é bolsista ativo ou apenas quem não é.
- O **resumo** traz o total de pessoas cadastradas e o total de pessoas que têm ao menos uma bolsa ativa. Com a base vazia, ambos os totais são zero.

### Busca por CPF ou nome (campo único)

- Existe um **campo único de busca textual** que aceita CPF ou nome.
- Se o texto digitado **contém algum dígito**, a busca é tratada como **CPF**: o sistema descarta máscara e caracteres não numéricos e busca por **prefixo** do CPF (permitindo busca parcial). Texto misturado com números é tratado como CPF, ignorando as letras.
- Se o texto **não contém dígitos**, a busca é por **nome**, por trecho do nome, **ignorando maiúsculas/minúsculas e acentos**.
- O campo de busca **combina** com o filtro de bolsista.
- Texto vazio ou só com espaços não aplica filtro textual; o texto de busca é limitado a 200 caracteres.
- Na listagem, o CPF é devolvido **formatado** (000.000.000-00) quando tem exatamente 11 dígitos; se tiver quantidade diferente, é devolvido sem máscara.

### Painel (dashboard) da pessoa

- Reúne, em uma visão única, três blocos: **contadores**, **projetos vinculados** e **bolsas vinculadas**.
- **Contadores**: projetos vinculados (projetos distintos em que a pessoa aparece por qualquer vínculo), bolsas recebidas (todas as bolsas da pessoa, independente do status), bolsas em andamento (apenas as ativas) e valor mensal ativo (soma do valor apenas das bolsas ativas).
- **Projetos**: cada projeto traz identificação, nome, nome do edital/programa, indicação de **se a pessoa é coordenadora** naquele projeto, datas e status. A pessoa entra na lista se participa por coordenação ou por bolsa. Se tem mais de um vínculo no mesmo projeto, o projeto aparece **uma única vez**, e a indicação de coordenadora é verdadeira sempre que houver qualquer coordenação da pessoa no projeto — inclusive coordenação histórica (mesmo que não seja mais a coordenadora atual).
- **Bolsas**: aparecem **todas** as bolsas da pessoa, em qualquer status (ativa, suspensa, cancelada, finalizada), com sigla da modalidade, projeto, valor, status e datas principais. Só as bolsas ativas somam no valor mensal ativo.
- **Cálculo do valor da bolsa**: usa o valor do nível vigente; quando a bolsa possui redução por vínculo, o valor é multiplicado pelo fator de redução da modalidade.

### Detalhe cadastral completo

- O detalhe traz, em uma única visão: dados pessoais, nome da mãe, documento de identificação, endereço residencial, endereço profissional, dados bancários, estado atual, vínculos e o responsável legal (quando houver).
- O **CPF é exibido apenas para leitura** — nunca editável.
- Quando a pessoa tem responsável legal, o detalhe traz uma versão simplificada da pessoa vinculada; quando não tem, o campo vem vazio.
- Seções sem informação (sem dados bancários, sem responsável legal, sem documento) vêm vazias, sem quebrar a consulta.

### Edição com auditoria por campo

- Só o **administrador** pode editar.
- A edição **nunca altera o CPF** — qualquer tentativa é rejeitada.
- Validações do que pode ser alterado: nome obrigatório (até 300 caracteres); e-mail obrigatório, válido e até 200 caracteres; telefone até 20 caracteres; data de nascimento obrigatória, exigindo **idade mínima de 18 anos, salvo quando houver responsável legal**; link do currículo Lattes válido e até 500 caracteres; nível acadêmico dentro dos valores suportados.
- **Responsável legal**: quando informado, deve apontar para uma pessoa existente e **diferente da própria pessoa editada**; o vínculo é guardado na pessoa.
- **Endereços**: residencial e profissional seguem o mesmo modelo do portal público, incluindo indicação de endereço de correspondência e telefone por tipo. Quando há ao menos um endereço no envio, **exatamente um** deve estar marcado como endereço de correspondência.
- É possível atualizar nome da mãe, documento principal e dados bancários atuais (banco, agência e conta).
- **Auditoria**: cada campo efetivamente alterado gera um registro de auditoria com a pessoa, o autor da alteração, o campo, o valor anterior, o valor novo, a data e o IP da requisição. Campos sem alteração real não geram registro redundante.

### Estado atual, suspensão e reativação

- A pessoa tem um **estado atual** consultável (por exemplo, ativa ou suspensa), com a justificativa e a data da última mudança de estado.
- **Suspender** a pessoa exige justificativa obrigatória; **reativar** também exige justificativa obrigatória.
- Toda edição bem-sucedida registra um evento de histórico de nível entidade (do tipo atualização); suspensão e reativação registram eventos próprios.

### Histórico consolidado

- O histórico reúne, em uma resposta **ordenada da mais recente para a mais antiga**, tanto os eventos de nível da entidade (atualização, suspensão, reativação) quanto as alterações campo a campo.
- Cada item traz origem, autor, campo, valores antigo e novo e a descrição do evento.
- Mesmo quando não há alterações por campo, o histórico mostra ao menos os eventos de nível da entidade.

### Busca administrativa por CPF

- Serve para localizar uma pessoa e preencher relacionamentos (como o responsável legal).
- Aceita CPF parcial ou com máscara: o valor é normalizado antes da consulta e a comparação é parcial.
- Retorna uma lista de pessoas em formato simplificado (identificação, nome, CPF e e-mail).

### Verificação de cadastro completo

- Indica se o cadastro está completo e, quando não está, **lista os atributos faltantes**.
- Para estar completo, a pessoa precisa ter: nome, CPF, data de nascimento, e-mail, telefone, sexo, raça, currículo Lattes, nível acadêmico, **nome da mãe válido**, endereço residencial completo e ao menos um documento de identificação válido.
- **Nome da mãe** preenchido com o texto genérico "name_template" é considerado **pendência**.
- Um documento cadastrado, mas sem número, órgão emissor, UF ou data de emissão, continua marcando **pendência de documento**.
- Pessoa **menor de 18 anos sem responsável legal** é marcada como cadastro incompleto, com a pendência de responsável legal.

### Acesso

- Os fluxos de **leitura** (listagem, resumo, painel, detalhe, histórico, busca por CPF e cadastro completo) são permitidos apenas aos perfis **ADMIN** e **GERENTE_GEPOF**.
- A **edição** é permitida apenas ao **administrador**.

## Estados e transições

- **Pessoa (estado cadastral)**: **ativa ⇄ suspensa**, sempre com justificativa e data registradas na transição.
- **Bolsa (para efeito de contagem no painel)**: ativa (conta em bolsas em andamento e no valor mensal ativo) vs. suspensa/cancelada/finalizada (aparecem na lista, mas não somam no valor ativo).
- Cada edição gera transição no histórico: nenhuma alteração → um ou mais registros de auditoria por campo + um evento de atualização de nível entidade.

## Casos especiais e exceções

- **Sem autenticação / perfil não autorizado**: leitura por perfil fora de ADMIN/GERENTE_GEPOF é negada; edição por quem não é administrador é negada.
- **Pessoa inexistente**: consultas retornam um aviso amigável de "não encontrado", sem expor nomes técnicos.
- **Identificador de pessoa vazio ou inválido**: rejeitado com aviso amigável.
- **Base vazia na listagem/resumo**: retorna lista vazia e totais zerados, sem erro.
- **Tentativa de alterar o CPF**: rejeitada com aviso amigável.
- **Menor de idade sem responsável legal na edição**: a alteração falha com aviso amigável, sem gravar nada.
- **Responsável legal apontando para a própria pessoa**: rejeitado com aviso amigável.
- **Suspensão/reativação sem justificativa**: a alteração falha antes de gravar qualquer mudança.
- **Marcação de correspondência ausente ou duplicada**: quando há endereços, exatamente um deve ser o de correspondência.
- **Valor de bolsa indisponível** (relacionamento incompleto de nível/modalidade): o valor da bolsa vem como zero, sem quebrar o painel.
- **Bolsa sem projeto carregado**: o nome do projeto vem vazio no item da bolsa.
- **Registro do IP**: o IP da requisição é registrado na auditoria mesmo quando há várias alterações na mesma edição.

## Dados envolvidos

[[Pessoa]] · [[AlocacaoBolsista]] · [[Projeto]] · [[Edital]] · [[Coordenacao]] · [[VersaoNivel]] · [[VersaoModalidade]] · [[NivelBolsa]] · [[HistoricoPessoa]] · [[HistoricoEdicao]] · [[Documento]] · [[Endereco]] · [[DadosBancarios]] · [[Telefone]] · [[Estado]] · [[User]]

## Funcionalidades relacionadas

- [[gestao-usuarios-backoffice]] — define os perfis internos (ADMIN, GERENTE_GEPOF) que acessam esta visão.
- [[meu-perfil]] — a mesma pessoa mantém e vê parte desses dados pelo portal público.
- [[importacao-curriculo-lattes]] — origem de dados curriculares que compõem o cadastro completo.
- [[implementacao-de-bolsa]] — origem das bolsas exibidas no painel e no detalhe.
- [[painel-e-indicadores]] — visão agregada por projeto que complementa a visão por pessoa.
- [[autenticacao-autorizacao]] — controla o acesso aos fluxos de leitura e de edição.
