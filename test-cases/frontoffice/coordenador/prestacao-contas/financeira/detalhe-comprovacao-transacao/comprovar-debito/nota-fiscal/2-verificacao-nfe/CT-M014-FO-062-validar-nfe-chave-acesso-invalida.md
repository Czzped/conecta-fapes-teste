## ID do Cenário
[CT-M014-FO-062]

## Título
Validar rejeição de NF-e com chave de acesso inválida

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Nota Fiscal)
- Regra Canônica: M014: `RN05` / `RI-NFE03` (Validação da chave de acesso da NF-e — 44 dígitos com dígito verificador válido)
- Contrato/API: `M014: ValidarChaveAcessoNFe`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Arquivo XML/PDF de NF-e com chave de acesso incorreta (menos de 44 dígitos, dígito verificador inválido ou ausente) disponível.

## Passo a Passo
1. Na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, anexar um arquivo XML com chave de acesso malformada.
2. Aguardar a leitura automática dos dados.
3. Expandir o card `Verificar Informações da Nota Fiscal` para inspecionar a chave extraída.

## Dados de Entrada
- Chave de Acesso (inválida): `1234567890123456789012345678901234567890123` (43 dígitos)

## Resultado Esperado
- O sistema identifica que a chave não possui 44 dígitos ou possui dígito verificador incorreto.
- É exibida uma mensagem de alerta no painel de verificação: *"Chave de acesso inválida. Verifique o documento e tente novamente."*.
- O botão `Confirmar` da NF-e permanece desabilitado.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
