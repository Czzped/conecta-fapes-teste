## ID do Cenário
[CT-M014-FO-086]

## Título
Validar rejeição do comprovante da fatura do cartão com formato inválido ou tamanho excedente

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Invoice)
- Regra Canônica: M014: `RN05` / `RI-INV03` (Restrições de formato e tamanho para anexo da fatura do cartão de crédito)
- Contrato/API: `M014: AnexarFaturaCartao`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Tipo de documento selecionado como `Invoice (Pagamento Internacional)`.
- Toggle *"Deseja enviar o comprovante da fatura do cartão?"* ativado.

## Passo a Passo
1. Na sub-seção `Comprovante da fatura do cartão`, clicar no botão `Anexar fatura do cartão`.
2. **Cenário A (Formato Inválido):** Tentar selecionar e enviar um arquivo com extensão não suportada (ex: `fatura_cartao.exe` ou `fatura_cartao.docx`).
3. **Cenário B (Tamanho Excedente):** Tentar selecionar e enviar um arquivo PDF/imagem com tamanho superior a 10MB (ex: `fatura_cartao_pesada.pdf` - 14MB).

## Dados de Entrada
- Cenário A: Arquivo `fatura_cartao.exe` (formato não permitido)
- Cenário B: Arquivo `fatura_cartao_pesada.pdf` (tamanho: `14 MB`, limite: `10 MB`)

## Resultado Esperado
- **Cenário A:** O upload é rejeitado com a mensagem: *"Formato de arquivo não suportado. Envie apenas arquivos PDF ou imagem."*.
- **Cenário B:** O upload é interrompido com a mensagem: *"O arquivo excede o tamanho máximo permitido de 10MB."*.
- Em ambos os cenários, a fatura inválida não é anexada ao formulário.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [x] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
