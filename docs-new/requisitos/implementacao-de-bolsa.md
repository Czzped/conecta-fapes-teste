---
title: Implementação de bolsa
tipo: requisito
---
# Implementação de bolsa

A implementação de bolsa é o conjunto de atividades pelas quais a equipe da FAPES avalia a documentação e as condições de um bolsista alocado em um projeto e decide se a bolsa pode, de fato, entrar em vigor. É a ponte entre a alocação (o registro de que uma pessoa foi indicada para uma bolsa em determinado projeto) e a bolsa efetivamente ativa, com pagamentos liberados.

O processo é orientado por pendências: cada bolsa que precisa de atenção da área técnica aparece em uma fila de trabalho, ordenada por prioridade. A analista da área técnica revisa os documentos exigidos, aprova ou reprova cada um deles, avalia solicitações de voluntariado quando o edital exige, e só então a bolsa reúne condições para ser aprovada. A pré-condição central é simples de enunciar e rigorosa na prática: uma bolsa só pode ser aprovada quando todos os seus documentos obrigatórios estiverem aprovados e as demais avaliações concluídas.

Este requisito descreve o comportamento da área administrativa da FAPES (equipe interna). O envio de documentos e o acompanhamento pelo próprio bolsista estão descritos em [[solicitacao-de-bolsa]] e [[gestao-de-documentos]].

## Atores

- **Analista / gerente de área técnica**: profissional responsável por avaliar as bolsas de sua área. Vê e trata apenas as pendências de editais vinculados à sua área técnica. Aprova, reprova ou solicita revisão de documentos, avalia voluntários e acompanha a fila de pendências.
- **Administrador**: possui acesso a todas as áreas técnicas, sem restrição por área. É o único ator autorizado a executar a aprovação final da bolsa (transição para ativa). Também pode realizar as demais avaliações.
- **Coordenador do projeto**: acompanha as bolsas do próprio projeto e seus respectivos status. Apenas o coordenador atual do projeto tem acesso a essa visão.
- **Sistema (avaliação automática de documentos)**: mecanismo que faz uma triagem inicial dos documentos enviados, encaminhando-os para aprovação automática, reprovação automática ou avaliação manual pela área técnica.
- **Bolsista**: pessoa alocada cuja bolsa está sendo implementada. Participa fornecendo documentos, mas não avalia (ver [[solicitacao-de-bolsa]]).

## Fluxo principal

1. Uma alocação de bolsista passa a existir a partir da importação do edital e do projeto (ver [[importacao-de-editais]]). A bolsa nasce em um estado que exige avaliação antes de poder ser ativada.
2. O bolsista envia os documentos exigidos pela modalidade e pelo nível da bolsa. Cada documento pode passar por uma triagem automática inicial e, em seguida, por avaliação manual.
3. A analista da área técnica acessa o painel de pendências e vê a lista de bolsas que precisam de atenção na sua área, ordenada por prioridade.
4. Para cada bolsa, a analista abre os documentos enviados e, um a um, decide: **aprovar**, **reprovar** (com justificativa) ou **solicitar revisão** (com justificativa), devolvendo o documento ao bolsista para correção.
5. Quando o edital exige análise de voluntariado, a analista avalia também a solicitação de voluntário, aprovando ou reprovando com justificativa (ver [[voluntariacao]]).
6. Quando todos os documentos obrigatórios estão aprovados e as avaliações necessárias concluídas, a bolsa reúne condições de aprovação.
7. O administrador aprova a bolsa. Nesse momento a bolsa passa a ativa e o mês de aprovação é registrado, o que dá base para a geração e liberação das cotas de pagamento (ver [[pagamentos]] e [[remanejamento-de-cotas]]).
8. A partir daí, a bolsa é acompanhada ao longo de sua vigência e pode ser suspensa, cancelada ou finalizada conforme as regras de ciclo de vida.

## Regras de negócio

### Pré-condição de aprovação (regra central)

