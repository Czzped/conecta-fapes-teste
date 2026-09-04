# Título
[Bug] Ação de cancelar edição não restaura os valores originais dos formulários (Seção 2 - NF-e e Seção 4 - Cotação)

## ID
BUG-M014-FO-NF-007

## Requisito/Regra Violada
- Regra Canônica: M014: `RN05` / `RN07` — Comportamento padrão de cancelamento de edição (rollback do estado temporário do formulário)
- Rota/Componente: `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` — Seção 2 (`Verificar Informações da Nota Fiscal`) e Seção 4 (`Cotação`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [x] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo

### Cenário 1 — Cancelar Edição na Seção 2 (Informações da Nota Fiscal)
1. Acessar `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` com Nota Fiscal anexada e confirmada.
2. Observar os valores originais exibidos nos campos da seção `Verificar Informações da Nota Fiscal` (ex: `Total PIS` = `R$ 0,00`).
3. Clicar no botão `Editar` no rodapé da seção 2.
4. Alterar o valor de um ou mais campos (ex: modificar o campo `Total PIS` para `R$ 1.000,00`).
5. Clicar no botão `Cancelar` no rodapé da seção para desistir das alterações.
6. Observar os valores exibidos nos campos da seção `Verificar Informações da Nota Fiscal`.

### Cenário 2 — Cancelar Edição na Seção 4 (Cards de Orçamento de Cotação)
1. Na mesma página, rolar até a seção `4. Cotação`.
2. Localizar um card de orçamento já anexado e salvo (ex: `Orç Parede Drywall Michele.pdf`).
3. Observar os dados originais do orçamento (ex: Fornecedor = `CENTRAL FORROS E DIVISÓRIAS Ltda`).
4. Clicar no botão `Editar` no card do orçamento.
5. Alterar o campo `Fornecedor` para um novo valor (ex: `teste`).
6. Clicar no botão `Cancelar` no canto inferior do card.
7. Observar o valor exibido no campo `Fornecedor`.

## Dados de Entrada
- URL: `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId`
- **Seção 2:** `Total PIS` original = `R$ 0,00` | alterado = `R$ 1.000,00`
- **Seção 4:** `Fornecedor` original = `CENTRAL FORROS E DIVISÓRIAS Ltda` | alterado = `teste`
- Ação em ambas as seções: Clicar em `Cancelar`

## Comportamento Esperado
- Ao clicar no botão `Cancelar` (seja na Seção 2 ou nos cards de cotação da Seção 4), o sistema deve descartar todas as modificações temporárias e **restaurar os valores originais** salvos antes da edição.
- Na Seção 2, o campo `Total PIS` deve retornar para `R$ 0,00`.
- Na Seção 4, o campo `Fornecedor` deve retornar para `CENTRAL FORROS E DIVISÓRIAS Ltda`.

## Comportamento Atual
- Em **ambas as seções**, o botão `Cancelar` encerra o modo de edição, mas **não restaura os dados originais**:
  - **Seção 2:** O campo `Total PIS` permanece exibindo `R$ 1.000,00`.
  - **Seção 4:** O campo `Fornecedor` permanece exibindo `teste`.
- O formulário mantém visíveis os dados alterados que foram cancelados, sujando a interface e enganando o usuário sobre o estado real das informações.

## Evidências

### Evidências — Seção 2 (Informações da NF-e)
- 📷 **Valores originais da NF-e (Total PIS: R$ 0,00):** `evidencias-BUG-NF-007-valores-originais-nfe.png`
- 📷 **Edição do Total PIS para R$ 1.000,00 e clique em Cancelar:** `evidencias-BUG-NF-007-alteracao-campo-pis-e-clique-cancelar.png`
- 📷 **Valor alterado mantido após cancelar:** `evidencias-BUG-NF-007-valor-alterado-mantido-apos-cancelar.png`

### Evidências — Seção 4 (Orçamentos de Cotação)
- 📷 **Dados originais do orçamento (Fornecedor: CENTRAL FORROS E DIVISÓRIAS Ltda):** `evidencias-BUG-NF-008-orcamento-dados-originais.png`
- 📷 **Edição do Fornecedor para "teste" e clique em Cancelar:** `evidencias-BUG-NF-008-edicao-fornecedor-e-clique-cancelar.png`
- 📷 **Fornecedor "teste" mantido após cancelar:** `evidencias-BUG-NF-008-fornecedor-alterado-mantido-apos-cancelar.png`

## Sugestão de Investigação (Opcional)
- O comportamento reflete um padrão arquitetural nos componentes de formulário da prestação de contas: a ação de cancelar fecha o estado de edição sem redefinir o objeto de modelo/estado reativo para o snapshot original. Implementar rollback de estado (`formState = clone(originalState)`) nos handlers de cancelamento das seções 2 e 4.