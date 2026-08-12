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

  Acesso --> Pessoa
  Edital --> Plan
  Edital --> Aloc
  Modal --> Aloc
  Plan --> Aloc
  Pessoa --> Aloc
  Aloc --> Pag
  Aloc --> Doc
  Aloc --> Vol
  Pessoa --> Cur
  Edital --> Fom
  Par --> Fom
  Edital --> PC
  Pessoa --> PC

  classDef nucleo fill:#2d6cdf,stroke:#1b3f8b,color:#fff;
  class Aloc nucleo;
```

> Para o mapa completo com todas as 110 tabelas, veja [[_banco-de-dados]].

## Bolsas e Modalidades

```mermaid
flowchart LR
  ModalidadeBolsa
  Versao
  VersaoModalidade
  VersaoNivel
  NivelBolsa
  Moeda
  RequisitoBolsa
  RequisitoVersao
  Resolucao
  ModalidadeBolsaVersaoModalidade
  AreaConhecimento
  ModalidadeBolsaVersaoModalidade --> ModalidadeBolsa
  ModalidadeBolsaVersaoModalidade --> VersaoModalidade
  RequisitoVersao --> RequisitoBolsa
  RequisitoVersao --> Versao
  VersaoModalidade --> ModalidadeBolsa
  VersaoModalidade --> Resolucao
  VersaoModalidade --> Versao
  VersaoNivel --> Moeda
  VersaoNivel --> NivelBolsa
  VersaoNivel --> Versao
  VersaoNivel --> VersaoModalidade
  classDef ext fill:#eee,stroke:#999,color:#333,stroke-dasharray:3 3;
```

## Alocação de Bolsa (núcleo)

```mermaid
flowchart LR
  AlocacaoBolsista
  Orientacao
  AtividadeBolsista
  HistoricoBolsasAlocadas
  Voluntariacao
  Coordenacao
  Pessoa([Pessoa]):::ext
  Projeto([Projeto]):::ext
  VersaoNivel([VersaoNivel]):::ext
  AlocacaoBolsista --> Pessoa
  AlocacaoBolsista --> Projeto
  AlocacaoBolsista --> VersaoNivel
  AtividadeBolsista --> AlocacaoBolsista
  Coordenacao --> Pessoa
  Coordenacao --> Projeto
  HistoricoBolsasAlocadas --> AlocacaoBolsista
  HistoricoBolsasAlocadas --> VersaoNivel
  Orientacao --> AlocacaoBolsista
  Orientacao --> Pessoa
  Voluntariacao --> Pessoa
  Voluntariacao --> Projeto
  classDef ext fill:#eee,stroke:#999,color:#333,stroke-dasharray:3 3;
```

## Pessoas e Cadastro

```mermaid
flowchart LR
  Pessoa
  Endereco
  Telefone
  Documento
  DadosBancarios
  Naturalidade
  Banco
  AgenciaBanestes
  Municipio
  Estado
  HistoricoPessoa
  HistoricoEdicao
  DadosBancarios --> Banco
  DadosBancarios --> Pessoa
  Documento --> Pessoa
  Endereco --> Pessoa
  HistoricoEdicao --> Pessoa
  HistoricoPessoa --> Pessoa
  Municipio --> Estado
  Naturalidade --> Pessoa
  Telefone --> Pessoa
  classDef ext fill:#eee,stroke:#999,color:#333,stroke-dasharray:3 3;
```

## Editais e Projetos

```mermaid
flowchart LR
  Edital
  Projeto
  AreaTecnica
  Atividade
  Edital --> AreaTecnica
  Edital --> Atividade
  Projeto --> Edital
  classDef ext fill:#eee,stroke:#999,color:#333,stroke-dasharray:3 3;
