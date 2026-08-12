---
title: Solicitação de Bolsa
tipo: requisito
---
# Solicitação de Bolsa

A solicitação de bolsa é o processo pelo qual o coordenador de um projeto inicia a concessão de uma bolsa a um pesquisador dentro do ConectaFapes. O coordenador cria uma alocação de bolsista para o seu projeto ativo, preenche as informações da bolsa (bolsista, orientador, modalidade, período, plano de atividades e configuração de pagamento) e submete a solicitação para dar início à esteira de documentação, avaliação e pagamento. A alocação criada passa a ser a base sobre a qual todo o ciclo de vida da bolsa acontece: documentação, aceites, implementação, pagamentos e, eventualmente, cancelamento.

O processo foi desenhado para permitir trabalho em duas velocidades: o coordenador pode salvar um rascunho (em edição) enquanto ainda faltam informações, sem que isso represente um vínculo efetivo com o pesquisador, e só depois efetivar a solicitação, momento em que as regras de consistência mais rígidas passam a valer. Para reduzir retrabalho ao cadastrar bolsas semelhantes, o coordenador também pode clonar uma alocação existente, reaproveitando as configurações reutilizáveis em um novo rascunho.

Público-alvo desta nota: analistas de produto e QA que precisam entender exaustivamente as regras de criação, edição, validação, clonagem e as restrições de papel único por projeto.

## Atores

- **Coordenador do projeto**: usuário responsável por cadastrar, editar, salvar em rascunho, clonar e submeter a solicitação de bolsa do seu projeto ativo. É o único ator que opera a criação.
- **Pesquisador (bolsista)**: pessoa física indicada para receber a bolsa. É selecionada por busca de CPF, mas não interage diretamente neste fluxo de criação.
- **Orientador**: pessoa responsável pela orientação acadêmica da bolsa. Pode ser o próprio coordenador ou outra pessoa indicada.
- **Sistema (processamento interno)**: responsável por gerar a matrícula única, gerar os pagamentos avançados, executar o desfazimento automático (rollback) em caso de falha e aplicar as validações.

## Fluxo principal

1. O coordenador seleciona o projeto ativo e acessa a área de equipe/bolsistas do projeto.
2. O coordenador aciona o cadastro de novo bolsista (nova alocação de bolsista).
3. O coordenador busca e seleciona o pesquisador que será o bolsista (por CPF).
4. O coordenador define a orientação: indica se ele próprio será o orientador ou busca e seleciona outro orientador.
5. O coordenador seleciona a modalidade da bolsa e indica se há redução de bolsa.
6. O coordenador informa o mês de início das atividades e a duração da bolsa (quantidade total de cotas/pagamentos).
7. Se a bolsa exigir pagamento avançado, o coordenador marca a opção, informa o mês de fim das atividades e seleciona, no quadro exibido, os meses específicos em que os pagamentos ocorrerão.
8. O coordenador informa a atividade principal, os objetivos e as metas e seleciona a área de conhecimento.
9. O coordenador monta o plano de atividades com uma ou mais atividades.
10. O coordenador escolhe entre:
    - **Salvar como rascunho** (em edição): a alocação é guardada sem se tornar um vínculo efetivo, permitindo continuar depois.
    - **Enviar o cadastro** (efetivar): a alocação passa para a esteira de documentação, ficando com o status inicial de documentação pendente, com matrícula única gerada e o orientador registrado.
11. Quando o envio é efetivado com pagamento avançado, o sistema gera os pagamentos correspondentes aos meses informados.
12. Ao final, o coordenador retorna à lista da equipe, onde pode acompanhar a nova bolsa, editá-la (enquanto em rascunho/edição), cancelá-la (quando ativa) ou clonar uma alocação existente para iniciar outra solicitação.

## Regras de negócio

### Criação e status inicial