- Uma bolsa só pode ser aprovada quando **todos os documentos obrigatórios estiverem aprovados** e as avaliações exigidas pelo edital (incluindo voluntariado, quando aplicável) estiverem concluídas. Enquanto houver documento pendente, em revisão ou reprovado, a bolsa permanece com documentação pendente e não pode ser ativada.
- A aprovação final da bolsa é **exclusiva do administrador**. Um perfil que não seja administrador não consegue executar a aprovação, ainda que possa ter avaliado os documentos.
- A bolsa só pode ser aprovada quando estiver em um dos estados que admitem aprovação: **em avaliação**, **documentação pendente** ou **aguardando aceites**. Tentar aprovar uma bolsa já ativa é bloqueado com a mensagem de que a bolsa já está aprovada. Tentar aprovar uma bolsa suspensa, cancelada ou em outro estado incompatível é bloqueado com a mensagem de que a bolsa deve estar em avaliação, com documentação pendente ou aguardando aceites para ser aprovada.
- No momento da aprovação, o **mês de aprovação** é registrado com o mês e ano correntes. Esse marco é usado no acompanhamento e na base de pagamentos.

### Avaliação de documentos

- Cada documento enviado pode ter os seguintes desfechos de avaliação: **aprovado**, **reprovado** ou **enviado para revisão**.
- **Reprovar** e **solicitar revisão** exigem justificativa. A justificativa de revisão precisa ter no mínimo 3 caracteres; uma justificativa vazia é recusada com a mensagem de que a justificativa é obrigatória.
- Ao solicitar revisão, o documento retorna para uma condição pendente de avaliação e o bolsista é comunicado para reenviá-lo corrigido; a bolsa passa a sinalizar que há revisão de documentos solicitada.
- Só são aceitos documentos em formato PDF, com tamanho máximo de 5 MB. Arquivos de outro formato são recusados com a mensagem de que apenas arquivos PDF são aceitos; arquivos acima de 5 MB são recusados com a mensagem de tamanho máximo. Essas regras de envio pertencem a [[gestao-de-documentos]] e condicionam o que chega para avaliação.
- A triagem automática de um documento recém-enviado pode encaminhá-lo para aprovação automática, reprovação automática ou avaliação manual pela área técnica. A decisão manual da analista sempre prevalece sobre a triagem automática.

### Restrição por área técnica

- A analista de área técnica só vê e só pode avaliar bolsas de editais vinculados à sua própria área. Tentar avaliar um voluntário ou documento de uma bolsa de outra área é bloqueado por falta de permissão.
- O administrador não tem essa restrição: enxerga e trata pendências de todas as áreas.

### Avaliação de voluntariado

- A avaliação de voluntário só se aplica quando o edital tem a análise de voluntário habilitada.
- Um voluntário só pode ser avaliado enquanto estiver em avaliação. Aprová-lo o torna ativo; reprová-lo (com justificativa obrigatória) o coloca em reprovado pela área técnica. Tentar avaliar um voluntário que já foi avaliado é bloqueado com a mensagem de que o voluntário não está em avaliação. Cada avaliação registra a data da última mudança de status. Detalhes completos em [[voluntariacao]].

### Fila de pendências e acompanhamento

- O painel de pendências lista as bolsas que exigem atenção, considerando os estados **em avaliação**, **documentação pendente** e **pendente de avaliação**.
- A ordenação segue prioridade fixa: primeiro as bolsas **em avaliação**, depois as com **documentação pendente**, por último as **pendentes de avaliação**.
- A fila é paginada. Uma página inválida (por exemplo, página zero) é recusada com a mensagem de que a página é inválida.
- A fila pode ser filtrada por edital, por projeto e por lista de status.
- É possível consultar estatísticas mensais: a contagem de bolsas aprovadas e reprovadas em um determinado mês.
- Se a identificação do usuário chegar sem os dados esperados (identificação vazia), a consulta é recusada com mensagem específica de que os dados de acesso vieram vazios.

### Acesso do coordenador

- O coordenador vê apenas as bolsas do seu projeto, em lista paginada (limite de 100 por página), com filtro por status da bolsa.
- Somente o **coordenador atual** do projeto tem acesso; coordenadores históricos (já substituídos) não conseguem acessar a lista. Quem não é o coordenador atual é bloqueado por falta de permissão.

## Estados e transições

Estados da bolsa (alocação) relevantes à implementação:

