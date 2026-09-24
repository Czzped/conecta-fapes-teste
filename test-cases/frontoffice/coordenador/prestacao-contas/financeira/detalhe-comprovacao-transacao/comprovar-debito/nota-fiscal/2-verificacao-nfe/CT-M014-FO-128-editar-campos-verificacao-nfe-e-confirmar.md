## ID do Cenário
[CT-M014-FO-128]

## Título
Editar campos extraídos da Nota Fiscal e confirmar as alterações com sucesso

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Nota Fiscal), seção `Verificar Informações da Nota Fiscal`.
- Regra Canônica: M014: `RN05` / `RI-NFE02` (Controle de edição e consolidação dos dados extraídos do `DocumentoFiscal`); `RN09` (rastreabilidade de operações relevantes).
- Contrato/API: `M014: AtualizarDadosNotaFiscal`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação de débito aberta na tela de comprovação (`/coordenador/prestacao-financeira/:paymentId`).
- Arquivo de Nota Fiscal (XML ou PDF) previamente anexado e com dados extraídos exibidos na seção `Verificar Informações da Nota Fiscal` (campos `Chave de Acesso`, `Data de Emissão`, `CNPJ Emitente`, `UF Emitente`, `Total ICMS`, `Total PIS`, `Total IPI`, `Total ISS` e tabela de itens visíveis).
- Status da comprovação: `Pendente` ou `Em Rascunho` (edição liberada — não está `Em Análise`).

## Passo a Passo
1. Acessar a tela de comprovação de débito com a Nota Fiscal já anexada (`/coordenador/prestacao-financeira/:paymentId`).
2. Localizar a seção `Verificar Informações da Nota Fiscal` com os campos desabilitados (read-only).
3. Clicar no botão `Editar` da seção.
4. Verificar que os campos da seção são habilitados para edição.
5. Alterar o campo `Data de Emissão` para uma data correta diferente da extraída (ex.: corrigir de `30/08/2026` para `29/08/2026`).
6. Alterar o campo `Total ICMS` para o valor correto (ex.: de `R$ 0,00` para `R$ 123,45`).
7. Clicar no botão `Confirmar` (ou `Salvar Edição`) para salvar as alterações.
8. Recarregar a página (`F5`) para validar a persistência das alterações.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/:paymentId` (débito com NF-e anexada)
- Campo editado 1: `Data de Emissão` — de `30/08/2026` para `29/08/2026`
- Campo editado 2: `Total ICMS` — de `R$ 0,00` para `R$ 123,45`
- Demais campos: mantidos conforme extração original

## Resultado Esperado
- Ao clicar em `Editar`, todos os campos da seção `Verificar Informações da Nota Fiscal` ficam habilitados para edição.
- As alterações nos campos `Data de Emissão` e `Total ICMS` são aceitas sem erros de validação.
- Ao clicar em `Confirmar`, o sistema salva as alterações e exibe feedback de sucesso (ex.: `"Informações da Nota Fiscal atualizadas com sucesso"`).
- Os campos retornam ao estado desabilitado (read-only) após a confirmação.
- Após recarregar a página (`F5`), os valores alterados persistem corretamente nos campos da seção.
- Os demais campos não alterados mantêm seus valores originais intactos.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa