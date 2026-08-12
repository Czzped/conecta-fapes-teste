---
title: ConectaFapes
---

# ConectaFapes

O ConectaFapes é o sistema da FAPES para gerenciar bolsas de pesquisa — do momento em que uma bolsa é solicitada até o pagamento mensal do bolsista, incluindo a documentação, os editais, as modalidades, o voluntariado e a captação de parcerias.

Dois perfis usam o sistema:

- **Bolsista / Coordenador** — solicita, acompanha e presta contas de suas bolsas.
- **Equipe FAPES** — avalia, aprova, paga e administra editais, modalidades e parcerias.

## O que o sistema permite fazer

### Ciclo de vida de uma bolsa
1. [[solicitacao-de-bolsa]] — o coordenador cadastra um bolsista em um projeto
2. [[gestao-de-documentos]] — o bolsista envia os comprovantes exigidos
3. [[termo-de-responsabilidade]] — o bolsista assina o termo de responsabilidade
4. [[implementacao-de-bolsa]] — a equipe FAPES avalia e aprova a bolsa
5. [[pagamentos]] — geração e acompanhamento da folha de pagamento
6. [[remanejamento-de-cotas]] — redistribuição de orçamento e cotas durante a vigência
7. [[extensao-de-bolsa]] — estender uma bolsa ativa, com novas cotas de pagamento
8. [[cancelamento-de-bolsa]] — encerramento antecipado da bolsa

### Acompanhamento pelo coordenador
- [[acompanhamento-da-equipe]] — visão da equipe e do projeto, com filtros e consolidados

### Prestação de contas
- [[prestacao-de-contas]] — o coordenador comprova os gastos do projeto e a FAPES analisa
- [[configuracao-financeira-projeto]] — contas bancárias, orçamento e rúbricas que sustentam a prestação

### Voluntariado
- [[voluntariacao]] — vínculo a um projeto sem contrapartida financeira

### Administração (equipe FAPES)
- [[implementacao-de-bolsa]] — avaliação e aprovação das bolsas solicitadas
- [[importacao-de-editais]] — trazer editais do sistema legado da FAPES
- [[gestao-de-modalidades]] — cadastrar modalidades, valores e requisitos de bolsa
- [[revalidacao-de-bolsas]] — invalidação automática de bolsas com prazo de revalidação expirado
- [[captacao-de-projetos]] — parcerias institucionais, programas e fomentos
- [[importacao-curriculo-lattes]] — importar o currículo Lattes dos pesquisadores
- [[gestao-usuarios-backoffice]] — usuários internos da FAPES e seus papéis
- [[gestao-pessoas-fisicas]] — visão administrativa completa do bolsista
- [[gestao-de-aplicacoes]] — aplicações integradas ao sistema

### Acompanhamento e acesso
- [[autenticacao-autorizacao]] — login único e permissões por projeto
- [[meu-perfil]] — dados pessoais, endereço, dados bancários e nome social
- [[painel-e-indicadores]] — página inicial por perfil e indicadores do projeto
- [[notificacoes]] — avisos ao usuário, em tela e por e-mail

## Banco de dados

O sistema tem **110 tabelas**. Veja o modelo completo, com colunas e ligações entre todas elas, em **[[_banco-de-dados]]**.

As mais centrais: [[Pessoa]] · [[Projeto]] · [[Edital]] · [[AlocacaoBolsista]] (a bolsa) · [[ModalidadeBolsa]] · [[VersaoNivel]] · [[PagamentoBolsista]] · [[DocumentoMetadado]]

---

> Abra o **Graph View** (ícone no canto superior direito) para navegar visualmente pelo banco inteiro e suas ligações.