```

## Planejamento e Cotas

```mermaid
flowchart LR
  PlanejamentoAlocacao
  PlanejamentoNivel
  CotasPorNivel
  HistoricoRemanejamento
  HistoricoRemanejamentoItem
  Projeto([Projeto]):::ext
  VersaoNivel([VersaoNivel]):::ext
  CotasPorNivel --> PlanejamentoAlocacao
  CotasPorNivel --> VersaoNivel
  HistoricoRemanejamento --> Projeto
  HistoricoRemanejamentoItem --> HistoricoRemanejamento
  HistoricoRemanejamentoItem --> VersaoNivel
  PlanejamentoAlocacao --> Projeto
  PlanejamentoNivel --> CotasPorNivel
  PlanejamentoNivel --> PlanejamentoAlocacao
  PlanejamentoNivel --> VersaoNivel
  classDef ext fill:#eee,stroke:#999,color:#333,stroke-dasharray:3 3;
```

## Pagamentos

```mermaid
flowchart LR
  PagamentoBolsista
  PlanoMensal
  AlocacaoBolsista([AlocacaoBolsista]):::ext
  PagamentoBolsista --> AlocacaoBolsista
  classDef ext fill:#eee,stroke:#999,color:#333,stroke-dasharray:3 3;
```

## Documentos e Termo

```mermaid
flowchart LR
  DocumentoMetadado
  TermoResponsabilidadeMetadado
  DeclaracaoAtividadeRemunerada
  DeclaracaoOutraBolsa
  AlocacaoBolsista([AlocacaoBolsista]):::ext
  Pessoa([Pessoa]):::ext
  DeclaracaoAtividadeRemunerada --> TermoResponsabilidadeMetadado
  DeclaracaoOutraBolsa --> TermoResponsabilidadeMetadado
  DocumentoMetadado --> AlocacaoBolsista
  DocumentoMetadado --> Pessoa
  TermoResponsabilidadeMetadado --> AlocacaoBolsista
  TermoResponsabilidadeMetadado --> DocumentoMetadado
  classDef ext fill:#eee,stroke:#999,color:#333,stroke-dasharray:3 3;
```

## Acesso e Aplicações

```mermaid
flowchart LR
  User
  Role
  RoleUser
  Aplicacao
  RoleUser --> Role
  RoleUser --> User
  classDef ext fill:#eee,stroke:#999,color:#333,stroke-dasharray:3 3;
```

## Parcerias e Programas

```mermaid
flowchart LR
  PlanejamentoEstrategico
  EixoEstrategico
  Programa
  ProgramaEixoEstrategico
  AportesFinanceirosPrograma
  ComiteGovernancaPrograma
  SuspensaoPrograma
  Parceria
  AporteParceriaInstituicao
  VigenciaParceria
  SuspensaoParceria
  EncerramentoParceria
  DocumentoParceria
  TipoDocumento
  Instituicao
  TipoInstituicao
  AreaTecnica([AreaTecnica]):::ext
  Pessoa([Pessoa]):::ext
  AporteParceriaInstituicao --> Instituicao
  AporteParceriaInstituicao --> Parceria
  AportesFinanceirosPrograma --> Parceria
  AportesFinanceirosPrograma --> Programa
  ComiteGovernancaPrograma --> Pessoa
  ComiteGovernancaPrograma --> Programa
  DocumentoParceria --> AporteParceriaInstituicao
  DocumentoParceria --> TipoDocumento
  DocumentoParceria --> VigenciaParceria
  EixoEstrategico --> PlanejamentoEstrategico
  EncerramentoParceria --> AreaTecnica
  EncerramentoParceria --> Parceria
  Instituicao --> TipoInstituicao
  Programa --> Instituicao
  Programa --> PlanejamentoEstrategico
  ProgramaEixoEstrategico --> EixoEstrategico
  ProgramaEixoEstrategico --> Programa
  SuspensaoParceria --> AreaTecnica
  SuspensaoParceria --> Instituicao
  SuspensaoParceria --> Parceria
  SuspensaoPrograma --> Parceria
  SuspensaoPrograma --> Programa
  SuspensaoPrograma --> SuspensaoParceria
  VigenciaParceria --> Parceria
  classDef ext fill:#eee,stroke:#999,color:#333,stroke-dasharray:3 3;
