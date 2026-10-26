## Título
[Bug] Fragmentação e duplicidade de botões de edição na Seção 3 ('Editar passageiros' e 'Editar Informações Gerais') com nomenclatura conflitante com a Seção 1

## ID
BUG-M014-FO-PAS-015

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito de Passagem — **Seção 3 (Informações da Passagem \*)**
- Regras Canônicas / Padrões de Interface:
  - M014: `RN12` (Comprovação de passagem: informações de passageiros e itinerário da viagem)
  - Padrão de UX e Design System do Frontoffice Conecta FAPES (Diretrizes de Edição Modular)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #4 (Consistência e Padrões)**: Conflito semântico e duplicidade de termos. A página já possui a **Seção 1 (Informações Gerais \*)**; a presença de um botão denominado *"Editar Informações Gerais"* dentro da **Seção 3 (Informações da Passagem \*)** cria forte ambiguidade cognitiva sobre qual parte da página está sendo controlada.
  - **Heurística #8 (Design Estético e Minimalista)**: Fragmentação desnecessária de controles. A convivência de dois botões de edição independentes no mesmo container (`Editar passageiros` e `Editar Informações Gerais`) quebra a coesão visual e sobrecarrega a experiência de uso.
- Casos de Teste Relacionados:
  - `CT-M014-FO-136` (Validar unificação e consistência dos controles de edição na Seção 3)
  - `CT-M014-FO-053` (Cadastrar passageiro e localizador)
  - `CT-M014-FO-055` (Preencher itinerário de passagem: origem, destino e datas)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Seção `3. Informações da Passagem *`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Desktop / Google Chrome / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [x] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o sistema com perfil de `coordenador` no ambiente de Homologação.
2. Navegar até `Prestação de Contas > Financeiro` e abrir uma transação de débito com modalidade `Passagem`.
3. Preencher e salvar em rascunho os dados de passageiros e os dados do itinerário.
4. Rolar a página até a **Seção 3 (Informações da Passagem \*)**.
5. Observar a presença simultânea de dois botões de edição dentro do mesmo bloco:
   - Botão `Editar passageiros` abaixo do card de passageiros.
   - Botão `Editar Informações Gerais` abaixo dos campos de itinerário (Origem, Destino, Saída, Chegada).

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Seção inspecionada: `3. Informações da Passagem *`
- Botões observados: `[lápis] Editar passageiros` e `[lápis] Editar Informações Gerais`

## Comportamento Esperado
- A Seção 3 deve ter seu padrão de interação e layout aprimorado em alinhamento com a equipe de Design/UX (solicitar referência/exemplo com a Letícia):
  1. **Eliminar a duplicidade de ações desconexas:** Não manter dois botões de edição concorrentes dividindo o mesmo card sem delimitação clara de escopo.
  2. **Corrigir a nomenclatura ambígua:** Renomear ou reestruturar o botão *"Editar Informações Gerais"*, uma vez que os campos sob ele tratam especificamente do **Itinerário** (Origem, Destino, Datas e Horários), e o rótulo "Informações Gerais" já pertence oficialmente à Seção 1 da tela.
  3. **Unificação ou estruturação em subcards:** Avaliar a unificação em um botão único de edição para o card da Seção 3 ou subdividir formalmente o bloco em dois subcomponentes com cabeçalhos semânticos próprios (`Passageiros` e `Itinerário`).

## Comportamento Atual
- A Seção 3 abriga dois botões de edição separados (`Editar passageiros` e `Editar Informações Gerais`) dentro da mesma área visual.
- O nome "Editar Informações Gerais" gera conflito direto com o título da Seção 1 ("1. Informações Gerais \*"), gerando confusão sobre a ação disparada.

## Evidências
- 📷 **Seção 3 exibindo simultaneamente dois botões de edição ('Editar passageiros' e 'Editar Informações Gerais'):**
  ![Dois botões de edição na Seção 3 de Passagem](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-015-01-dois-botoes-edicao-secao-3.png)

## Sugestão de Investigação
- Alinhar com a designer Letícia (referência do design no Figma) qual o padrão oficial aprovado para os botões de edição da Seção 3 de Passagem.
- No frontend Vue/Nuxt (`ComprovarDebito.vue` ou componente de Passagem):
  - Renomear a ação de edição do itinerário para evitar o termo "Informações Gerais".
  - Padronizar o estado de edição da seção para que as ações sejam coesas e não fragmentadas.
