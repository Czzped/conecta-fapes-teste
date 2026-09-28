## Título
[Bug] Erro HTTP 400 (Bad Request) e toast "O saldo da prestação precisa estar zerado" ao tentar submeter prestação após alteração de modalidade de documento

## ID
BUG-M014-FO-PREST-005

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — **Submissão de Prestação de Contas (Modal Enviar Prestação)**
- Regra Canônica: M014: `RN05` / Fluxo de validação de saldo e integridade ao submeter prestação para análise da FAPES
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #1 (Visibilidade do Status do Sistema)**: O modal de submissão valida os checklists com marcações verdes (*"Dados do invoice preenchidos e confirmados"*, *"Ao menos uma transação vinculada"*, *"Cotações obrigatórias enviadas"*), mas ao clicar em `Confirmar`, a requisição falha com erro 400.
  - **Heurística #9 (Ajudar usuários a reconhecer, diagnosticar e recuperar-se de erros)**: Disparo do toast de erro *"Erro ao submeter a prestação - O saldo da prestação precisa estar zerado para submissão. Saldo atual: R$ (15,751.85.)"* devido ao backend continuar considerando o saldo/itens da modalidade anterior não atualizada.
- Caso de Teste Relacionado: `CT-M014-FO-032` / `CT-M014-FO-090` (Submissão para análise após alteração de tipo de documento fiscal)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Modal `EnviarPrestacaoModal.vue`)
- Endpoint afetado: `POST /api/prestacao-de-contas/projeto/:projectId/prestacao/:prestacaoId/submeter`

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato financeiro em `/coordenador/financeira` com o perfil de Coordenador.
2. Abrir uma prestação de débito em rascunho que tenha sido preenchida anteriormente em outra modalidade (ex.: `Invoice` ou `Nota Fiscal`).
3. Na Seção `1. Informações Gerais *`, alterar o dropdown **Documento** para `Passagem` (ou outra modalidade desejada).
4. Preencher os comprovantes e dados requeridos pela nova modalidade (`Passagem`).
5. Salvar rascunho (que exibe confirmação verde, porém não persiste).
6. Rolar até a Seção final e clicar no botão `Enviar prestação para análise` (ou `Enviar cotações`).
7. No modal de confirmação (*"Enviar Prestação - Deseja submeter esta prestação de contas?"*), marcar o termo de declaração e clicar em `Confirmar`.
8. Observar o erro HTTP 400 retornado pela API e o toast disparado no canto inferior direito.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Modalidade Selecionada na Tela: `Passagem`
- Endpoint da requisição: `POST https://conectafapes.hom.es.gov.br/api/prestacao-de-contas/projeto/70f0b687.../prestacao/e3eb315a-09f6-47d7-b507.../submeter`
- Resposta HTTP do Backend (`400 Bad Request`):
  ```json
  {
    "statusCode": 400,
    "message": "BAD_REQUEST",
    "errors": [
      {
        "mensagem": "A prestação não pode ser submetida devido aos seguintes erros de validação: O saldo da prestação precisa estar zerado para submissão.",
        "code": null
      }
    ]
  }
  ```

## Comportamento Esperado
- Ao alterar a modalidade da prestação de contas, preencher os comprovantes/passageiros necessários e clicar em `Confirmar` no modal de submissão, a prestação deve ser submetida com sucesso para a análise da FAPES (HTTP 200/204).

## Comportamento Atual
- Como a troca de modalidade não foi persistida no backend (ver `BUG-M014-FO-PREST-004`), o servidor tenta validar a submissão utilizando as regras e associações de itens da modalidade anterior.
- Como os itens da modalidade anterior não bateram com a nova modalidade selecionada, o backend identifica uma divergência de saldo não zerado e rejeita a submissão com HTTP `400 Bad Request`.
- O frontend dispara o toast de erro: *"Erro ao submeter a prestação - O saldo da prestação precisa estar zerado para submissão. Saldo atual: R$ (15,751.85.)"*.

## Evidências
- 📷 **Alteração para modalidade Passagem com comprovantes e dados preenchidos:**
 
<img width="973" height="498" alt="Formulário preenchido em Passagem" src="https://github.com/user-attachments/assets/19cf05d1-5cf5-4cf5-b168-52565dd4b1cd" />

- 📷 **Salvamento de rascunho com confirmação verde:**
 
<img width="986" height="498" alt="Salvamento de rascunho com toast verde" src="https://github.com/user-attachments/assets/574ebad2-cfb3-4638-aa21-eb337e7592cf" />

- 📷 **Modal de submissão exibindo checklists verdes e toast de erro de saldo não zerado:**
 
<img width="975" height="500" alt="Modal de submissao com erro de saldo nao zerado" src="https://github.com/user-attachments/assets/81c8cfeb-ebdd-41e9-9fd0-8d591ff18d6f" />

- 📷 **Console do navegador registrando POST /submeter 400 (Bad Request):**
 
<img width="967" height="152" alt="Console registrando erro POST 400" src="https://github.com/user-attachments/assets/ed6bcfeb-6a42-45e5-aa04-d5cf8eb8ef5d" />

- 📷 **Aba Rede (Network) exibindo o payload de resposta HTTP 400 com erro de validação:**
 
<img width="977" height="385" alt="Network payload 400 Bad Request" src="https://github.com/user-attachments/assets/05a065db-2b58-4bc8-8db9-46702e0df51c" />

## Sugestão de Investigação
- Este bug é um desdobramento direto do `BUG-M014-FO-PREST-004` (falha na persistência ao salvar a troca de modalidade):
  - Ao corrigir a persistência do tipo de documento e o recálculo/associação dos itens do documento ativo no backend, a validação de submissão do endpoint `POST /submeter` reconhecerá corretamente o saldo comprovado da nova modalidade e aprovará o envio.