- **Em avaliação**: bolsa sob análise da área técnica.
- **Documentação pendente**: faltam documentos aprovados; a bolsa aguarda ação do bolsista ou da analista.
- **Aguardando aceites**: bolsa aguardando aceites/assinaturas (ver [[termo-de-responsabilidade]]).
- **Pendente de avaliação**: bolsa que entrou na fila e aguarda início da análise.
- **Ativa**: bolsa aprovada e vigente, apta a gerar/liberar pagamentos.
- **Suspensa**: bolsa temporariamente interrompida.
- **Cancelada**: bolsa encerrada por decisão, com justificativa e data de fim.
- **Reprovada**: bolsa recusada na avaliação, com justificativa.
- **Finalizada**: bolsa encerrada por término de vigência.

Transições principais:

- Em avaliação / documentação pendente / aguardando aceites → **Ativa** (aprovação pelo administrador; registra mês de aprovação).
- Em avaliação / documentação pendente / aguardando aceites → **Reprovada** (reprovação com justificativa).
- Em avaliação / suspensa → **Ativa** (ativação direta).
- Ativa → **Suspensa** (suspensão).
- Ativa / suspensa → **Cancelada** (cancelamento com justificativa e data de fim; registra data de fim de atividade).
- Qualquer estado vigente → **Finalizada** quando a data corrente ultrapassa a data prevista de fim de atividade.

Transições bloqueadas:

- Ativa → Ativa (aprovação novamente): recusada, bolsa já aprovada.
- Suspensa / cancelada → Ativa por aprovação: recusada, estado incompatível para aprovação.
- Aprovação por perfil não administrador: recusada por falta de permissão.

## Casos especiais e exceções

- **Documento reprovado ou em revisão trava a aprovação**: mesmo que todos os demais documentos estejam aprovados, um único documento pendente, reprovado ou em revisão impede a ativação da bolsa.
- **Revisão sem justificativa válida**: solicitar revisão com justificativa vazia ou menor que 3 caracteres é recusado.
- **Reprovação de voluntário sem justificativa**: bloqueada.
- **Avaliação fora da área**: analista tentando tratar bolsa de área alheia é bloqueada por permissão; administrador não sofre essa restrição.
- **Coordenador substituído**: perde o acesso à lista de bolsas do projeto assim que deixa de ser o coordenador atual.
- **Página inválida / identificação vazia** nas consultas de pendências: recusadas com mensagens específicas.
- **Finalização automática**: a virada para finalizada ocorre por decurso de prazo (data prevista de fim ultrapassada), independentemente de ação manual.
- **Comprovantes perenes**: requisitos marcados como comprovante perene tendem a permanecer válidos entre bolsas do mesmo bolsista, evitando reenvio; essa marcação vem do cadastro do requisito (ver [[gestao-de-modalidades]]).

## Dados envolvidos

- [[AlocacaoBolsista]] — a bolsa em si: status, matrícula, mês de aprovação, mês de reprovação, justificativas de reprovação e cancelamento, datas de início e fim (prevista e efetiva), sinalização de revisão de documentos solicitada, quantidade de cotas alocadas e pagas, vínculo com [[Pessoa]], [[Projeto]] e [[VersaoNivel]].
- [[DocumentoMetadado]] — cada documento avaliado: status, justificativas de pedido de revisão e de reprovação, sinalizações de validação, vínculo com a bolsa ([[AlocacaoBolsista]]), com a [[Pessoa]] e com o [[RequisitoBolsa]] correspondente.
- [[Voluntariacao]] — solicitações de voluntariado avaliadas.
- [[RequisitoBolsa]] e [[RequisitoVersao]] — os requisitos (documentos e condições) exigidos por modalidade e nível, que definem o que precisa estar aprovado.
- [[Edital]] — indica se há análise de voluntário, se permite pagamento avançado e a área técnica responsável.
- [[Projeto]] — projeto ao qual a bolsa pertence; base para a visão do coordenador.
- [[AreaTecnica]] — recorte de permissão da analista.
- [[VersaoNivel]] e [[NivelBolsa]] — nível e valor da bolsa em avaliação.

## Funcionalidades relacionadas

- [[solicitacao-de-bolsa]]
- [[gestao-de-documentos]]
- [[termo-de-responsabilidade]]
- [[voluntariacao]]
- [[pagamentos]]
- [[remanejamento-de-cotas]]
- [[cancelamento-de-bolsa]]
- [[gestao-de-modalidades]]
- [[importacao-de-editais]]
- [[painel-e-indicadores]]
- [[notificacoes]]
- [[autenticacao-autorizacao]]