- A criação de uma alocação com envio efetivado gera o status inicial de **documentação pendente**.
- No envio efetivado, o sistema **gera automaticamente uma matrícula única** para o bolsista.
- O sistema registra a orientação conforme a escolha do coordenador:
  - Se o coordenador indicar que ele mesmo é o orientador, ele é registrado como orientador da bolsa.
  - Se o coordenador indicar outra pessoa, o orientador específico informado é registrado na orientação.

### Rascunho (em edição)

- O coordenador pode salvar a solicitação como rascunho enquanto ainda faltam informações.
- Um rascunho (em edição) **não** constitui vínculo vigente do pesquisador com o projeto.
- As validações de consistência mais rígidas (por exemplo, a de papel único por projeto) **não bloqueiam** o simples salvamento de um rascunho; elas incidem na efetivação (transição de "em edição" para um status de solicitação).

### Duração da bolsa e pagamento avançado

- A **duração da bolsa** representa a quantidade total de cotas/pagamentos que serão concedidos.
- Os **meses de pagamento avançado** representam os meses específicos em que essas cotas serão pagas. Podem ser não sequenciais, desde que estejam dentro do período informado para a atividade.
- A quantidade de meses selecionados no pagamento avançado **deve corresponder exatamente** à quantidade de cotas informada na duração da bolsa (exemplo: 6 cotas exigem exatamente 6 meses selecionados). O quadro exibe um contador que mostra quantos meses foram selecionados e quantos são obrigatórios.
- O quadro de meses só é exibido depois que houver mês de início das atividades, duração da bolsa e mês de fim das atividades preenchidos.
- Meses fora do período de atividade ficam bloqueados para seleção.
- O mês de fim das atividades **não pode ser anterior** ao mês de início.
- O mês de fim das atividades **respeita o limite de vigência do projeto**.
- Ao desmarcar o pagamento avançado, o sistema volta a calcular automaticamente o fim previsto com base no início e na duração da bolsa.
- O pagamento avançado só deve ser usado quando o pagamento das cotas precisar ser planejado em meses específicos; no fluxo regular, a opção permanece desmarcada.
- Quando a criação é feita com pagamento avançado, os pagamentos são gerados para os meses informados.

### Validações de criação

- **Projeto inexistente**: se o projeto informado não existir, a criação é impedida com mensagem indicando que o projeto não foi encontrado (a mensagem cita o identificador do projeto).
- **Data de início ausente**: se a data de início não for informada, a criação é impedida com mensagem indicando que a data de início deve ser informada.
- **Plano mensal ausente para a data de início**: deve existir um plano mensal correspondente ao mês de competência da data de início. Se não houver, a criação é impedida com mensagem indicando que não foi encontrado nenhum plano mensal correspondente àquela data de início.
- **Identificador de origem (Sigfapes) duplicado**: não é permitido criar uma alocação com um identificador de integração externa que já exista na base. A mensagem indica que já existe bolsista com aquele identificador.
- **Matrícula duplicada**: a matrícula gerada precisa ser única. Se a matrícula gerada colidir com uma já existente, a criação é impedida com mensagem indicando que já existe bolsista com aquela matrícula.

### Rollback (desfazimento automático)

- Quando a criação de uma alocação envolve a geração de pagamentos avançados e essa geração falha, o sistema executa **desfazimento automático (rollback)**: a alocação recém-criada é removida, de modo que não fique um registro parcial.
- Nesse caso, o sistema informa erro indicando falha ao gerar pagamentos para a alocação.

### Papel único por projeto (bolsista x voluntário)

Dentro de um mesmo projeto, uma pessoa física (identificada pelo CPF) deve ter **um único papel de participação vigente**: ou bolsista ou voluntário, nunca os dois vínculos vigentes ao mesmo tempo. A regra é sempre por projeto.

