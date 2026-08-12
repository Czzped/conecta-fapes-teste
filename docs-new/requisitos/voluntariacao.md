---
title: Voluntariação
tipo: requisito
---

# Voluntariação

A voluntariação é o vínculo de uma pessoa a um projeto de pesquisa **sem contrapartida financeira** — uma alternativa à bolsa remunerada. Ela permite que o coordenador monte a equipe do projeto com colaboradores voluntários, que a pessoa convidada aceite ou recuse o convite e que, quando o edital exige, a equipe da FAPES avalie o voluntário antes de ativá-lo. Uma vez ativa, a voluntariação passa a compor a equipe do projeto lado a lado com os bolsistas.

## Atores

- **Coordenador do projeto** — solicita a participação de uma pessoa como voluntária, e pode cancelar voluntariações do seu projeto. Só atua sobre os projetos em que é coordenador.
- **Voluntário (a pessoa convidada)** — aceita ou rejeita a solicitação que recebeu. Só pode decidir sobre a própria solicitação.
- **Gerente de área técnica (equipe FAPES)** — quando o edital exige análise de voluntário, aprova ou reprova o voluntário. A avaliação cabe ao gerente da **mesma área técnica** do edital do projeto.
- **Sistema** — controla as transições de situação, valida quem pode agir em cada etapa e registra as datas de cada mudança.

## Fluxo principal

1. O coordenador escolhe uma pessoa já existente no cadastro e a solicita como voluntária de um dos seus projetos, informando a data de início do vínculo.
2. O sistema cria a voluntariação na situação **aguardando aceites** e registra a data desta mudança de situação.
3. A pessoa convidada é notificada e decide:
   - **Aceita** — o caminho seguinte depende do edital do projeto:
     - Se o edital **não exige** análise de voluntário, a voluntariação vai direto para **ativa**.
     - Se o edital **exige** análise de voluntário, a voluntariação vai para **em avaliação**, aguardando a decisão da equipe FAPES.
   - **Rejeita** — a voluntariação vai para **rejeitada pelo voluntário** e o vínculo não se concretiza.
4. Quando há avaliação, o gerente da área técnica do edital:
   - **Aprova** — a voluntariação passa a **ativa**.
   - **Reprova** — a voluntariação passa a **reprovada pela área técnica**, obrigatoriamente com uma justificativa.
5. A partir de **ativa**, o voluntário integra a equipe do projeto e aparece na listagem da equipe junto dos bolsistas.
6. O coordenador pode **cancelar** uma voluntariação do seu projeto, sempre com justificativa; o sistema registra a data de fim do vínculo.

## Regras de negócio

- **Quem pode solicitar**: apenas o coordenador do projeto. Qualquer tentativa de solicitar voluntário por quem não é coordenador daquele projeto é bloqueada ("Somente o coordenador do projeto pode solicitar um voluntário").
- **Quem pode cancelar**: apenas o coordenador do projeto ao qual a voluntariação pertence ("Somente o coordenador do projeto pode cancelar um voluntário"). O cancelamento sempre exige justificativa e registra a data de fim.
- **Quem pode aceitar ou rejeitar**: somente a própria pessoa convidada. A identificação da pessoa que age precisa coincidir com o voluntário da solicitação ("Somente o voluntário pode aceitar a voluntariação!" / "Somente o voluntário pode rejeitar a voluntariação!").
- **Pré-condição de identidade**: quem age precisa estar autenticado com identificação válida (CPF, nome e e-mail). Sem isso, a ação é recusada ("Token claims inválidas"). Ver [[autenticacao-autorizacao]].
- **Pré-condição de existência**: o projeto informado precisa existir ("Projeto não encontrado na base de dados") e a pessoa convidada precisa existir no cadastro ("Pessoa não encontrada na base de dados").
- **Aceite só a partir de aguardando aceites**: uma voluntariação só pode ser aceita enquanto está aguardando aceites. Se já estiver em qualquer outra situação, o aceite é recusado ("A voluntariação deve estar com status aguardando aceites para que possa ser aceita").
- **Dependência da análise de voluntário do edital**: o destino do aceite (ativa direto ou em avaliação) é determinado pela configuração do edital do projeto — o indicador de que aquele edital exige análise de voluntário. Editais que exigem análise fazem o voluntário passar pela avaliação da FAPES antes de ativar.
- **Reprovação com justificativa**: a reprovação pela área técnica só é válida acompanhada de justificativa, que fica registrada no vínculo.
- **Exclusividade de papel no projeto**: uma mesma pessoa **não pode ser voluntária e bolsista ao mesmo tempo no mesmo projeto**. O papel é único por projeto. A mesma pessoa pode, porém, ter papéis diferentes em projetos diferentes.
- **Registro de datas**: toda mudança de situação atualiza a data da última mudança de situação; o início do vínculo guarda a data de início informada na solicitação e o encerramento guarda a data de fim.
- **Listagem unificada da equipe**: na tela de equipe do projeto (Minha Equipe), voluntários aparecem **junto com os bolsistas**, num único resultado paginado. Para o voluntário, a modalidade exibida é "Voluntário" e os campos que só existem para bolsa (valor, cotas alocadas, cotas pagas e redução) ficam vazios.
- **Ordenação única**: bolsistas e voluntários são ordenados por uma **única regra de prioridade por situação**, encaixando as situações exclusivas de voluntário nas faixas equivalentes da ordenação de bolsa. Em caso de empate de prioridade, desempata primeiro pela data da última mudança de situação (mais recente primeiro) e depois pela data de atualização do registro.
- **Filtro "somente voluntários"**: a tela oferece um filtro que traz apenas voluntários, desconsiderando bolsistas tanto na página quanto na contagem. Esse filtro é necessário porque o filtro comum de modalidade da equipe usa a modalidade de bolsa, que nunca alcança voluntários.
- **Coerência de filtros na equipe**:
  - Quando o filtro por modalidade de bolsa está ativo, voluntários ficam de fora do resultado.
  - O filtro "somente voluntários" **não pode** ser combinado com o filtro por modalidade de bolsa — a combinação é recusada por conflito.
  - Quando o filtro "somente voluntários" está ativo, só são aceitas situações que existem para voluntário; situações que só existem em bolsa fazem a busca ser recusada com mensagem clara.
  - Numa busca combinada (bolsistas e voluntários), uma situação enviada que não exista em nenhuma das duas fontes faz a busca ser recusada.
  - Uma situação que exista em apenas uma das fontes filtra somente aquela fonte e exclui a outra do resultado, sem quebrar a busca.
