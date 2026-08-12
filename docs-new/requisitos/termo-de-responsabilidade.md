---
title: Termo de Responsabilidade
tipo: requisito
---

# Termo de Responsabilidade

O Termo de Responsabilidade é o documento em que o bolsista formaliza o compromisso com as obrigações da bolsa. Ele é um dos requisitos documentais da solicitação: o sistema o gera em PDF, com todas as seções obrigatórias, a partir dos dados da bolsa e das declarações prestadas pelo bolsista, e depois exige a assinatura do próprio bolsista. Enquanto o termo não estiver gerado, assinado e aprovado, a documentação da bolsa não se completa.

Antes de gerar o termo, o bolsista responde a declarações que passam a integrar o documento: se recebe outra bolsa, se exerce atividade remunerada e se tem vínculo de parentesco com coordenador, orientador ou supervisor. Essas respostas ficam registradas junto ao termo.

## Atores

- **Bolsista**: responde às declarações, gera o termo, assina e, quando necessário, exclui o termo para regenerá-lo. Só pode agir sobre o próprio termo.
- **Analista da área técnica da FAPES**: analisa o termo como parte da documentação da bolsa e pode aprová-lo; uma vez aprovado, o termo fica protegido contra exclusão.

## Fluxo principal

1. Na área "Meus documentos", quando o requisito é o Termo de Responsabilidade, o sistema pode solicitar as declarações antes da geração.
2. O bolsista responde às declarações obrigatórias: recebimento de outra bolsa, exercício de atividade remunerada e vínculo de parentesco com coordenador, orientador ou supervisor.
3. O bolsista solicita a geração do termo.
4. O sistema monta um PDF com todas as seções obrigatórias, incorporando as declarações prestadas e, quando aplicável, a redução por vínculo.
5. O PDF é armazenado de forma compactada e passa a ter um registro no sistema como documento da bolsa.
6. O bolsista assina o termo; a assinatura fica registrada.
7. O termo assinado segue para a análise documental junto com os demais documentos da bolsa (ver [[gestao-de-documentos]]).
8. Se for preciso corrigir informações antes da aprovação, o bolsista exclui o termo atual e gera um novo com os dados corretos.

## Regras de negócio

**Geração**

- A geração só é permitida quando a bolsa está com "Documentação pendente". Em outro estado (por exemplo, bolsa já ativa), a geração é recusada com a mensagem de que não é possível gerar o termo no status atual da bolsa.
- Não é permitida geração duplicada: se já existir termo gerado, uma nova solicitação é recusada com "Você já possui um termo de responsabilidade". Para trocar, é preciso excluir o termo atual e gerar outro.
- A geração exige identificação válida do bolsista (CPF, nome e e-mail); sem isso é recusada ("Claims inválidas").
- O PDF gerado contém, obrigatoriamente, as seções: declaração inicial, responsabilidades do bolsista, responsabilidades do orientador, responsabilidades do coordenador, declarações e texto final.
- Quando a bolsa tem redução por vínculo, o PDF exibe o percentual de redução junto à sigla do nível da bolsa.

**Declarações anexas**

- As declarações prestadas pelo bolsista ficam vinculadas ao termo e passam a compor a seção de declarações do PDF.
- A declaração de atividade remunerada registra o tipo de atividade, o vínculo com a instituição, o nome da instituição, o cargo e a carga horária semanal.
- A declaração de outra bolsa registra a modalidade, a instituição e a vigência da bolsa recebida.
- O vínculo de parentesco consanguíneo com coordenador, orientador ou supervisor é registrado junto ao termo.

**Assinatura**

- Somente o próprio bolsista pode assinar o termo; a tentativa de assinatura por outro usuário é recusada com "Somente o bolsista pode assinar o termo!".
- A assinatura só é permitida enquanto a bolsa está em estado editável (documentação pendente ou aguardando aceites). Com a bolsa em outro estado, é recusada com a mensagem de que não é possível alterar o termo no status atual da bolsa.
- Um termo já assinado não pode ser assinado novamente ("Termo já foi assinado").

**Exclusão**

- Somente o próprio bolsista pode excluir o termo; a tentativa por outro usuário é recusada com "Somente o bolsista pode deletar o termo".
- A exclusão só é permitida com a bolsa em estado editável (documentação pendente ou aguardando aceites).
- Um termo já aprovado pela área técnica não pode ser excluído; a tentativa é recusada com a orientação de que, como o termo já foi aprovado por um profissional da área técnica, o bolsista deve solicitar a revisão do documento.

## Estados e transições

O termo passa pelos seguintes estados, sempre atrelados ao estado da bolsa:

- **Inexistente**: nenhum termo gerado para a bolsa.
- **Gerado, não assinado**: PDF criado e registrado, aguardando assinatura.
- **Gerado e assinado**: assinatura do bolsista registrada; segue para análise.
- **Aprovado**: aprovado pela área técnica na análise documental; passa a ser protegido contra exclusão.

Transições típicas:

- Inexistente → Gerado (geração, com a bolsa em documentação pendente).
- Gerado → Assinado (assinatura do bolsista, com a bolsa editável).
- Gerado/Assinado → Inexistente (exclusão pelo bolsista, enquanto o termo não estiver aprovado).
- Assinado → Aprovado (decisão da área técnica).
- Aprovado → (exclusão bloqueada; correção só via pedido de revisão).

## Casos especiais e exceções

- **Correção após aprovação**: uma vez aprovado, o termo não pode ser apagado nem substituído livremente; a alteração passa a depender de um pedido de revisão pela área técnica.
- **Redução por vínculo**: só aparece no PDF quando a bolsa efetivamente tem redução; caso contrário, a seção correspondente não exibe percentual.
- **Regeneração**: para corrigir declarações ou dados após a geração, o único caminho enquanto a bolsa ainda é editável é excluir o termo e gerar outro; não há edição direta do PDF já gerado.
- **Bolsa fora de estado editável**: com a bolsa já ativa ou em avaliação, ficam bloqueadas geração, assinatura e exclusão do termo.
- **Tentativa de agir sobre termo alheio**: assinatura e exclusão verificam a titularidade e recusam a ação de qualquer usuário que não seja o bolsista dono do termo.

## Dados envolvidos

[[TermoResponsabilidadeMetadado]] · [[DeclaracaoAtividadeRemunerada]] · [[DeclaracaoOutraBolsa]] · [[DocumentoMetadado]] · [[AlocacaoBolsista]]

## Funcionalidades relacionadas

- [[gestao-de-documentos]] — o termo é um dos documentos exigidos e segue o mesmo fluxo de análise e aprovação.
- [[solicitacao-de-bolsa]] — origina a bolsa e a exigência do termo.
- [[implementacao-de-bolsa]] — a aprovação da bolsa depende do termo aprovado junto aos demais documentos.
- [[meu-perfil]] — os dados cadastrais e de vínculo alimentam o conteúdo do termo.
- [[notificacoes]] — avisa o bolsista sobre a necessidade de gerar, assinar ou corrigir o termo.
