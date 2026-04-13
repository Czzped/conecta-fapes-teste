# Modelo Comportamental

Dominio e regras de negocio: ver [README.md](README.md)

### Ciclo de Vida: Edital

```mermaid
stateDiagram-v2
    [*] --> EmElaboracao : Criar Edital

    EmElaboracao --> EmElaboracao : Definir Cronograma
    EmElaboracao --> EmElaboracao : Configurar Parametros de Fomento
    EmElaboracao --> EmElaboracao : Criar Formularios
    EmElaboracao --> EmElaboracao : Associar Revisores
    EmElaboracao --> Publicado : Publicar Edital [cronograma e formularios configurados]

    Publicado --> EmAndamento : Data de inicio de submissao atingida
    Publicado --> EmElaboracao : Retificar Edital [cria nova versao]

    EmAndamento --> Encerrado : Todas as fases do cronograma concluidas

    Encerrado --> [*]

    state EmElaboracao : Edital em configuracao
    state Publicado : Edital disponivel, aguardando inicio
    state EmAndamento : Periodos do edital em execucao
    state Encerrado : Todos os periodos finalizados

    note right of Publicado : Edital publicado nao pode\nser editado (RN04), apenas\nretificado via nova versao
    note right of EmAndamento : Transicao automatica quando\ndata de submissao e atingida (RN08)
```
