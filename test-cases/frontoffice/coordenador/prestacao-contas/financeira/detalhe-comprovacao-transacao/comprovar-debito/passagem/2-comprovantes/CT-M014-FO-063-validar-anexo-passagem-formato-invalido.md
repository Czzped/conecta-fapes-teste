## ID do Cenário
[CT-M014-FO-063]

## Título
Validar rejeição de comprovante de passagem com formato de arquivo inválido

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Passagem)
- Regra Canônica: M014: `RN05` / `RI-PAS01` (Restrição de extensões permitidas para comprovantes de passagem)
- Contrato/API: `M014: UploadComprovantePagamento` / `M014: UploadComprovanteViagem`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Tipo de documento selecionado como `Passagem`.
- Arquivo com extensão não suportada (ex: `.exe`, `.jpg`, `.zip`) disponível.

## Passo a Passo
1. Na seção `2. Anexar Comprovantes da Passagem *`, clicar em `Anexar comprovante de pagamento` ou `Anexar comprovante/registro da viagem`.
2. Selecionar e tentar enviar um arquivo com extensão inválida (ex: `bilhete.jpg`).

## Dados de Entrada
- Arquivo: `bilhete.jpg` (extensão não suportada)

## Resultado Esperado
- O upload é bloqueado pelo sistema.
- O arquivo não é exibido na coluna correspondente.
- O sistema exibe mensagem de erro: *"Formato de arquivo não suportado. Envie apenas arquivos no formato PDF."*.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