```

## Fomentos, Captações e Formulários

```mermaid
flowchart LR
  Fomento
  FomentoAreaTecnica
  FomentoEixoEstrategico
  FomentoTipoDocumento
  Faixa
  AporteFomento
  EtapaFomento
  Captacao
  EtapaCaptacao
  Formulario
  FormularioTipo
  CategoriaFormulario
  FormularioCategoriaFormulario
  RespostaFormulario
  AreaTecnica([AreaTecnica]):::ext
  Edital([Edital]):::ext
  Parceria([Parceria]):::ext
  Programa([Programa]):::ext
  Projeto([Projeto]):::ext
  AporteFomento --> Fomento
  AporteFomento --> Parceria
  AporteFomento --> Programa
  Captacao --> EtapaCaptacao
  Captacao --> Fomento
  EtapaCaptacao --> Captacao
  EtapaCaptacao --> EtapaFomento
  EtapaFomento --> Fomento
  Faixa --> Fomento
  Fomento --> Edital
  Fomento --> Formulario
  FomentoAreaTecnica --> AreaTecnica
  FomentoAreaTecnica --> Fomento
  FomentoEixoEstrategico --> Fomento
  FomentoTipoDocumento --> Fomento
  Formulario --> FormularioTipo
  FormularioCategoriaFormulario --> CategoriaFormulario
  FormularioCategoriaFormulario --> Formulario
  RespostaFormulario --> Captacao
  RespostaFormulario --> Formulario
  RespostaFormulario --> Projeto
  classDef ext fill:#eee,stroke:#999,color:#333,stroke-dasharray:3 3;
```

## Currículo Lattes

```mermaid
flowchart LR
  Curriculo
  FormacaoAcademica
  Idioma
  Artigo
  Livro
  Premio
  ParticipacaoEvento
  ParticipacaoProjeto
  ProjetoCurriculo
  OrientacaoAcademica
  AreaAtuacaoCurriculo
  Pessoa([Pessoa]):::ext
  AreaAtuacaoCurriculo --> Curriculo
  Artigo --> Curriculo
  Curriculo --> Pessoa
  FormacaoAcademica --> Curriculo
  Idioma --> Curriculo
  Livro --> Curriculo
  OrientacaoAcademica --> Curriculo
  ParticipacaoEvento --> Curriculo
  ParticipacaoProjeto --> Curriculo
  ParticipacaoProjeto --> Pessoa
  ParticipacaoProjeto --> ProjetoCurriculo
  Premio --> Curriculo
  classDef ext fill:#eee,stroke:#999,color:#333,stroke-dasharray:3 3;
```

## Prestação de Contas

```mermaid
flowchart LR
  Prestacao
  TransacaoFinanceira
  DocumentoFiscal
  ItemDocumentoFiscal
  ItemInvoice
  Orcamento
  OrcamentoFornecedor
  JustificativaDespesa
  JustificativaDiaria
  JustificativaInvoice
  JustificativaNF
  JustificativaPassagem
  PassageiroPassagem
  ContaBancaria
  ContaContabil
  Contestacao
  DefesasPrestacao
  DocumentosDefesa
  AlocacaoBolsistaRef
  ProjetoRef
  ContaBancaria --> ProjetoRef
  ContaContabil --> Orcamento
  Contestacao --> Prestacao
  DefesasPrestacao --> Prestacao
  DocumentoFiscal --> JustificativaNF
  DocumentosDefesa --> DefesasPrestacao
  ItemDocumentoFiscal --> ContaContabil
  ItemDocumentoFiscal --> DocumentoFiscal
  ItemInvoice --> JustificativaInvoice
  JustificativaDespesa --> Prestacao
  JustificativaDiaria --> AlocacaoBolsistaRef
  JustificativaDiaria --> JustificativaDespesa
  JustificativaInvoice --> JustificativaDespesa
  JustificativaNF --> JustificativaDespesa
  JustificativaPassagem --> ContaContabil
  JustificativaPassagem --> JustificativaDespesa
  OrcamentoFornecedor --> JustificativaDespesa
  PassageiroPassagem --> JustificativaPassagem
  TransacaoFinanceira --> ContaBancaria
  TransacaoFinanceira --> Prestacao
  classDef ext fill:#eee,stroke:#999,color:#333,stroke-dasharray:3 3;
```
