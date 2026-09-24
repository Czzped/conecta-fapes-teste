## ID do Cenário
[CT-M014-FO-109]

## Título
Enviar contestação de comprovação de débito recusada dentro do prazo de 15 dias

## Requisito/História Relacionada
- Produto: EPIC-M014-003 — Contestação e Auditoria; US-M014-008 Contestar Recusa.
- Regra Canônica: M014: `RN04` (prazo de 15 dias para contestação); `RN08` (`NEGADO` é terminal — sem contestação, transita para `RECUSADA_FINAL`); `RN09` (auditoria de histórico).
- Contrato/API: `M014: SubmeterContestacaoPrestacao` (Pós-MVP).

> **Pós-MVP** — Esta funcionalidade depende da extensão do `StatusPrestacao` com os estados `EM_CONTESTACAO`, `EM_REANALISE`, `APROVADA_FINAL` e `RECUSADA_FINAL`, previstos no EPIC-M014-003 e ainda não implementados no backend atual.

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- A `Prestacao` de contas do projeto ativo está com status `NEGADO` (recusada pela Área Técnica/FAPES).
- A data atual está dentro do prazo legal de **15 dias corridos** a partir da data de recusa da prestação.
- O coordenador possui acesso ao histórico de análise com a justificativa de recusa da Área Técnica visível na tela.

## Passo a Passo
1. Acessar a rota de detalhe da prestação recusada (ex.: `/coordenador/prestacao-financeira/:prestacaoId`).
2. Verificar que o badge de status exibe `Rejeitada` e que o botão `Contestar` está habilitado e visível.
3. Clicar no botão `Contestar`.
4. No formulário de contestação exibido, preencher o campo `Argumentação` com a justificativa do coordenador.
5. (Opcional) Anexar documento(s) complementar(es) de suporte à contestação.
6. Clicar no botão `Enviar Contestação`.
7. Confirmar o envio no modal de confirmação exibido (se aplicável).

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/:prestacaoId` (prestação com status `NEGADO`)
- Status inicial da `Prestacao`: `NEGADO`
- Data de recusa: dentro dos últimos 15 dias corridos.
- Argumentação: `"A nota fiscal rejeitada possui chave de acesso válida confirmada diretamente no portal da SEFAZ/ES. Anexo o comprovante de validação gerado em 18/09/2026."`
- Documento complementar (opcional): `comprovante_validacao_sefaz.pdf`

## Resultado Esperado
- O sistema aceita a submissão da contestação com sucesso.
- Uma `ContestacaoPrestacaoContas` é criada com status `SUBMETIDA`.
- O status da `Prestacao` é atualizado de `NEGADO` para `EM_CONTESTACAO`.
- O badge de status na interface do coordenador reflete o novo status `Em Contestação`.
- A Área Técnica/FAPES recebe notificação sobre a contestação pendente.
- O evento é registrado no histórico de auditoria da prestação (RN09).
- Os botões de edição da comprovação permanecem bloqueados durante o período de contestação.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
