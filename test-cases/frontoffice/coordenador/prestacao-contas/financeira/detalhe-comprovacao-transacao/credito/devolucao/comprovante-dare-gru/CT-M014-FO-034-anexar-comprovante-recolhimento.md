## ID do Cenário
[CT-M014-FO-034]

## Título
Anexar comprovante oficial de recolhimento (DARE/GRU/TED) e submeter

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Detalhe e Comprovação de Transação
- Regra Canônica: M014: `RN09` / `RN10` (Anexo de DARE/GRU e submissão)
- Contrato/API: `M014: AnexarComprovanteRecolhimento`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Motivo da devolução selecionado e justificativa preenchida.
- Arquivo do comprovante oficial de recolhimento bancário (DARE, GRU ou comprovante de TED) em formato PDF.

## Passo a Passo
1. Clicar na área de upload "Anexar Comprovante de Recolhimento Oficial".
2. Selecionar o arquivo PDF no sistema de arquivos.
3. Aguardar o término do upload e verificar o ícone de visualização.
4. Clicar em "Submeter Comprovação de Devolução".

## Dados de Entrada
- Arquivo Anexo: `comprovante_dare_diaria.pdf` (Tamanho: `1.2 MB`)
- Status da Transação: `RASCUNHO`

## Resultado Esperado
- O arquivo é enviado e vinculado com sucesso à devolução.
- A transação passa para o status `EM_ANALISE`.
- O formulário fica bloqueado para edição enquanto estiver sob análise da área técnica.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
