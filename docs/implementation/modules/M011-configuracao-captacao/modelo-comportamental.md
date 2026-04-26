# Modelo Comportamental

Dominio e regras de negocio: ver [README.md](README.md)

## Ciclo de Vida da Configuracao de Captacao

```mermaid
stateDiagram-v2
    [*] --> EmAndamento : Criar configuracao
    EmAndamento --> Publicado : Validar e publicar configuracao
    EmAndamento --> NaoPublicado : Retirar configuracao antes da publicacao
    Publicado --> NaoPublicado : Despublicar configuracao
    Publicado --> Encerrado : Encerrar uso da configuracao
    NaoPublicado --> EmAndamento : Reabrir para ajustes
    Encerrado --> [*]
```

## Ciclo de Vida da Instancia de Captacao

```mermaid
stateDiagram-v2
    [*] --> Criada
    Criada --> Publicada : Data de publicacao da captacao atingida
    Publicada --> RecebendoPropostas : Periodo de recebimento iniciado
    RecebendoPropostas --> EmAvaliacaoDocumental : Periodo de recebimento encerrado
    EmAvaliacaoDocumental --> EmAvaliacaoAdHoc : Propostas habilitadas enviadas aos revisores
    EmAvaliacaoAdHoc --> ResultadoPreliminarPublicado : Pareceres consolidados
    ResultadoPreliminarPublicado --> EmRevisaoResultado : Periodo de revisao iniciado
    EmRevisaoResultado --> ResultadoFinalPublicado : Revisoes analisadas
    ResultadoPreliminarPublicado --> ResultadoFinalPublicado : Sem revisoes admissiveis
    ResultadoFinalPublicado --> [*]
```

## Observacoes

- A instancia de captacao termina no M011 quando o resultado final e publicado.
- Propostas aprovadas no resultado final ficam disponiveis para o M022 - Contratacao e Outorga.
- A iniciativa somente passa ao M003 apos contratacao/outorga formalizada no M022.
- Alteracoes de cronograma por adiamento nao criam um novo estado da instancia; elas registram historico temporal e deslocam a etapa alterada e as etapas posteriores pela mesma quantidade de dias.
- Quando o proponente for empresa ou instituicao, a proposta deve identificar uma pessoa fisica representante vinculada ao cadastro corporativo do M008. Documentos institucionais recorrentes devem ser reaproveitados do cadastro quando validos.
