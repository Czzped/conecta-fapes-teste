## Título
[Bug] Erro HTTP 404 (Justificativa de passagem não encontrada) e toast ao alterar modalidade de documento de Invoice/Nota Fiscal para Passagem

## ID
BUG-M014-FO-PAS-013

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — **Seção 1 (Informações Gerais - Alteração de Tipo de Documento)**
- Regra Canônica: M014: `RN05` / Alternância entre tipos de documentos fiscais (`NotaFiscal`, `Invoice`, `Passagem`, etc.)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #1 (Visibilidade do Status do Sistema)**: O sistema permite trocar o dropdown de tipo de documento para *Passagem*, mas tenta realizar requisições de atualização (`PATCH`) usando o ID do documento da modalidade anterior em vez de criar uma nova justificativa do tipo Passagem.
  - **Heurística #9 (Ajudar usuários a reconhecer, diagnosticar e recuperar-se de erros)**: Exibição do toast vermelho de erro *"Não foi possível salvar a passagem. Tente novamente. Justificativa de passagem não encontrada."* impedindo a alteração da modalidade da prestação.
- Caso de Teste Relacionado: `CT-M014-FO-032` / `CT-M014-FO-081` (Troca de modalidade/tipo de documento em prestação de contas de débito em rascunho)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Seção `1. Informações Gerais *`)
- Endpoint afetado: `PATCH /api/prestacao-de-contas/projeto/:projectId/justificativa-passagem/:justificativaId/comprovante-pagamento` (ou endpoint equivalente de justificativa de passagem)

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato financeiro em `/coordenador/financeira` com o perfil de Coordenador.
2. Abrir uma prestação de débito em rascunho que tenha sido preenchida anteriormente sob outra modalidade (ex.: `Invoice (Pagamento Internacional)` ou `Nota Fiscal (NFe/NFSe)`), porém ainda **não enviada para análise**.
3. Na Seção `1. Informações Gerais *`, alterar o dropdown **Documento** de `Invoice` para `Passagem`.
4. Preencher a descrição da compra e anexar os comprovantes na Seção `2. Anexar Comprovantes da Passagem *`.
5. Preencher as informações dos passageiros na Seção `3. Informações da Passagem *`.
6. Clicar no botão azul `Confirmar edição` (ou salvar a prestação).
7. Observar a resposta HTTP no DevTools (`F12`) e o toast vermelho de erro disparado no canto inferior direito.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Modalidade Anterior: `Invoice (Pagamento Internacional)`
- Nova Modalidade Selecionada: `Passagem`
- Endpoint da requisição: `PATCH https://conectafapes.hom.es.gov.br/api/prestacao-de-contas/projeto/70f0b687.../justificativa-passagem/ce21bf90-9b91-407a-bc59-3e47e7a13122/comprovante-pagamento`
- Resposta HTTP do Backend (`404 Not Found`):
  ```json
  {
    "statusCode": 404,
    "message": "NOT_FOUND",
    "errors": [
      {
        "mensagem": "Justificativa de passagem não encontrada.",
        "code": null
      }
    ]
  }
  ```

## Comportamento Esperado
- Ao alterar o tipo de documento no dropdown da Seção 1 (ex.: de `Invoice` para `Passagem`), o frontend deve redefinir o estado da justificativa, desvinculando o ID da justificativa antiga e criando/postando uma nova entidade de `JustificativaPassagem`.
- As informações e comprovantes da passagem devem ser salvos com sucesso no backend (HTTP 200/201).

## Comportamento Atual
- O frontend mantém no estado o ID da justificativa anterior (ex.: ID da `JustificativaInvoice`) e tenta disparar requisições para os endpoints de passagem (`PATCH .../justificativa-passagem/:justificativaId/...`) utilizando esse ID incompatível.
- O backend busca por uma `JustificativaPassagem` com aquele ID, não encontra e retorna HTTP `404 Not Found` (*"Justificativa de passagem não encontrada."*).
- O frontend exibe o toast de erro: *"Não foi possível salvar a passagem. Tente novamente. Justificativa de passagem não encontrada."*, travando a transição de modalidade.

## Evidências
- 📷 **Prestação preenchida originalmente sob a modalidade Invoice:**
 
<img width="973" height="498" alt="Modalidade Invoice preenchida originalmente" src="https://github.com/user-attachments/assets/cd695e5b-f1fe-45a8-adfa-13fbc1ef494c" />

- 📷 **Alteração para modalidade Passagem gerando o toast de erro 404:**
 
<img width="986" height="498" alt="Toast de erro 404 Justificativa de passagem nao encontrada" src="https://github.com/user-attachments/assets/958be3ec-bfca-459a-8a4b-2ee178bc28f4" />

- 📷 **Console do navegador registrando a falha PATCH 404 (Not Found):**
 
<img width="967" height="152" alt="Console registrando erro PATCH 404" src="https://github.com/user-attachments/assets/b8c00222-386a-4632-9c16-2ec24765d70f" />

- 📷 **Aba Rede (Network) confirmando a resposta detalhada da API (404 Justificativa de passagem não encontrada):**
 
<img width="977" height="385" alt="Network payload 404 Not Found" src="https://github.com/user-attachments/assets/e09e1e27-5d3c-4d8b-bda2-ac8cff9398f8" />

## Sugestão de Investigação
- Inspecionar a troca de tipo de documento no composable/store da comprovação de débito:
  - Quando o usuário altera o valor do dropdown `Documento` na Seção 1, resetar a referência de `justificativaId` e expurgar do payload os IDs da modalidade anterior (`justificativaInvoiceId`, `notaFiscalId`).
  - Garantir que ao salvar uma prestação cuja modalidade foi alterada, a API crie a nova justificativa (`POST`) em vez de tentar atualizar (`PATCH`) uma justificativa inexistente do tipo selecionado.
