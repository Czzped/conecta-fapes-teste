## Título
[Bug] Erro HTTP 422 (Unprocessable Entity) e toast ao tentar trocar/substituir Nota Fiscal em despesa com múltiplas notas anexadas

## ID
BUG-M014-FO-NF-017

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — **Seção 2 (Adicionar Descrição e Anexar Nota Fiscal)**
- Regra Canônica: M014: `RN05` / `RI-NFE01` (Gerenciamento, substituição e integridade de documentos fiscais vinculados a uma comprovação de despesa)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #1 (Visibilidade do Status do Sistema)**: Ao acionar a opção "Trocar nota fiscal" em um card específico de Nota Fiscal, o sistema oculta a informação de qual nota fiscal está sendo substituída ao enviar a requisição ao backend.
  - **Heurística #9 (Ajudar usuários a reconhecer, diagnosticar e recuperar-se de erros)**: Disparo do toast de erro técnico *"Erro ao trocar a nota fiscal - Request failed with status code 422"* sem indicar ao usuário a razão real (ausência do identificador da nota a ser substituída no payload da requisição).
- Caso de Teste Relacionado: `CT-M014-FO-039` / `CT-M014-FO-108` (Substituição/Troca de Nota Fiscal vinculada a débito com múltiplas notas)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Seção `2. Adicionar Descrição e Anexar Nota Fiscal *`)
- Endpoint afetado: `POST /api/prestacao-de-contas/projeto/:projectId/justificativa-nf/:justificativaId/documento-fiscal/substituir`

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato financeiro em `/coordenador/financeira` com o perfil de Coordenador.
2. Abrir uma prestação de débito em rascunho que possua **duas ou mais Notas Fiscais anexadas** na mesma despesa (ex.: "2 nota(s) fiscal(is) nesta despesa": Fast Shop S.A. e Amazon Serviços de Varejo).
3. Na Seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, localizar um dos cards de Nota Fiscal (ex.: Nota 1 de 2 - Fast Shop S.A.).
4. Clicar no ícone de atualização/substituição (`Trocar nota fiscal`) no canto superior direito do card.
5. Na área de upload expandida (*"Selecione o arquivo ou arraste e solte aqui (PDF ou XML)"*), fazer o upload da nova nota fiscal desejada.
6. Na seção *"Verificar informações da Nota Fiscal"*, confirmar os dados e clicar no botão `Enviar Nota Fiscal`.
7. Observar a resposta HTTP no DevTools (`F12`) e o toast de erro exibido no canto inferior direito.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Estado da Despesa: `2 nota(s) fiscal(is) nesta despesa`
- Card Acionado: Nota 1 de 2 (`FAST SHOP S.A.`, Chave: `35240953...39104406`, Valor: `R$ 21.619,50`)
- Endpoint da requisição: `POST https://conectafapes.hom.es.gov.br/api/prestacao-de-contas/projeto/70f0b687.../justificativa-nf/0205db4c-a18e-4d90-b34e-d9f88273c9c1/documento-fiscal/substituir`
- Resposta HTTP do Backend (`422 Unprocessable Entity`):
  ```json
  {
    "statusCode": 422,
    "message": "UNPROCESSABLE_ENTITY",
    "errors": [
      {
        "mensagem": "Esta despesa possui mais de uma nota fiscal: informe qual delas deve ser substituída",
        "code": null
      }
    ]
  }
  ```

## Comportamento Esperado
- Ao clicar no botão de "Trocar nota fiscal" presente no card de uma Nota Fiscal específica (ex.: Nota 1 de 2 - Fast Shop S.A.), o frontend deve capturar o ID correspondente daquela nota fiscal e enviá-lo no payload da requisição ao endpoint `/substituir` (ex.: `documentoFiscalIdToBeReplaced`).
- A substituição deve ser efetuada com sucesso (HTTP 200/201), substituindo especificamente a Nota Fiscal selecionada pelo usuário sem afetar as demais notas anexadas à despesa.

## Comportamento Atual
- Ao submeter a substituição da nota fiscal, o frontend realiza a chamada `POST .../documento-fiscal/substituir` sem passar o identificador da nota fiscal que foi acionada para troca.
- Como a despesa contém 2 notas fiscais anexadas, o backend falha na validação de regra de negócio e retorna HTTP `422 Unprocessable Entity` com o erro: *"Esta despesa possui mais de uma nota fiscal: informe qual delas deve ser substituída"*.
- O frontend dispara o toast de erro: *"Erro ao trocar a nota fiscal - Request failed with status code 422"*.
- O console exibe o erro `POST .../documento-fiscal/substituir 422 (Unprocessable Entity)` e a substituição da nota não é concluída.

## Evidências
- 📷 **Ação de acionar a troca no card da Nota Fiscal (Fast Shop S.A. - Nota 1 de 2):**
 
<img width="958" height="182" alt="Botão de trocar nota fiscal" src="https://github.com/user-attachments/assets/9d5452eb-680c-4dd0-93bc-f3faed3d89ec" />

- 📷 **Área de upload para substituição da Nota Fiscal:**
 
<img width="973" height="389" alt="Área de upload para substituição da nota fiscal" src="https://github.com/user-attachments/assets/aeaa7fa5-d91d-44a6-baae-51b660a9f029" />

- 📷 **Toast de erro disparado ("Erro ao trocar a nota fiscal - Request failed with status code 422"):**
 
<img width="986" height="498" alt="Toast de erro HTTP 422 ao trocar nota fiscal" src="https://github.com/user-attachments/assets/74bb65a6-ff8e-4a6c-8515-d41a87db72fa" />

- 📷 **Console do navegador registrando a falha POST /substituir 422 (Unprocessable Entity):**
 
<img width="967" height="152" alt="Console com erro POST 422 Unprocessable Entity" src="https://github.com/user-attachments/assets/5c338df3-bf1d-45d6-b184-7a31b40dc8aa" />

- 📷 **Aba Rede (Network) exibindo a resposta detalhada da API ("Esta despesa possui mais de uma nota fiscal: informe qual delas deve ser substituída"):**
 
<img width="977" height="385" alt="Resposta HTTP 422 detalhada da API" src="https://github.com/user-attachments/assets/6df77d85-f55a-4cb7-a72e-0eebebfcf48c" />

## Sugestão de Investigação
- Inspecionar a função de envio/submissão de substituição no componente do Frontoffice (`ComprovarDebito.vue` ou composable de manipulação de Notas Fiscais):
  - Ao clicar no botão de troca no card de uma `NotaFiscal`, certificar que o `id` da `NotaFiscal` selecionada seja mantido no estado do componente.
  - Ajustar o payload do `POST .../documento-fiscal/substituir` para incluir o parâmetro exigido pelo backend (ex.: `documentoFiscalId`, `substituirDocumentoFiscalId` ou parâmetro id na rota/body) indicando qual nota específica deve ser substituída quando houver mais de uma nota vinculada à despesa.
