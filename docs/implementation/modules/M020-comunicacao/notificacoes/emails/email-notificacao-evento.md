# Template de Email - Notificacao de Evento

## Objetivo

Padronizar o email transacional enviado quando um evento relevante ocorre no ConectaFAPES, como:

- bolsista alocado em projeto;
- pagamento planejado;
- pagamento realizado;
- diaria pendente de aceite;
- prestacao de contas enviada ou analisada.

O template deve ser usado para notificacoes individuais, geradas por eventos de negocio dos modulos da plataforma e processadas pelo M020 - Comunicacao.

## Principios de Design

- **Clareza primeiro**: o destinatario deve entender o que aconteceu na primeira linha.
- **Contexto suficiente**: incluir projeto, pessoa envolvida, valor, data e status quando existirem.
- **Acao explicita**: quando houver uma proxima acao, exibir um botao principal.
- **Rastreabilidade**: incluir codigo do evento, modulo de origem e data/hora de envio no rodape.
- **Compatibilidade**: usar HTML com CSS inline e largura maxima de 640px para boa renderizacao em clientes de email.

## Estrutura Visual

| Area | Conteudo | Observacao |
|------|----------|------------|
| Preheader | Resumo curto invisivel/parcialmente visivel na caixa de entrada | Deve complementar o assunto |
| Cabecalho | Marca ConectaFAPES/FAPES e etiqueta do tipo de evento | Visual institucional |
| Titulo | Mensagem direta do evento | Ex: "Bolsista alocado no projeto" |
| Texto principal | Frase curta explicando o ocorrido | Sem texto juridico ou excesso de detalhe |
| Card de resumo | Principais dados do evento | Projeto, beneficiario, valor, competencia, status |
| Botao principal | Link para acessar o sistema | Opcional, conforme evento |
| Observacao | Nota operacional, se necessario | Ex: "Nenhuma acao adicional e necessaria" |
| Rodape | Codigo do evento, modulo, data/hora e aviso de email automatico | Auditoria e suporte |

## Variaveis Padrao

| Variavel | Descricao | Exemplo |
|----------|-----------|---------|
| `{{preheader}}` | Resumo curto para preview do email | "Mariana Costa foi alocada no projeto Conecta Fapes." |
| `{{tipoEvento}}` | Categoria exibida no selo do cabecalho | "Alocacao de bolsista" |
| `{{titulo}}` | Titulo principal do email | "Bolsista alocado no projeto" |
| `{{mensagemPrincipal}}` | Texto explicativo do evento | "A alocacao foi registrada e ja esta disponivel para acompanhamento." |
| `{{nomeDestinatario}}` | Nome de quem recebe | "Paulo Sergio Junior" |
| `{{projeto}}` | Nome do projeto/iniciativa | "Conecta Fapes" |
| `{{atorPrincipalRotulo}}` | Rotulo da pessoa principal | "Bolsista" |
| `{{atorPrincipalNome}}` | Nome da pessoa principal | "Mariana Costa" |
| `{{valorRotulo}}` | Rotulo do valor, se houver | "Valor planejado" |
| `{{valor}}` | Valor monetario, se houver | "R$ 700,00" |
| `{{dataRotulo}}` | Rotulo da data | "Data do evento" |
| `{{dataEvento}}` | Data/hora ou competencia | "03/05/2026 - 14:32" |
| `{{status}}` | Status do evento | "Alocado" |
| `{{acaoTexto}}` | Texto do botao | "Acessar projeto" |
| `{{acaoUrl}}` | URL do botao | "https://conectafapes..." |
| `{{observacao}}` | Nota complementar | "Este pagamento ainda aguardara processamento bancario." |
| `{{codigoEvento}}` | Codigo de rastreio da notificacao/evento | "EVT-M009-2026-00042" |
| `{{moduloOrigem}}` | Modulo que originou a notificacao | "M009" |

## Assunto por Evento

| Evento | Assunto sugerido | Preheader sugerido |
|--------|------------------|--------------------|
| Bolsista alocado | `ConectaFAPES - Bolsista alocado em {{projeto}}` | `{{atorPrincipalNome}} foi alocado no projeto {{projeto}}.` |
| Pagamento planejado | `ConectaFAPES - Pagamento planejado para {{projeto}}` | `Um pagamento de {{valor}} foi planejado e esta aguardando processamento.` |
| Pagamento realizado | `ConectaFAPES - Pagamento realizado` | `O pagamento de {{valor}} foi realizado com sucesso.` |
| Diaria pendente de aceite | `ConectaFAPES - Diaria aguardando aceite` | `Existe uma diaria pendente de aceite no projeto {{projeto}}.` |

## Exemplos de Conteudo

### Bolsista Alocado em Projeto

| Campo | Valor |
|-------|-------|
| `tipoEvento` | Alocacao de bolsista |
| `titulo` | Bolsista alocado no projeto |
| `mensagemPrincipal` | A alocacao foi registrada e ja esta disponivel para acompanhamento pela equipe do projeto. |
| `atorPrincipalRotulo` | Bolsista |
| `atorPrincipalNome` | Mariana Costa |
| `valorRotulo` | Bolsa mensal |
| `valor` | R$ 700,00 |
| `dataRotulo` | Inicio da alocacao |
| `dataEvento` | 01/06/2026 |
| `status` | Alocado |
| `acaoTexto` | Ver minha equipe |

### Pagamento Planejado

| Campo | Valor |
|-------|-------|
| `tipoEvento` | Pagamento planejado |
| `titulo` | Pagamento planejado |
| `mensagemPrincipal` | Um pagamento foi planejado para a proxima rotina financeira e aguardara processamento bancario. |
| `atorPrincipalRotulo` | Beneficiario |
| `atorPrincipalNome` | Mariana Costa |
| `valorRotulo` | Valor planejado |
| `valor` | R$ 700,00 |
| `dataRotulo` | Competencia |
| `dataEvento` | Maio/2026 |
| `status` | Planejado |
| `acaoTexto` | Ver pagamentos |

### Pagamento Realizado

| Campo | Valor |
|-------|-------|
| `tipoEvento` | Pagamento realizado |
| `titulo` | Pagamento realizado com sucesso |
| `mensagemPrincipal` | O pagamento foi realizado e ja pode ser consultado no historico financeiro. |
| `atorPrincipalRotulo` | Beneficiario |
| `atorPrincipalNome` | Mariana Costa |
| `valorRotulo` | Valor pago |
| `valor` | R$ 700,00 |
| `dataRotulo` | Data do pagamento |
| `dataEvento` | 05/05/2026 |
| `status` | Realizado |
| `acaoTexto` | Ver meus pagamentos |

## Arquivo HTML

O HTML base esta em [email-notificacao-evento.html](email-notificacao-evento.html).

Esse arquivo deve ser usado como `TemplateNotificacao.corpoTemplate` no M020, com substituicao das variaveis `{{...}}` no processamento da notificacao.