- **Isolamento por projeto**: voluntários e bolsistas de outros projetos nunca aparecem no resultado do projeto consultado.

## Estados e transições

Situações possíveis da voluntariação: **aguardando aceites**, **em avaliação**, **ativa**, **rejeitada pelo voluntário**, **reprovada pela área técnica**, **cancelada** e **finalizada**.

- **(início)** → **aguardando aceites**: coordenador solicita o voluntário.
- **aguardando aceites** → **ativa**: voluntário aceita e o edital **não exige** análise de voluntário.
- **aguardando aceites** → **em avaliação**: voluntário aceita e o edital **exige** análise de voluntário.
- **aguardando aceites** → **rejeitada pelo voluntário**: voluntário rejeita a solicitação.
- **em avaliação** → **ativa**: gerente da área técnica aprova o voluntário.
- **em avaliação** → **reprovada pela área técnica**: gerente da área técnica reprova, com justificativa.
- **ativa** → **cancelada**: coordenador cancela, com justificativa e data de fim.
- **ativa** → **finalizada**: encerramento natural do vínculo (por exemplo, ao fim do projeto).

Situações terminais: rejeitada pelo voluntário, reprovada pela área técnica, cancelada e finalizada.

## Casos especiais e exceções

- **Solicitação por quem não é coordenador**: recusada.
- **Solicitação com identificação inválida**: recusada por identificação inválida.
- **Solicitação para projeto inexistente ou pessoa inexistente**: recusada com mensagem específica de cada caso.
- **Aceite ou rejeição por outra pessoa** (que não a convidada): recusado.
- **Aceite de voluntariação que não está aguardando aceites** (por exemplo, já ativa): recusado.
- **Cancelamento por quem não é coordenador do projeto vinculado**: recusado.
- **Reprovação sem justificativa**: não permitida.
- **Pessoa já bolsista no mesmo projeto**: não pode ser voluntária no mesmo projeto (papel único por projeto).
- **Busca de equipe com situação incompatível com o filtro escolhido**: recusada antes de consultar os dados, com mensagem clara em português indicando a situação ou o filtro que causou a recusa.
- **Busca de equipe sem nenhuma situação informada**: retorna as duas fontes (ou apenas voluntários, se o filtro "somente voluntários" estiver ativo), sem filtrar por situação.

## Dados envolvidos

[[Voluntariacao]] · [[Pessoa]] · [[Projeto]] · [[Edital]] · [[AlocacaoBolsista]]

## Funcionalidades relacionadas

[[autenticacao-autorizacao]] · [[solicitacao-de-bolsa]] · [[meu-perfil]] · [[cancelamento-de-bolsa]] · [[painel-e-indicadores]] · [[notificacoes]]
