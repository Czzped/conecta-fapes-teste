## ID do Cenário
[CT-M014-FO-103]

## Título
Validar estado desabilitado dos campos na seção "Verificar Informações da Nota Fiscal" antes de acionar o botão "Editar"

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Nota Fiscal)
- Regra Canônica: M014: `RN05` / `RI-NFE02` (Bloqueio e controle de edição de dados de DocumentoFiscal após extração/confirmação)
- Contrato/API: `M014: ValidarDadosNotaFiscal`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação de débito selecionada e em fase de comprovação.
- Nota Fiscal (XML ou PDF) já anexada com sucesso à comprovação de débito.
- Seção `Verificar Informações da Nota Fiscal` expandida na tela.

## Passo a Passo
1. Acessar a tela de comprovação de débito contendo uma Nota Fiscal previamente anexada.
2. Navegar até a seção `Verificar Informações da Nota Fiscal`.
3. Tentar clicar e editar os campos de entrada (`Chave de Acesso`, `Data de Emissão`, `CNPJ Emitente`, `UF Emitente`, `Total ICMS`, `Total PIS`, `Total IPI`, `Total ISS`) sem acionar o botão `Editar`.
4. Verificar se os campos permanecem desabilitados/bloqueados para edição.
5. Clicar no botão `Editar`.
6. Tentar novamente interagir e alterar as informações dos campos da seção.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Estado da Nota Fiscal: Anexada com dados extraídos
- Campos inspecionados: `Chave de Acesso`, `Data de Emissão`, `CNPJ Emitente`, `UF Emitente`, `Total ICMS`, `Total PIS`, `Total IPI`, `Total ISS`

## Resultado Esperado
- Enquanto o botão `Editar` não for acionado, todos os campos da seção `Verificar Informações da Nota Fiscal` permanecem desabilitados (read-only/disabled), impedindo edição direta.
- O botão `Editar` é exibido em estado ativo para permitir a liberação de edição.
- Ao clicar no botão `Editar`, os campos da seção são habilitados, tornando-se editáveis pelo coordenador.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
