# Título
[Bug] Campos de informações da Nota Fiscal permanecem editáveis após recarregar a página sem acionar o botão "Editar"

## ID
BUG-M014-FO-NF-004

## Requisito/Regra Violada
- Regra Canônica: M014: `RN05` — Bloqueio e controle de edição de dados de `DocumentoFiscal` após extração/confirmação
- Rota/Componente: `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` — Seção `Verificar Informações da Nota Fiscal`

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [x] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo

1. Acessar `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` com transação de débito sem NF-e.
2. Na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, anexar um arquivo XML ou PDF de NF-e válido.
3. Aguardar a leitura e extração automática das informações da NF-e.
4. Clicar no botão `Confirmar` dentro da seção de verificação da Nota Fiscal ou no botão de envio da seção.
5. Recarregar a página (`F5`).
6. Observar a seção `Verificar Informações da Nota Fiscal` e tentar interagir com os campos de entrada (ex: `Total PIS`, `Chave de Acesso`, etc.) antes de clicar em `Editar`.

## Dados de Entrada
- URL: `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId`
- Estado da tela: Página recarregada (`F5`) com NF-e já anexada/enviada previamente
- Ação: Clicar nos campos da seção `Verificar Informações da Nota Fiscal` sem ter acionado o botão `Editar`

## Comportamento Esperado
- Ao carregar/recarregar a página com uma NF-e já cadastrada, todos os campos da seção `Verificar Informações da Nota Fiscal` devem estar em estado **desabilitado/read-only** (somente leitura).
- A edição dos campos só deve ser permitida após o usuário clicar explicitamente no botão `Editar`.

## Comportamento Atual
- Após recarregar a página, os campos da seção `Verificar Informações da Nota Fiscal` continuam **habilitados e focáveis para edição direta**, mesmo com o botão `Editar` ainda visível e sem ter sido acionado.
- É possível clicar e alterar valores diretamente (como o campo `Total PIS`), burlando o fluxo pretendido de habilitação de edição via botão `Editar`.

## Evidências
- 📷 **Campos de formulário focados e editáveis diretamente sem clicar em "Editar":**

  `evidencias-BUG-NF-004-campos-nfe-editaveis-sem-clicar-em-editar.png`

## Sugestão de Investigação (Opcional)
- Verificar a inicialização da propriedade `disabled` / `readonly` dos inputs na montagem do componente (ex: `onMounted` / estado inicial das refs de formulário ao carregar dados salvos da prestação).