---
title: Gestão de Documentos
tipo: requisito
---

# Gestão de Documentos

Toda bolsa solicitada no ConectaFapes só avança para aprovação depois que o bolsista comprova, por meio de documentos, que cumpre os requisitos exigidos pela modalidade. Esta funcionalidade concentra o envio, a atualização, a consulta e o download desses documentos, bem como a validação automática e a análise manual feita pela equipe técnica da FAPES. É o elo entre a solicitação da bolsa e a decisão de implementá-la: enquanto houver documento faltando ou reprovado, a bolsa permanece pendente.

Cada bolsa carrega uma lista de requisitos documentais definida pela modalidade e pela versão vigente. Para cada requisito o bolsista deve anexar o arquivo esperado. Existem também documentos perenes, ligados à pessoa e não a uma bolsa específica, que ficam disponíveis independentemente de haver solicitação em andamento.

## Atores

- **Bolsista**: envia, atualiza, consulta e baixa os próprios documentos. Só enxerga e manipula documentos vinculados ao seu CPF.
- **Analista da área técnica da FAPES**: analisa manualmente os documentos, aprova, reprova ou devolve para revisão, sempre registrando justificativa quando cabível.
- **Validação automática**: serviço que recebe cada documento enviado e devolve um parecer preliminar de aprovação ou reprovação antes da análise humana.

## Fluxo principal

1. O bolsista solicita a bolsa; a partir daí a bolsa passa a ter uma lista de requisitos documentais e o status "Documentação pendente".
2. Na área "Meus documentos", o bolsista consulta os requisitos da bolsa e vê, para cada um, o documento esperado, a data de envio (quando já houver arquivo) e o status atual.
3. Para cada requisito, o bolsista anexa o arquivo esperado em PDF.
4. Ao enviar, o documento é armazenado de forma compactada e passa a constar como "Anexado/Enviado".
5. O documento segue automaticamente para a validação automática, que devolve um parecer preliminar de aprovação ou reprovação.
6. A equipe técnica da FAPES faz a análise manual e conclui o documento como aprovado, reprovado ou com pedido de revisão. Em pedido de revisão ou reprovação, é registrada uma justificativa que o bolsista pode consultar.
7. Quando um documento é devolvido para correção, o bolsista substitui o arquivo pelo documento corrigido, e ele volta ao início do ciclo de avaliação.
8. Quando todos os documentos obrigatórios da bolsa estão aprovados, o sistema reconhece a completude documental e a bolsa fica apta a ser aprovada. A bolsa só é efetivamente implementada com todos os documentos aprovados (ver [[implementacao-de-bolsa]]).

## Regras de negócio

**Envio de arquivo**

- O documento é sempre enviado vinculado a uma bolsa e a um requisito documental específico dela.
- É obrigatório anexar um arquivo; o envio sem arquivo é recusado com a mensagem "Arquivo não enviado".
- O arquivo tem tamanho máximo de 5 MB. Acima disso o envio é recusado com "Arquivo muito grande. Limite: 5 MB".
- O formato esperado é PDF, legível e completo.
- O arquivo é guardado de forma compactada, preservando-se o nome original e o tipo de conteúdo.
- O bolsista só consegue enviar documentos de bolsas vinculadas ao seu próprio CPF; sem identificação válida (CPF, nome e e-mail), o envio é recusado com "Token claims inválidas".

**Duplicidade**

- Não pode existir mais de um documento ativo para o mesmo requisito da mesma bolsa. Se já houver documento enviado para aquele requisito, um novo envio é recusado com a orientação de que, para trocar o arquivo, o bolsista deve usar a atualização e não um novo envio.

**Atualização**

- A atualização substitui o arquivo anterior pelo novo e devolve o documento ao status "Enviado", reiniciando o ciclo de avaliação.
- A atualização só é permitida enquanto a bolsa estiver em estado editável (documentação pendente ou em edição). Com a bolsa já ativa, a atualização é recusada com a mensagem de que não é possível atualizar porque a bolsa não está em edição nem pendente.

**Download**

- O download é restrito ao próprio bolsista: só é possível baixar documentos vinculados ao seu CPF.
- A tentativa de baixar documento de outro bolsista é recusada com "Você não tem permissão para carregar esse arquivo!".
- O arquivo é devolvido em PDF.

**Validação automática**

