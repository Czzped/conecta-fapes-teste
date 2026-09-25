## Título
[Bug] Ausência de botão de edição na Seção 1 (Informações Gerais), forçando dependência indevida da edição da Seção 3 para desbloquear o campo Descrição

## ID
BUG-M014-FO-PAS-012

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito de Passagem — **Seção 1 (Informações Gerais)**
- Regra Canônica: M014: `RN05` / Usabilidade de Edição Modular em Passagem
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #4 (Consistência e Padronização)**: Falta de consistência e padrão visual nos controles de edição. Enquanto as demais seções (Seção 2 e Seção 3) possuem seus próprios botões explícitos (`Editar comprovantes` e `Editar passageiros`), a Seção 1 não possui nenhum botão "Editar" ou controle de liberação do campo Descrição.
  - **Heurística #8 (Design Estético e Minimalista)**: Acoplamento confuso de estado entre seções distintas. O acionamento de `Editar passageiros` na Seção 3 desbloqueia colateralmente o campo `Descrição` na Seção 1, criando uma dependência ilógica e contra-intuitiva entre componentes.
- Caso de Teste Relacionado: `CT-M014-FO-045` / `CT-M014-FO-079` (Edição dos dados da Seção 1 em prestação de contas de passagem)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Seção `1. Informações Gerais *`)

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [x] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato financeiro em `/coordenador/financeira` com o perfil de Coordenador.
2. Abrir uma prestação de débito de **Passagem** preexistente em rascunho com o campo **Descrição** da Seção 1 já preenchido.
3. Tentar clicar diretamente no campo `Descrição` da Seção 1 para alterar o texto.
4. Observar que o campo `Descrição` está bloqueado/desabilitado para edição e não há botão `Editar` na Seção 1.
5. Rolar a página até a **Seção 3 (Informações da Passagem)** e clicar no botão `Editar passageiros`.
6. Rolar de volta para a **Seção 1 (Informações Gerais)** e verificar o estado do campo `Descrição`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Seção 1: Campo `Descrição` contendo texto preexistente (ex.: `"teste"`).

## Comportamento Esperado
- Cada seção da prestação de contas deve ser auto-contida e possuir seu próprio botão de edição independente (ex.: botão `Editar` ou ícone de lápis na Seção 1), ou o campo `Descrição` da Seção 1 deve permanecer editável livremente enquanto a prestação estiver em rascunho.
- O acionamento da edição na Seção 3 (Informações da Passagem) não deve ter efeito colateral de controlar a habilitação dos campos da Seção 1.

## Comportamento Atual
- A Seção 1 não exibe nenhum botão `Editar`, mantendo o campo `Descrição` bloqueado/desabilitado para o usuário.
- Para conseguir alterar a descrição da compra na Seção 1, o usuário é obrigado a navegar até a Seção 3 e clicar no botão `Editar passageiros`. Somente após essa ação na Seção 3 é que o campo `Descrição` da Seção 1 é desbloqueado para digitação (acoplamento de estado ilógico).

## Evidências
- 📷 **Seção 1 (Informações Gerais) com o campo Descrição bloqueado e sem botão Editar:**
 
<img width="973" height="213" alt="Seção 1 com campo descrição bloqueado" src="https://github.com/user-attachments/assets/bcf13ffc-b01a-4d22-9bc5-cbfbbef44f1c" />

- 📷 **Seção 3 (Informações da Passagem) exibindo o botão Editar passageiros:**
 
<img width="975" height="300" alt="Botão editar passageiros na Seção 3" src="https://github.com/user-attachments/assets/515be434-62fe-43fb-98e3-059e0a29486c" />

- 📷 **Seção 1 desbloqueada para digitação apenas após clicar no botão da Seção 3:**
 
<img width="972" height="221" alt="Seção 1 desbloqueada apos editar Seção 3" src="https://github.com/user-attachments/assets/94178385-d853-4dc7-aed1-4d37eb64d2ee" />

## Sugestão de Investigação
- Inspecionar a diretiva `disabled` / `readonly` no componente da Seção 1 (`InformacoesGerais` em despesas de passagem):
  - Verificar por que a propriedade de estado de edição do formulário (ex.: `isEditingPassageiros` ou `isEditingSection3`) está sendo reusada como condição para desabilitar/habilitar a `textarea` de descrição da Seção 1.
  - Adicionar um botão de edição dedicado para a Seção 1 ou desvincular a propriedade de estado da Seção 3 para que o campo de descrição permaneça editável autonomamente.
