# Diarias — M004 Pagamento de Bolsistas

[M004](../README.md)

Subcontexto responsavel pelo processamento do pagamento de diarias aprovadas no M003. Quando uma `SolicitacaoDiaria` esta `DISPONIVEL_PRESTACAO`, o coordenador retira o valor da conta do projeto e envia para a conta Banestes do bolsista. Esse fluxo de pagamento passa pelo M004.

## Referencias Externas

| Referencia | Modulo | Uso |
|------------|--------|-----|
| SolicitacaoDiaria | M003 | Origem operacional do pagamento de diaria |
| AlocacaoBolsista | M009 | Identifica o bolsista e sua conta bancaria |
