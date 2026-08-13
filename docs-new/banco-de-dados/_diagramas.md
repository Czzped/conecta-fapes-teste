---
title: Diagramas do Domínio
---

# Diagramas do Domínio

Modelo de dados do ConectaFapes dividido por subdomínio, para leitura fácil. O primeiro é o **panorama geral** (nível de subdomínio); os demais detalham as tabelas de cada área e suas ligações. Nós tracejados são tabelas de outra área citadas como âncora.

## Panorama geral

```mermaid
flowchart TB
  Pessoa["👤 Pessoas e Cadastro"]
  Acesso["🔑 Acesso e Aplicações"]
  Modal["🎓 Bolsas e Modalidades"]
  Edital["📄 Editais e Projetos"]
  Plan["📊 Planejamento e Cotas"]
  Aloc["⭐ Alocação de Bolsa"]
  Pag["💰 Pagamentos"]
  Doc["📎 Documentos e Termo"]
  Vol["🤝 Voluntariado"]
  Cur["📚 Currículo Lattes"]
  Par["🏛️ Parcerias e Programas"]
  Fom["📢 Fomentos e Captações"]
  PC["🧾 Prestação de Contas"]

  Acesso -->|1:1| Pessoa
  Edital -->|1:N| Plan
  Edital -->|1:N| Aloc
  Modal -->|1:N| Aloc
  Plan -->|1:N| Aloc
  Pessoa -->|1:N| Aloc
  Aloc -->|1:N| Pag
  Aloc -->|1:N| Doc
  Pessoa -->|1:N| Vol
  Edital -->|1:N| Vol
  Pessoa -->|1:1| Cur
  Edital -->|1:N| Fom
  Par -->|N:N| Fom
  Edital -->|1:N| PC
  Pessoa -->|1:N| PC

  classDef nucleo fill:#2d6cdf,stroke:#1b3f8b,color:#fff;
  class Aloc nucleo;
```

> **Como ler a cardinalidade** nos diagramas por área (notação ER, pé‑de‑galinha): `||` = exatamente um · `o{` = zero ou muitos. Assim `Pessoa ||--o{ AlocacaoBolsista` lê‑se *"uma Pessoa tem muitas Alocações; cada Alocação pertence a uma Pessoa"* (1:N). Tabelas de junção (com dois vínculos 1:N) representam relações N:N.

> Para o mapa completo com todas as 110 tabelas, veja [[_banco-de-dados]].

## Bolsas e Modalidades

```mermaid
erDiagram
  ModalidadeBolsa {
  }
  Versao {
  }
  VersaoModalidade {
  }
  VersaoNivel {
  }
  NivelBolsa {
  }
  Moeda {
  }
  RequisitoBolsa {
  }
  RequisitoVersao {
  }
  Resolucao {
  }
  ModalidadeBolsaVersaoModalidade {
  }
  AreaConhecimento {
  }
  ModalidadeBolsa ||--o{ ModalidadeBolsaVersaoModalidade : "1:N"
  ModalidadeBolsa ||--o{ VersaoModalidade : "1:N"
  Moeda ||--o{ VersaoNivel : "1:N"
  NivelBolsa ||--o{ VersaoNivel : "1:N"
  RequisitoBolsa ||--o{ RequisitoVersao : "1:N"
  Resolucao ||--o{ VersaoModalidade : "1:N"
  Versao ||--o{ RequisitoVersao : "1:N"
  Versao ||--o{ VersaoModalidade : "1:N"
  Versao ||--o{ VersaoNivel : "1:N"
  VersaoModalidade ||--o{ ModalidadeBolsaVersaoModalidade : "1:N"
  VersaoModalidade ||--o{ VersaoNivel : "1:N"
```

## Alocação de Bolsa (núcleo)

```mermaid
erDiagram
  AlocacaoBolsista {
  }
  Orientacao {
  }
  AtividadeBolsista {
  }
  HistoricoBolsasAlocadas {
  }
  Voluntariacao {
  }
  Coordenacao {
  }
  Pessoa {
  }
  Projeto {
  }
  VersaoNivel {
  }
  AlocacaoBolsista ||--o{ AtividadeBolsista : "1:N"
  AlocacaoBolsista ||--o{ HistoricoBolsasAlocadas : "1:N"
  AlocacaoBolsista ||--o{ Orientacao : "1:N"
  Pessoa ||--o{ AlocacaoBolsista : "1:N"
  Pessoa ||--o{ Coordenacao : "1:N"
  Pessoa ||--o{ Orientacao : "1:N"
  Pessoa ||--o{ Voluntariacao : "1:N"
  Projeto ||--o{ AlocacaoBolsista : "1:N"
  Projeto ||--o{ Coordenacao : "1:N"
  Projeto ||--o{ Voluntariacao : "1:N"
  VersaoNivel ||--o{ AlocacaoBolsista : "1:N"
  VersaoNivel ||--o{ HistoricoBolsasAlocadas : "1:N"
```
_Entidades de outras áreas citadas como âncora:_ `Pessoa`, `Projeto`, `VersaoNivel`.

