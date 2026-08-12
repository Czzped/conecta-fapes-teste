---
title: Revalidação de Bolsas
tipo: requisito
---

# Revalidação de Bolsas

Toda bolsa cuja documentação obrigatória está pendente tem um **prazo para regularização**. Este requisito descreve a rotina automática que, uma vez por dia, verifica as bolsas que ultrapassaram esse prazo sem ter regularizado os documentos exigidos e as **invalida**, impedindo que sigam em andamento fora do prazo. A rotina funciona sozinha, sem depender de ação manual de nenhum usuário.

## Atores

- **Sistema (rotina automática)** — executa diariamente, identifica as bolsas com prazo vencido e documentação irregular, e as invalida.
- **Bolsista** — pessoa cuja bolsa pode ser invalidada caso não regularize os documentos obrigatórios dentro do prazo. (Não participa da rotina; é afetado por ela.)
- **Equipe interna** — acompanha o funcionamento da rotina por meio dos registros de execução.

## Fluxo principal

1. Uma vez por dia, em horário fixo (03:30 no horário de Brasília), a rotina é disparada automaticamente.
2. A rotina **seleciona** as bolsas que estão com **documentação pendente** e cujo **prazo de envio já venceu** (prazo anterior ao momento da execução).
3. Para cada bolsa selecionada, o sistema reúne: os documentos anexados à própria bolsa, os documentos permanentes já vinculados à pessoa e a lista de documentos obrigatórios daquela modalidade/nível de bolsa.
4. O sistema verifica se há algum documento **obrigatório** ainda **não enviado**, **reprovado na análise automática** ou **reprovado na análise manual**.
5. Quando existe pelo menos um documento obrigatório nessa situação, a bolsa é **invalidada**.
6. Quando a documentação obrigatória está toda regularizada, a bolsa **não é invalidada** e permanece como está.
7. Ao final, o sistema **salva de uma só vez** todas as invalidações da execução e registra o resultado.

## Regras de negócio

- A rotina considera **apenas** bolsas em situação de **documentação pendente**. Bolsas em qualquer outra situação são ignoradas.
- Só entram na verificação as bolsas cujo **prazo de envio de documentos já passou** em relação ao momento da execução.
- A avaliação dos documentos combina três fontes: os documentos da própria bolsa, os **documentos permanentes** vinculados à pessoa e a lista de **documentos obrigatórios** definida para a modalidade/nível da bolsa.
- Os **documentos permanentes** são avaliados a partir do que está vinculado à pessoa, e não somente do que foi anexado à bolsa.
- Uma bolsa é invalidada quando houver **ao menos um** documento obrigatório **não enviado**, **reprovado na análise automática** ou **reprovado na análise manual**.
- **Documentos sem exigência de comprovante** não entram na verificação e, portanto, não causam invalidação.
- **Requisitos que só se aplicam a bolsas com redução** não devem invalidar bolsas que não têm redução.
- Quando não há nenhuma bolsa elegível, a execução termina **sem alterar nada**.
- O horário de corte segue sempre o **horário de Brasília**, independentemente da configuração do ambiente onde o sistema roda.
- Cada execução registra marcos de **início**, **ausência de itens a processar**, **sucesso** e **falha**, para acompanhamento.

## Estados e transições

- **Documentação pendente** → **Invalidada**: ocorre quando o prazo venceu e há documento obrigatório não enviado ou reprovado.
- **Documentação pendente** (permanece): quando o prazo venceu, mas toda a documentação obrigatória está regularizada, a bolsa segue inalterada.
- Bolsas em outras situações não são tocadas pela rotina.

## Casos especiais e exceções

- **Prazo vencido com documento obrigatório reprovado (automático ou manual)**: a bolsa é invalidada.
- **Prazo vencido com documento obrigatório não enviado**: a bolsa é invalidada.
- **Prazo vencido, mas documentação regularizada**: a bolsa não é invalidada.
- **Documento permanente da pessoa**: conta como regularização mesmo que não tenha sido anexado diretamente na bolsa.
- **Requisito exclusivo de bolsa com redução**: não invalida bolsas sem redução.
- **Requisito sem comprovante exigido**: fica de fora da verificação.
- **Nenhuma bolsa elegível na execução**: a rotina encerra sem salvar alterações.

## Dados envolvidos

[[AlocacaoBolsista]] · [[DocumentoMetadado]] · [[VersaoNivel]] · [[RequisitoBolsa]] · [[Pessoa]] · [[Documento]]

## Funcionalidades relacionadas

- [[implementacao-de-bolsa]] — define quando a bolsa entra em documentação pendente e quais documentos são obrigatórios.
- [[gestao-de-documentos]] — trata do envio, análise automática e análise manual dos documentos que essa rotina verifica.
- [[cancelamento-de-bolsa]] — a comunicação ao usuário sobre a bolsa invalidada é tratada no acompanhamento das bolsas.
