# M008 - Cadastros Corporativos

[<< Voltar ao Backlog Central](../../backlog-product.md) | [Domain 01 -- Corporativo e Administrativo](../../discovery/domains/01-corporativo.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclos de vida de Pessoa e Instituicao |

---

## Sobre o Modulo

Atualmente, os cadastros de pessoas fisicas, instituicoes de ensino e pesquisa, unidades organizacionais e dados de referencia (areas de conhecimento, rubricas financeiras, cidades e regioes) sao mantidos em planilhas e sistemas legados sem integracao, gerando duplicidade de registros, inconsistencias e retrabalho. Este modulo resolve esse problema ao centralizar o cadastro e a manutencao de pessoas, organizacoes e dados basicos de referencia em uma unica plataforma, garantindo unicidade (CPF/CNPJ), hierarquia organizacional e conformidade com classificacoes oficiais. O sucesso sera medido pela reducao de cadastros duplicados e pelo tempo necessario para localizar e validar dados cadastrais.

---

## Dominio

A FAPES interage com diversos atores externos -- pesquisadores, bolsistas, consultores ad hoc, instituicoes de ensino e pesquisa -- e precisa manter registros confiaveis sobre cada um deles para operacionalizar editais, projetos, bolsas e pagamentos.

Pessoas fisicas sao cadastradas com dados pessoais, academicos e profissionais. No front-office, o cadastro e feito automaticamente via Acesso Cidadao (SSO do governo do ES). No back-office, servidores podem cadastrar ou atualizar pessoas manualmente. Uma pessoa pode ser suspensa, o que bloqueia todas as operacoes vinculadas a ela (submissao de propostas, recebimento de bolsas, pagamentos).

Instituicoes de ensino e pesquisa sao identificadas por CNPJ e possuem uma estrutura hierarquica de unidades organizacionais (campus, departamentos, laboratorios). Cada unidade pode ter dirigentes (Reitor, Diretor, Chefe) registrados como responsaveis.

Alem dos cadastros de pessoas e organizacoes, o sistema mantem dados basicos de referencia: a estrutura organizacional interna da agencia (areas tecnicas e servidores), tabelas geograficas (cidades e regioes do ES), areas de conhecimento seguindo a classificacao do CNPq e rubricas financeiras para classificacao de despesas.

> Autenticacao e controle de acesso (IAM) sao tratados no modulo M005. Este modulo consome a identidade autenticada para associar ao cadastro da pessoa.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Uma pessoa fisica e identificada unicamente pelo CPF; nao pode haver duplicidade. | Must |
| RN02 | Uma instituicao e identificada unicamente pelo CNPJ; nao pode haver duplicidade. | Must |
| RN03 | Unidades organizacionais possuem hierarquia (pai-filho); uma unidade pertence a exatamente uma instituicao. | Must |
| RN04 | Um dirigente (Reitor, Diretor, Chefe) deve estar vinculado a uma unidade organizacional e ter mandato com data de inicio e fim. | Must |
| RN05 | A suspensao de uma pessoa bloqueia todas as operacoes vinculadas (submissao, bolsas, pagamentos). | Must |
| RN06 | Areas de conhecimento seguem a classificacao hierarquica do CNPq (grande area, area, subarea, especialidade). | Must |
| RN07 | Rubricas financeiras devem estar vinculadas a categorias orcamentarias validas. | Must |
| RN08 | Um servidor da agencia deve estar vinculado a exatamente uma area tecnica. | Must |
| RN09 | Cidades devem pertencer a uma regiao; regioes agrupam cidades do estado. | Should |
| RN10 | O cadastro automatico via Acesso Cidadao deve criar a pessoa caso nao exista, ou vincular a existente pelo CPF. | Should |
| RI1 | Um dirigente so pode ter um mandato ativo por unidade organizacional ao mesmo tempo. | Must |
| RI2 | Uma pessoa suspensa nao pode ser reativada sem justificativa registrada. | Must |