- Todo documento enviado é encaminhado automaticamente para validação.
- O parecer automático pode ser "aprovado" ou "reprovado", refletido no status do documento.
- Um parecer com resultado não reconhecido é recusado ("Status de validação inválido").
- O parecer automático só é aceito se o status atual do documento permitir avaliação. Se o documento já foi decidido manualmente (por exemplo, aprovado pela área técnica), o parecer automático é recusado com "Status do documento não permite avaliação".

**Análise manual e pedido de revisão**

- A análise manual da equipe técnica prevalece sobre o parecer automático.
- Reprovação e pedido de revisão exigem justificativa, que fica disponível para o bolsista consultar junto ao documento.
- O pedido de revisão devolve o documento ao bolsista para correção sem descartar o requisito; o bolsista reenvia o arquivo corrigido.

**Completude e aprovação da bolsa**

- A bolsa só pode ser aprovada quando todos os documentos obrigatórios estiverem aprovados.
- Quando o sistema verifica que todos os documentos obrigatórios estão aprovados, o status da bolsa é atualizado automaticamente para refletir a completude documental.

**Consulta de requisitos**

- Os requisitos documentais podem ser consultados por bolsa, retornando a lista de documentos obrigatórios com o respectivo status de envio.
- Também podem ser consultados os documentos perenes da pessoa, que independem de uma bolsa específica.

## Estados e transições

Cada documento passa por uma sequência de estados, exibidos ao bolsista em linguagem amigável:

- **Não anexado**: requisito ainda sem arquivo.
- **Anexado / Enviado**: arquivo enviado e registrado.
- **Em processamento**: o sistema está preparando a análise do arquivo.
- **Pendente de avaliação**: aguardando validação.
- **Aprovado pela validação automática**: parecer preliminar favorável.
- **Reprovado pela validação automática**: parecer preliminar desfavorável.
- **Aprovado (manual)**: aprovado pela área técnica.
- **Pedido de revisão**: devolvido para correção, com justificativa.
- **Reprovado**: recusado pela área técnica, com justificativa.

Transições típicas:

- Não anexado → Enviado (ao anexar).
- Enviado → Aprovado/Reprovado pela validação automática (ao receber o parecer).
- Enviado/Aprovado automático → Aprovado manual / Reprovado / Pedido de revisão (análise da equipe).
- Pedido de revisão / Reprovado → Enviado (ao atualizar o arquivo).
- Um documento já aprovado manualmente não volta a aceitar parecer automático.

No nível da bolsa, o preenchimento e a aprovação de todos os documentos leva a bolsa de "Documentação pendente" à condição de completude que habilita a aprovação.

## Casos especiais e exceções

- **Documentos perenes**: alguns documentos ficam ligados à pessoa e não a uma bolsa; permanecem consultáveis mesmo sem solicitação ativa e podem ser reaproveitados entre vínculos.
- **Bolsa não editável**: com a bolsa já ativa (ou fora dos estados editáveis), o bolsista não consegue atualizar documentos; correções passam a depender de o sistema devolver algum requisito para revisão.
- **Documento já decidido manualmente**: pareceres automáticos que cheguem depois da decisão da área técnica são ignorados, evitando que uma reavaliação automática sobrescreva a análise humana.
- **Divergência entre validação automática e manual**: o parecer automático é preliminar; a decisão da equipe técnica é a que vale para a completude documental.
- **Arquivo ilegível ou incompleto**: não é barrado pelo tamanho ou formato, mas tende a resultar em pedido de revisão ou reprovação na análise, com justificativa orientando o reenvio.
- **Tentativa de acesso a documento de terceiro**: bloqueada tanto no download quanto na manipulação, pela verificação de titularidade por CPF.

## Dados envolvidos

[[DocumentoMetadado]] · [[RequisitoBolsa]] · [[AlocacaoBolsista]] · [[TipoDocumento]] · [[Pessoa]]

## Funcionalidades relacionadas

- [[solicitacao-de-bolsa]] — origina a bolsa e a lista de requisitos documentais.
- [[implementacao-de-bolsa]] — a aprovação da bolsa depende de todos os documentos aprovados.
- [[termo-de-responsabilidade]] — é um dos documentos exigidos, com fluxo próprio de geração e assinatura.
- [[gestao-de-modalidades]] — define quais documentos cada modalidade exige.
- [[meu-perfil]] — os dados cadastrais alimentam a análise documental.
- [[notificacoes]] — avisa o bolsista sobre pendências, pedidos de revisão e reprovações.
