# Backlog - Diarias

[M008](../README.md) | [Modelo Estrutural](modelo-estrutural.md)

## EPICs

| ID | Titulo | Prioridade | Status | Documento |
|----|--------|------------|--------|-----------|
| EPIC-M008-005 | Gestao Corporativa de Diarias | Must | To Do | [EPIC-M008-005](epics/EPIC-M008-005.md) |

## Historias

| ID | Historia | Prioridade | Status | Observacao |
|----|----------|------------|--------|------------|
| US-M008-021 | Gerenciar valores vigentes de diaria por abrangencia | Must | To Do | Mantem abrangencia, valor unitario e vigencia |
| US-M008-022 | Gerenciar abrangencias de diaria | Must | To Do | Mantem codigo, nome, descricao e situacao ativa/inativa |
| US-M008-023 | Bloquear vigencias sobrepostas para a mesma abrangencia | Must | To Do | Garante apenas um valor vigente por data de referencia |
| US-M008-024 | Consultar diaria e parametros vigentes para consumo do M003 | Must | To Do | Retorna TipoDiaria, abrangencia e ParametroCalculoDiaria vigente vinculado ao tipo |
| US-M008-025 | Ativar e inativar valores de diaria preservando historico | Should | To Do | Inativos nao aparecem em novas solicitacoes, mas seguem consultaveis |
| US-M008-026 | Auditar alteracoes dos cadastros de diaria | Should | To Do | Registra usuario, data, antes/depois e justificativa quando aplicavel |
| US-M008-027 | Gerenciar parametros normativos de calculo de diaria | Must | To Do | Mantem percentuais, limites, bloqueios, norma e vigencia vinculados ao TipoDiaria |

## Rastreabilidade

| Historia | Entidade principal | Regras relacionadas | Consumidor |
|----------|--------------------|---------------------|------------|
| US-M008-021 | TipoDiaria | RN22, RN23 | M003 |
| US-M008-022 | Abrangencia | RN22 | M003 |
| US-M008-023 | TipoDiaria | RN23 | M003 |
| US-M008-024 | TipoDiaria | RN22, RN23 | M003 |
| US-M008-025 | TipoDiaria | RN22, RN23 | Back-office, M003 |
| US-M008-026 | TipoDiaria | RN22, RN23 | Auditoria interna |
| US-M008-027 | ParametroCalculoDiaria | RN24 | M003 |

## Observacoes de Escopo

- O contexto Diarias pertence ao M008 e fica em **Configuracoes > Referencias Corporativas > Diarias**.
- M003 nao cadastra valor de diaria; apenas consulta o cadastro vigente pela abrangencia e grava snapshot na solicitacao.
- A abrangencia da viagem e classe corporativa de referencia, mantida no M008.
- Os parametros normativos de calculo pertencem ao M008, ficam vinculados ao `TipoDiaria` e sao consumidos pelo M003 no momento da solicitacao.
- Alteracoes posteriores em valor, abrangencia ou parametros normativos nao alteram solicitacoes ja criadas.

## Referência funcional de Diária

### Contexto

Diária é um recurso financeiro destinado a cobrir despesas com alimentação, hospedagem e locomoção decorrentes de afastamento da sede, em caráter eventual, para outro ponto do estado, do país ou do exterior relacionadas a atividades de pesquisa, inovação, extensão e capacitação vinculadas aos objetivos do projeto financiado apoiado pela Fundação de Amparo à Pesquisa e Inovação do Espírito Santo (FAPES).

Os valores atuais de Diária são:

- Dentro do Estado do Espírito Santo: R$ 220,00
- Fora do Estado (Brasil): R$ 450,00
- Internacional: US$ 220,00 a US$ 550,00, conforme o grupo de países de destino

Esses valores devem ser parametrizados para quando forem alterados no futuro.

### Comportamento

- Para o projeto usar Diária, ele deve ter esse recurso disponibilizado em seu Edital.
- Se o valor total da Diária for maior que o valor que o projeto tiver disponível para essa categoria, o coordenador deve fazer primeiro o Remanejamento de Recursos, pegar um valor que não usou em outra categoria e incluir em Diária.
- Antes de realizar a Diária é necessário fazer a Solicitação. Nela todas as informações ficam registradas.
- O Bolsista selecionado para a Diária deve fazer o aceite.
- A distância mínima para solicitar uma Diária é de 150km.
- Diária deve ter o período máximo de 15 dias por viagem dentro de um mês (Decreto Estadual e Norma Itens Financiáveis). Pode permitir mais de 15 dias entre um mês e outro, pois o Decreto não especifica essa situação.
- Diária é destinada apenas a membros do projeto. É proibido pagar diária para terceiros.
- O Coordenador deve retirar o valor da Diária da conta do Projeto e enviar para a conta Banestes do Bolsista.
- Após a data da Diária, o Bolsista ou Coordenador devem comprovar com texto e imagem que foram na viagem.
- Após o valor sair da conta do projeto, a Diária acontecer e seu relatório ser enviado, o Coordenador deve em Prestação de Contas Financeira associar a saída do valor a Diária solicitada.