## Pessoas e Cadastro

```mermaid
erDiagram
  Pessoa {
  }
  Endereco {
  }
  Telefone {
  }
  Documento {
  }
  DadosBancarios {
  }
  Naturalidade {
  }
  Banco {
  }
  AgenciaBanestes {
  }
  Municipio {
  }
  Estado {
  }
  HistoricoPessoa {
  }
  HistoricoEdicao {
  }
  Banco ||--o{ DadosBancarios : "1:N"
  Estado ||--o{ Municipio : "1:N"
  Pessoa ||--o{ DadosBancarios : "1:N"
  Pessoa ||--o{ Documento : "1:N"
  Pessoa ||--o{ Endereco : "1:N"
  Pessoa ||--o{ HistoricoEdicao : "1:N"
  Pessoa ||--o{ HistoricoPessoa : "1:N"
  Pessoa ||--o{ Naturalidade : "1:N"
  Pessoa ||--o{ Telefone : "1:N"
```

## Editais e Projetos

```mermaid
erDiagram
  Edital {
  }
  Projeto {
  }
  AreaTecnica {
  }
  Atividade {
  }
  AreaTecnica ||--o{ Edital : "1:N"
  Atividade ||--o{ Edital : "1:N"
  Edital ||--o{ Projeto : "1:N"
```

## Planejamento e Cotas

```mermaid
erDiagram
  PlanejamentoAlocacao {
  }
  PlanejamentoNivel {
  }
  CotasPorNivel {
  }
  HistoricoRemanejamento {
  }
  HistoricoRemanejamentoItem {
  }
  Projeto {
  }
  VersaoNivel {
  }
  CotasPorNivel ||--o{ PlanejamentoNivel : "1:N"
  HistoricoRemanejamento ||--o{ HistoricoRemanejamentoItem : "1:N"
  PlanejamentoAlocacao ||--o{ CotasPorNivel : "1:N"
  PlanejamentoAlocacao ||--o{ PlanejamentoNivel : "1:N"
  Projeto ||--o{ HistoricoRemanejamento : "1:N"
  Projeto ||--o{ PlanejamentoAlocacao : "1:N"
  VersaoNivel ||--o{ CotasPorNivel : "1:N"
  VersaoNivel ||--o{ HistoricoRemanejamentoItem : "1:N"
  VersaoNivel ||--o{ PlanejamentoNivel : "1:N"
```
_Entidades de outras áreas citadas como âncora:_ `Projeto`, `VersaoNivel`.

## Pagamentos

```mermaid
erDiagram
  PagamentoBolsista {
  }
  PlanoMensal {
  }
  AlocacaoBolsista {
  }
  AlocacaoBolsista ||--o{ PagamentoBolsista : "1:N"
```
_Entidades de outras áreas citadas como âncora:_ `AlocacaoBolsista`.

## Documentos e Termo

```mermaid
erDiagram
  DocumentoMetadado {
  }
  TermoResponsabilidadeMetadado {
  }
  DeclaracaoAtividadeRemunerada {
  }
  DeclaracaoOutraBolsa {
  }
  AlocacaoBolsista {
  }
  Pessoa {
  }
  AlocacaoBolsista ||--o{ DocumentoMetadado : "1:N"
  AlocacaoBolsista ||--o{ TermoResponsabilidadeMetadado : "1:N"
  DocumentoMetadado ||--o{ TermoResponsabilidadeMetadado : "1:N"
  Pessoa ||--o{ DocumentoMetadado : "1:N"
  TermoResponsabilidadeMetadado ||--o{ DeclaracaoAtividadeRemunerada : "1:N"
  TermoResponsabilidadeMetadado ||--o{ DeclaracaoOutraBolsa : "1:N"
```
_Entidades de outras áreas citadas como âncora:_ `AlocacaoBolsista`, `Pessoa`.

