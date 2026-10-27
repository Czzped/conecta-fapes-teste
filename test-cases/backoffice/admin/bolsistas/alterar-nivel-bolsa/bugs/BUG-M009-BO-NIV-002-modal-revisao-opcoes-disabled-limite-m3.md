## Título
[Bug] Modal de solicitar revisão desabilita todas as opções de dias extras e impede envio de segunda diligência quando prazo atinge o limite M3

## ID
BUG-M009-BO-NIV-002 (Issue https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/742)

## Requisito/Regra Violada
- Regra Canônica: `M009: RN04` (Prazos regulamentares de documentação), `M004: EPIC-M004-001` (Calendário mensal e marcos da folha M2 e M3) e Heurística de Nielsen #5 (Prevenção de Erros) e #9 (Recuperação e consistência em fluxos com restrições temporais).
- Caso de Teste Relacionado: [CT-M009-BO-001](../CT-M009-BO-001-implementar-novo-nivel-com-swap-atomico.md) (Issue https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/725).
- Rota/Componente: `/gestao-bolsa/documentos-bolsista/{idAlocacao}` / Modal `Solicitar Revisão` (`ModalSolicitarRevisao.vue` / Backoffice Admin UI).
- Endpoint da API: `POST /api/solicitacoes-alteracao-nivel/{id}/documentos/{idRequisito}/solicitar-revisao`

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows / Navegador Web (Chrome/Edge) / Backoffice Vue/Nuxt Admin UI

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar `/gestao-bolsa/visualizar-pendencias` e abrir uma solicitação de alteração de nível em análise (ex.: Eduarda Cricco).
2. Na tela de `Documentos para Avaliação`, localizar um documento com pendência (ex.: *Diploma Nível Superior*) e clicar no ícone de triângulo amarelo (⚠️ **Solicitar envio do documento ao bolsista**).
3. No modal `Solicitar Revisão`, observar o cálculo inicial dos marcos:
   - Prazo base (M2): `11/11/2026`
   - Limite (M3): `17/11/2026`
4. No campo `Dias extras para reenvio *`, selecionar o valor de **6 dias** (fazendo com que o prazo resultante atinja exatamente o teto M3: `17/11/2026`).
5. Preencher a justificativa no campo `Motivo do pedido de revisão *` e clicar em `Enviar Revisão`.
6. Observar que a revisão do primeiro documento é enviada com sucesso (toast verde exibido e status atualizado para `Pedido de Revisão`).
7. Em seguida, na mesma tela, tentar solicitar revisão de um **segundo documento** com inconformidade (ex.: *Certidão Negativa de débitos federal*), clicando no respectivo triângulo amarelo (⚠️).
8. No modal aberto para o segundo documento, observar os marcos:
   - Prazo base (M2): agora atualizado para `17/11/2026`.
   - Limite (M3): `17/11/2026`.
9. Clicar no dropdown `Dias extras para reenvio *` para selecionar o prazo.

## Dados de Entrada
- Rota: `/gestao-bolsa/documentos-bolsista/9485c815-1bca-410a-fae1-08df34475af7`
- 1º Documento avaliado: *Diploma Nível Superior*
  - Prazo base M2 inicial: `11/11/2026`
  - Limite M3: `17/11/2026`
  - Dias extras selecionados: `6 dias`
  - Prazo resultante calculado: `17/11/2026`
- 2º Documento avaliado: *Certidão Negativa de débitos federal*
  - Prazo base M2 herdado da primeira diligência: `17/11/2026`
  - Limite M3: `17/11/2026`

## Comportamento Esperado
- A concessão de prazo de diligência deve ser compreendida como um prazo unificado para o bolsista sanar as pendências da sua alocação, e não como uma obrigatoriedade de estender novamente a data limite para cada documento avulso.
- Quando o prazo base (M2) já tiver sido estendido até o teto regulamentar (M3), o modal deve:
  1. Disponibilizar a opção **`0 dias (Manter prazo vigente de 17/11/2026)`** no dropdown de dias extras; **OU**
  2. Assumir automaticamente o prazo final já concedido para a alocação, exigindo do analista apenas o preenchimento do motivo específico daquele documento.
- O analista deve conseguir solicitar revisão de quantos documentos forem necessários na mesma pasta/análise.

## Comportamento Atual
- O dropdown `Dias extras para reenvio *` só oferece opções estritamente positivas: `1 dia`, `2 dias`, `3 dias`... até `10 dias`.
- A regra de validação do componente impede que qualquer opção ultrapasse o corte da folha M3 (`M2 + dias extras > M3`).
- Como o M2 já é igual a M3 (`17/11`), somar `+1 dia` resultaria em `18/11` (estourando a folha). Portanto, **todas as 10 opções do dropdown ficam desabilitadas (disabled)**.
- Como o campo de dias extras é obrigatório (`*`) e não existe nenhuma opção selecionável na lista, o formulário entra em um estado travado permanente e o botão `Enviar Revisão` não pode ser acionado, **bloqueando a diligência de qualquer documento subsequente**.

## Evidências

### Cenário A: Primeira Revisão com Seleção de 6 Dias Extras (Atingindo M3)
- 📷 Seleção de 6 dias extras no primeiro documento (Diploma):
![Seleção de 6 dias extras](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/backoffice/admin/bolsistas/alterar-nivel-bolsa/evidencias/evidencia-BUG-BO-NIV-002-01-primeira-revisao-selecao-dias-extras.png)

- 📷 Confirmação da primeira revisão com prazo resultante em 17/11/2026:
![Confirmação da 1ª Revisão](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/backoffice/admin/bolsistas/alterar-nivel-bolsa/evidencias/evidencia-BUG-BO-NIV-002-02-primeira-revisao-confirmada-prazo-m3.png)

- 📷 Primeiro documento atualizado com sucesso para status "Pedido de Revisão":
![Primeiro Documento em Pedido de Revisão](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/backoffice/admin/bolsistas/alterar-nivel-bolsa/evidencias/evidencia-BUG-BO-NIV-002-03-primeira-revisao-sucesso-documento-atualizado.png)

### Cenário B: Tentativa de Segunda Revisão — Todas as Opções Disabled e Bloqueio de Envio
- 📷 Dropdown com todas as opções desabilitadas ao tentar pedir revisão na Certidão:
![Opções de Dias Extras Desabilitadas](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/backoffice/admin/bolsistas/alterar-nivel-bolsa/evidencias/evidencia-BUG-BO-NIV-002-04-segunda-revisao-opcoes-disabled-bloqueio.png)

## Impacto no Negócio
- **Bloqueio de Análise de Conformidade Documental:** Se um bolsista tiver mais de um documento irregular, o analista da FAPES é impossibilitado de apontar todos os problemas de uma vez.
- **Morosidade e Burocracia:** O analista é forçado a realizar análises sequenciais (esperar o bolsista corrigir um documento para só depois poder apontar o erro no segundo) ou a reprovar integralmente a solicitação do bolsista por falta de ferramenta de diligência múltipla.