- **Bloqueio na efetivação da bolsa**: não é permitido efetivar (criar em status de solicitação, inclusive ao submeter um rascunho) uma bolsa para uma pessoa que já possui voluntariado vigente no mesmo projeto. A operação é rejeitada com mensagem clara em português, que identifica o papel conflitante e orienta encerrar o voluntariado antes; nenhuma alocação é gravada.
- **Rascunho é permitido**: salvar um rascunho de bolsa (em edição) para uma pessoa com voluntariado vigente **não** é bloqueado, pois rascunho não é vínculo vigente. O bloqueio ocorre apenas na transição do rascunho para um status de solicitação.
- **Chave de verificação**: a checagem usa a combinação projeto + pessoa física (CPF) e se restringe ao projeto em que o novo vínculo está sendo criado.
- **Escopo por projeto**: a mesma pessoa pode ser bolsista em um projeto e voluntária em outro, sem qualquer bloqueio entre projetos. Vínculos vigentes em outros projetos nunca entram na verificação.
- **Somente vínculos vigentes bloqueiam**: vínculos encerrados, cancelados, reprovados ou rejeitados no histórico nunca bloqueiam a criação de um novo vínculo. Múltiplos vínculos terminais da mesma pessoa no mesmo projeto não impedem um novo.
- **Voluntariado vigente/bloqueador**: são vigentes os voluntariados nos status "aguardando aceites", "em avaliação" e "ativa". Não bloqueiam os status terminais: cancelada, finalizada, rejeitada pelo voluntário e reprovada pela área técnica.
- **Transição de papel**: a transição de voluntário para bolsista (ou o inverso) é possível, mas de forma explícita e em dois passos manuais: primeiro encerra-se o vínculo atual, depois cria-se o novo. O sistema **não encerra automaticamente** o vínculo anterior; enquanto o vínculo conflitante estiver vigente, a criação do outro é rejeitada. Assim que não houver mais vínculo vigente conflitante no projeto, a criação passa a ser aceita.
- **Sem regressão**: a verificação de papel único convive com os bloqueios já existentes (impedir voluntariado duplicado e a regra de acúmulo de bolsa), somando-se a eles.

> Observação sobre a regra recíproca (voluntário sobre bolsista): a criação de voluntário é bloqueada quando já existe bolsa vigente da mesma pessoa no mesmo projeto. Consideram-se bolsas vigentes/bloqueadoras os status: em processamento, documentação pendente, aguardando aceites, pendente de avaliação, em avaliação, ativa e suspensa. Uma bolsa suspensa é vínculo vigente e, portanto, bloqueia. O rascunho em edição e os terminais (reprovada, cancelada, finalizada) não bloqueiam. Essa regra recíproca está detalhada em [[voluntariacao]].

### Clonagem de alocação

A clonagem permite reaproveitar uma alocação existente como uma nova solicitação em rascunho, sem redigitar as configurações da bolsa.

- A clonagem cria uma **nova solicitação em edição (rascunho), com identidade própria**, e retorna o identificador do novo rascunho.
- A alocação de origem pode estar em **qualquer status**, pois o novo registro sempre nasce como rascunho independente.
- A alocação de origem **permanece inalterada** durante todo o processo; a clonagem não altera, encerra nem remove a origem.
- **Dados reutilizáveis copiados da origem**:
  - Projeto, modalidade e nível da bolsa, área de conhecimento.
  - Datas de início e fim previstas.
  - Quantidade de cotas.
  - Indicação de redução da bolsa.
  - Objetivos e metas, atividade principal e todos os itens do plano de atividades — copiados **na ordem definida pela numeração** de cada item, como novos registros.
  - Somente o orientador marcado como **atual** na origem (quando houver) é associado ao novo rascunho.
  - Indicação de pagamento avançado e os respectivos meses de competência — copiados **na ordem da sequência de pagamento**, como novos registros.