## Acesso e Aplicações

```mermaid
erDiagram
  User {
  }
  Role {
  }
  RoleUser {
  }
  Aplicacao {
  }
  Role ||--o{ RoleUser : "1:N"
  User ||--o{ RoleUser : "1:N"
```

## Parcerias e Programas

```mermaid
erDiagram
  PlanejamentoEstrategico {
  }
  EixoEstrategico {
  }
  Programa {
  }
  ProgramaEixoEstrategico {
  }
  AportesFinanceirosPrograma {
  }
  ComiteGovernancaPrograma {
  }
  SuspensaoPrograma {
  }
  Parceria {
  }
  AporteParceriaInstituicao {
  }
  VigenciaParceria {
  }
  SuspensaoParceria {
  }
  EncerramentoParceria {
  }
  DocumentoParceria {
  }
  TipoDocumento {
  }
  Instituicao {
  }
  TipoInstituicao {
  }
  AreaTecnica {
  }
  Pessoa {
  }
  AporteParceriaInstituicao ||--o{ DocumentoParceria : "1:N"
  AreaTecnica ||--o{ EncerramentoParceria : "1:N"
  AreaTecnica ||--o{ SuspensaoParceria : "1:N"
  EixoEstrategico ||--o{ ProgramaEixoEstrategico : "1:N"
  Instituicao ||--o{ AporteParceriaInstituicao : "1:N"
  Instituicao ||--o{ Programa : "1:N"
  Instituicao ||--o{ SuspensaoParceria : "1:N"
  Parceria ||--o{ AporteParceriaInstituicao : "1:N"
  Parceria ||--o{ AportesFinanceirosPrograma : "1:N"
  Parceria ||--o{ EncerramentoParceria : "1:N"
  Parceria ||--o{ SuspensaoParceria : "1:N"
  Parceria ||--o{ SuspensaoPrograma : "1:N"
  Parceria ||--o{ VigenciaParceria : "1:N"
  Pessoa ||--o{ ComiteGovernancaPrograma : "1:N"
  PlanejamentoEstrategico ||--o{ EixoEstrategico : "1:N"
  PlanejamentoEstrategico ||--o{ Programa : "1:N"
  Programa ||--o{ AportesFinanceirosPrograma : "1:N"
  Programa ||--o{ ComiteGovernancaPrograma : "1:N"
  Programa ||--o{ ProgramaEixoEstrategico : "1:N"
  Programa ||--o{ SuspensaoPrograma : "1:N"
  SuspensaoParceria ||--o{ SuspensaoPrograma : "1:N"
  TipoDocumento ||--o{ DocumentoParceria : "1:N"
  TipoInstituicao ||--o{ Instituicao : "1:N"
  VigenciaParceria ||--o{ DocumentoParceria : "1:N"
```
_Entidades de outras áreas citadas como âncora:_ `AreaTecnica`, `Pessoa`.

## Fomentos, Captações e Formulários

```mermaid
erDiagram
  Fomento {
  }
  FomentoAreaTecnica {
  }
  FomentoEixoEstrategico {
  }
  FomentoTipoDocumento {
  }
  Faixa {
  }
  AporteFomento {
  }
  EtapaFomento {
  }
  Captacao {
  }
  EtapaCaptacao {
  }
  Formulario {
  }
  FormularioTipo {
  }
  CategoriaFormulario {
  }
  FormularioCategoriaFormulario {
  }
  RespostaFormulario {
  }
  AreaTecnica {
  }
  Edital {
  }
  Parceria {
  }
  Programa {
  }
  Projeto {
  }
  AreaTecnica ||--o{ FomentoAreaTecnica : "1:N"
  Captacao ||--o{ EtapaCaptacao : "1:N"
  Captacao ||--o{ RespostaFormulario : "1:N"
  CategoriaFormulario ||--o{ FormularioCategoriaFormulario : "1:N"
  Edital ||--o{ Fomento : "1:N"
  EtapaCaptacao ||--o{ Captacao : "1:N"
  EtapaFomento ||--o{ EtapaCaptacao : "1:N"
  Fomento ||--o{ AporteFomento : "1:N"
  Fomento ||--o{ Captacao : "1:N"
  Fomento ||--o{ EtapaFomento : "1:N"
  Fomento ||--o{ Faixa : "1:N"
  Fomento ||--o{ FomentoAreaTecnica : "1:N"
  Fomento ||--o{ FomentoEixoEstrategico : "1:N"
  Fomento ||--o{ FomentoTipoDocumento : "1:N"
  Formulario ||--o{ Fomento : "1:N"
  Formulario ||--o{ FormularioCategoriaFormulario : "1:N"
  Formulario ||--o{ RespostaFormulario : "1:N"
  FormularioTipo ||--o{ Formulario : "1:N"
  Parceria ||--o{ AporteFomento : "1:N"
  Programa ||--o{ AporteFomento : "1:N"
  Projeto ||--o{ RespostaFormulario : "1:N"
```
_Entidades de outras áreas citadas como âncora:_ `AreaTecnica`, `Edital`, `Parceria`, `Programa`, `Projeto`.

