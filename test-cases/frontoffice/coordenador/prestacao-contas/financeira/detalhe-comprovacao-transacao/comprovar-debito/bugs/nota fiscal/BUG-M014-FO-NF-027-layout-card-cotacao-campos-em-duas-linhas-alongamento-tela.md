## Título
[Bug] Campos de Fornecedor, Valor e Data dispostos em múltiplas linhas no card expandido de Cotação gerando alongamento vertical excessivo da tela

## ID
BUG-M014-FO-NF-027

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — **Seção 4 (Cotação / Orçamento de Fornecedores)** em comprovação com Nota Fiscal
- Regra Canônica: M014 / M013: `RN05` (Obrigatória a apresentação de até 3 orçamentos/cotações para itens de valor superior a 300 VRTE / R$ 1.400,00) / Padrões de Design de Interface do Frontoffice
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #8 (Estética e Design Minimalista)**: Distribuição ineficiente do espaço horizontal útil da tela. A quebra do campo `Data *` para uma linha secundária isolada cria áreas vazias ociosas à direita e infla a altura vertical de cada card. Como o fluxo exige o envio de 3 cotações, o acúmulo de cards com múltiplas linhas de inputs alonga severamente a tela, aumentando a sobrecarga visual e a fadiga do usuário.
  - **Heurística #7 (Flexibilidade e Eficiência de Uso)**: O excesso de rolagem vertical gerado por cards volumosos fragmenta a visão integrada da prestação, afastando botões de ação e exigindo rolagem constante para inspecionar e confirmar os 3 orçamentos.
- Casos de Teste Relacionados:
  - `CT-M014-FO-045` (Anexar e preencher dados das 3 cotações de fornecedores)
  - `CT-M014-FO-046` (Validar seleção obrigatória da cotação de menor valor correspondente à compra efetuada)
  - `CT-M014-FO-105` (Submeter e confirmar envio das cotações de fornecedores preenchidas com sucesso)
  - *Nota: Não há atualmente no repositório um Caso de Teste específico para validação ergonômica de compactação visual dos cards de cotação em linha única; recomenda-se a criação do teste correspondente.*
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Cards da Seção `4. Cotação`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Desktop / Chrome v120+ / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [ ] 🟡 Média  [x] 🟢 Baixa

## Passo a Passo
1. Acessar o Frontoffice com perfil de Coordenador no ambiente de homologação.
2. Abrir a comprovação de uma transação de débito associada a uma Nota Fiscal contendo item superior a R$ 1.400,00 na rota `/coordenador/prestacao-financeira/detalhes/:paymentId`.
3. Rolar até a seção `4. Cotação`.
4. Realizar o upload de um arquivo de cotação (ex.: `NF Ar Condicionado.pdf`).
5. Clicar no chevron / observar o card expandido para preenchimento dos detalhes da cotação.
6. Constatar que os campos de formulário estão divididos em duas linhas distintas:
   - Linha 1: `Fornecedor *` e `Valor *`.
   - Linha 2: `Data *` (isolada à esquerda) e o botão `Confirmar`.
7. Observar que, ao expandir os 3 orçamentos necessários para atendimento da regra `RN05`, a seção ocupa uma extensão vertical excessiva, distanciando a visualização geral da página e os botões de ação (`Confirmar` e `Enviar cotações`).

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Seção: `4. Cotação`
- Anexo: `NF Ar Condicionado.pdf`
- Campos preenchidos no card:
  - `Fornecedor *`: `WEBCONTINENTAL LTDA`
  - `Valor *`: `R$ 2.403,99`
  - `Data *`: `dd/mm/aaaa`

## Comportamento Esperado
- Em resoluções Desktop e Tablet, os campos de detalhamento do orçamento (`Fornecedor *`, `Valor *` e `Data *`) devem ocupar **uma única linha horizontal** compartilhada (ex.: distribuição via grid ou flex com proporções adequadas, como ~50% Fornecedor, ~25% Valor e ~25% Data, ou layout com o botão `Confirmar` alinhado à direita na mesma faixa).
- A compactação deve reduzir substancialmente a altura vertical de cada card, mantendo os 3 orçamentos visíveis sem que a tela fique excessivamente longa e preservando o equilíbrio estético da interface (consultar/alinhar padrão de referência de design com a Letícia - UI/UX).

## Comportamento Atual
- O card expandido divide os campos em duas linhas:
  - A primeira linha aloca `Fornecedor *` e `Valor *`.
  - A segunda linha aloca apenas `Data *`, deixando uma grande área ociosa à direita.
- Com a adição das 3 cotações obrigatórias, a altura vertical acumulada dos cards triplica o espaço gasto, alongando demasiadamente a página de comprovação de débito.

## Evidências
- 📷 **Card de cotação expandido com campos divididos em duas linhas e espaço ocioso:**
  ![Card Cotação com Campos em Duas Linhas](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-027-01-card-cotacao-campos-duas-linhas.png)

## Sugestão de Investigação
- Ajustar o layout do componente de preenchimento de cotação (ex.: `CotacaoCard.vue` ou bloco da Seção 4 em `ComprovarDebito.vue`):
  - Modificar o container de inputs de `grid-cols-2` ou `flex-col` para um grid responsivo de 12 colunas ou flex-row inline em telas desktop (`md:grid-cols-12` ou `lg:flex`):
    - `Fornecedor`: `md:col-span-6`
    - `Valor`: `md:col-span-3`
    - `Data`: `md:col-span-3`
  - Posicionar o botão `Confirmar` de forma fluida (ou na mesma linha alinhado à direita, ou com margem compacta inferior).
  - Validar o espaçamento e obter o exemplo/protótipo de layout refinado diretamente com a Letícia (UI/UX).
