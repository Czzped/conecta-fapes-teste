## Título
[Bug] Ação de 'Cancelar' edição na Seção 2 não restaura arquivos de Comprovante de Realização da Viagem excluídos durante o modo de edição

## ID
BUG-M014-FO-PAS-011

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito de Passagem — **Seção 2 (Anexar Comprovantes da Passagem)**
- Regra Canônica: M014: `RN05` / `RI-PAS01` (Gerenciamento e integridade do estado local ao cancelar alterações na edição de comprovantes)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #3 (Controle e Liberdade do Usuário)**: Suporte claro para "Desfazer" / "Cancelar". O botão de "Cancelar" deve descartar todas as edições pendentes da sessão e restaurar a lista original de comprovantes exatamente no estado anterior à abertura do modo de edição.
  - **Heurística #5 (Prevenção de Erros)**: O usuário exclui um arquivo por engano durante a edição, clica em "Cancelar" esperando reverter o equívoco, mas a exclusão é mantida permanentemente no estado reativo local sem confirmação.
- Caso de Teste Relacionado: `CT-M014-FO-052` / `CT-M014-FO-078` (Cancelamento de edições na Seção 2 de comprovantes de passagem)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Seção `2. Anexar Comprovantes da Passagem *`)

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [x] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato financeiro em `/coordenador/financeira` com o perfil de Coordenador.
2. Abrir uma prestação de débito de **Passagem** que possua múltiplos arquivos anexados no campo **Comprovante de Realização da viagem** (ex.: 2 arquivos PDF anexados).
3. Na Seção `2. Anexar Comprovantes da Passagem *`, clicar no botão `Editar comprovantes`.
4. Clicar no ícone de exclusão (`X`) em um dos arquivos anexados (ex.: `Orç Parede Drywall Michele (Ifes Morada Laranjeiras).pdf`).
5. Verificar que o arquivo é removido imediatamente da lista visual.
6. Em vez de clicar em `Confirmar edição`, clicar no botão `Cancelar`.
7. Observar o estado final da lista de anexos no campo **Comprovante de Realização da viagem**.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Arquivos Anexados Inicialmente:
  1. `7c6f7352-1d91-47aa-9bf6-f2aa9a41255d-Orç Parede Drywall...pdf`
  2. `Orç Parede Drywall Michele (Ifes Morada Laranjeiras).pdf` (81 KB)
- Ação Realizada: Exclusão do arquivo 2 + Clique no botão `Cancelar`.

## Comportamento Esperado
- O botão `Cancelar` deve agir como um descarte completo de rascunho local (reset de formulário), restaurando a lista de arquivos para a cópia original mantida em memória antes de iniciar a edição.
- O arquivo excluído durante a sessão de edição deve ser reexibido na lista de comprovantes de realização da viagem.

## Comportamento Atual
- Ao clicar no ícone de exclusão (`X`), o frontend remove o arquivo diretamente da matriz/array reativa principal da lista de anexos (mutação direta de estado).
- Ao clicar em `Cancelar`, a interface apenas fecha o modo de edição, mas **não restaura** o arquivo removido. O arquivo excluído permanece omitido da lista visual.

## Evidências
- 📷 **Múltiplos comprovantes de realização da viagem anexados inicialmente:**
 
<img width="973" height="531" alt="Dois comprovantes anexados" src="https://github.com/user-attachments/assets/b835e3ca-aa76-466d-8ff7-66ddbc9ce28b" />

- 📷 **Acionando o botão de exclusão (X) no modo de edição:**
 
<img width="963" height="498" alt="Modo edição com ação de excluir" src="https://github.com/user-attachments/assets/574e92eb-916c-4861-9c16-d3a3f6568c07" />

- 📷 **Arquivo removido da lista antes de clicar em Cancelar:**
 
<img width="970" height="474" alt="Um arquivo removido da tela" src="https://github.com/user-attachments/assets/ddff14c5-09a8-4eb8-adbf-811c7595bf63" />

- 📷 **Após clicar em Cancelar, o arquivo excluído NÃO é restaurado:**
 
<img width="967" height="477" alt="Após cancelar o arquivo continua excluido" src="https://github.com/user-attachments/assets/e1ebac9a-d7ea-4395-9bf8-c70e285038ec" />

## Sugestão de Investigação
- Inspecionar a gestão de estado do formulário de comprovantes de passagem no frontend:
  - Verificar se ao acionar o botão `Editar comprovantes` é criada uma cópia defensiva do array de arquivos (ex.: `const tempComprovantes = JSON.parse(JSON.stringify(comprovantesOriginal))`).
  - Corrigir a ação da lixeira (`X`) para manipular apenas o estado temporário `tempComprovantes` e garantir que o clique no botão `Cancelar` descarte as alterações temporárias e restaure o estado original `comprovantesOriginal`.