## Currículo Lattes

```mermaid
erDiagram
  Curriculo {
  }
  FormacaoAcademica {
  }
  Idioma {
  }
  Artigo {
  }
  Livro {
  }
  Premio {
  }
  ParticipacaoEvento {
  }
  ParticipacaoProjeto {
  }
  ProjetoCurriculo {
  }
  OrientacaoAcademica {
  }
  AreaAtuacaoCurriculo {
  }
  Pessoa {
  }
  Curriculo ||--o{ AreaAtuacaoCurriculo : "1:N"
  Curriculo ||--o{ Artigo : "1:N"
  Curriculo ||--o{ FormacaoAcademica : "1:N"
  Curriculo ||--o{ Idioma : "1:N"
  Curriculo ||--o{ Livro : "1:N"
  Curriculo ||--o{ OrientacaoAcademica : "1:N"
  Curriculo ||--o{ ParticipacaoEvento : "1:N"
  Curriculo ||--o{ ParticipacaoProjeto : "1:N"
  Curriculo ||--o{ Premio : "1:N"
  Pessoa ||--o{ Curriculo : "1:N"
  Pessoa ||--o{ ParticipacaoProjeto : "1:N"
  ProjetoCurriculo ||--o{ ParticipacaoProjeto : "1:N"
```
_Entidades de outras áreas citadas como âncora:_ `Pessoa`.

## Prestação de Contas

```mermaid
erDiagram
  Prestacao {
  }
  TransacaoFinanceira {
  }
  DocumentoFiscal {
  }
  ItemDocumentoFiscal {
  }
  ItemInvoice {
  }
  Orcamento {
  }
  OrcamentoFornecedor {
  }
  JustificativaDespesa {
  }
  JustificativaDiaria {
  }
  JustificativaInvoice {
  }
  JustificativaNF {
  }
  JustificativaPassagem {
  }
  PassageiroPassagem {
  }
  ContaBancaria {
  }
  ContaContabil {
  }
  Contestacao {
  }
  DefesasPrestacao {
  }
  DocumentosDefesa {
  }
  AlocacaoBolsistaRef {
  }
  ProjetoRef {
  }
  AlocacaoBolsistaRef ||--o{ JustificativaDiaria : "1:N"
  ContaBancaria ||--o{ TransacaoFinanceira : "1:N"
  ContaContabil ||--o{ ItemDocumentoFiscal : "1:N"
  ContaContabil ||--o{ JustificativaPassagem : "1:N"
  DefesasPrestacao ||--o{ DocumentosDefesa : "1:N"
  DocumentoFiscal ||--o{ ItemDocumentoFiscal : "1:N"
  JustificativaDespesa ||--o{ JustificativaDiaria : "1:N"
  JustificativaDespesa ||--o{ JustificativaInvoice : "1:N"
  JustificativaDespesa ||--o{ JustificativaNF : "1:N"
  JustificativaDespesa ||--o{ JustificativaPassagem : "1:N"
  JustificativaDespesa ||--o{ OrcamentoFornecedor : "1:N"
  JustificativaInvoice ||--o{ ItemInvoice : "1:N"
  JustificativaNF ||--o{ DocumentoFiscal : "1:N"
  JustificativaPassagem ||--o{ PassageiroPassagem : "1:N"
  Orcamento ||--o{ ContaContabil : "1:N"
  Prestacao ||--o{ Contestacao : "1:N"
  Prestacao ||--o{ DefesasPrestacao : "1:N"
  Prestacao ||--o{ JustificativaDespesa : "1:N"
  Prestacao ||--o{ TransacaoFinanceira : "1:N"
  ProjetoRef ||--o{ ContaBancaria : "1:N"
```