- **Dados NÃO copiados (identidade e histórico da origem)**:
  - Identificador da alocação de origem, o bolsista, o nome do bolsista e a matrícula.
  - Identificador de integração externa.
  - Quantidade de cotas pagas antes da importação.
  - Datas, justificativas ou estados de aprovação, reprovação, cancelamento, finalização e demais informações históricas de ciclo de vida.
- **Ausências preservadas**: quando não há orientador atual, atividades ou meses de pagamento avançado na origem, o rascunho é criado sem inventar dados para os campos ausentes; coleções vazias permanecem vazias.
- **Regras herdadas**: a criação do rascunho clonado aplica as mesmas regras vigentes da criação de rascunho (validação de projeto, edital, pagamento avançado, orientação e persistência dos dados relacionados).
- **Registros como novos**: atividades, orientação e pagamentos da cópia são tratados como novos registros associados ao novo rascunho, sem reutilizar a identidade dos registros da origem.

## Estados e transições

| Situação de origem | Ação | Resultado |
|---|---|---|
| (Novo) | Salvar como rascunho | Alocação em edição (rascunho), sem vínculo vigente |
| Em edição (rascunho) | Enviar / efetivar | Documentação pendente, com matrícula única gerada e orientador registrado |
| (Novo, com pagamento avançado) | Enviar / efetivar | Documentação pendente + pagamentos avançados gerados |
| (Novo, com pagamento avançado) | Falha ao gerar pagamentos | Alocação removida (rollback); erro informado |
| Alocação existente (qualquer status) | Clonar | Novo rascunho independente em edição, sem bolsista |
| Em edição (rascunho) | Efetivar com voluntariado vigente no projeto | Rejeitada; nenhuma bolsa gravada |

## Casos especiais e exceções

- **Rascunho não é vínculo**: salvar rascunho é sempre livre em relação à regra de papel único; o bloqueio recai apenas na efetivação.
- **Cotas ausentes na clonagem**: quando a quantidade de cotas está ausente na origem, ela é tratada como zero no novo rascunho.
- **Projeto obrigatório ausente na clonagem**: se a referência obrigatória de projeto estiver ausente na origem, a criação do rascunho é impedida pelas regras já existentes de criação.
- **Mais de uma orientação "atual" por inconsistência**: se, por inconsistência legada, houver mais de uma orientação marcada como atual na origem, somente uma referência de orientador é usada na cópia.
- **Falha ao criar registros relacionados na clonagem**: falhas ao criar atividades, orientação ou pagamentos associados ao rascunho não podem ser apresentadas como clonagem concluída; o erro é repassado e nenhum identificador de sucesso é retornado.
- **Clonagem de origem inexistente**: se o identificador de origem não corresponder a uma alocação existente, o sistema informa que a alocação não foi encontrada e não cria rascunho.
- **Requisição de clonagem sem dados mínimos**: se faltarem os dados mínimos para identificar a alocação de origem, a operação é rejeitada como requisição inválida.
- **Concorrência entre fluxos de papel** (fora do escopo atual): a corrida entre criar voluntário e bolsista para a mesma pessoa no mesmo projeto ao mesmo tempo é considerada improvável porque as ações são tomadas pelo mesmo coordenador de forma sequencial; a salvaguarda de integridade fica registrada como melhoria futura.

## Dados envolvidos

- [[AlocacaoBolsista]]
- [[PagamentoBolsista]]
- [[AtividadeBolsista]]
- [[Orientacao]]
- [[PlanoMensal]]
- [[Projeto]]
- [[Pessoa]]
- [[Voluntariacao]]
- [[ModalidadeBolsa]]
- [[NivelBolsa]]
- [[AreaConhecimento]]
- [[Edital]]

## Funcionalidades relacionadas

- [[cancelamento-de-bolsa]]
- [[voluntariacao]]
- [[implementacao-de-bolsa]]
- [[pagamentos]]
- [[gestao-de-documentos]]
- [[termo-de-responsabilidade]]
- [[gestao-de-modalidades]]
- [[remanejamento-de-cotas]]
