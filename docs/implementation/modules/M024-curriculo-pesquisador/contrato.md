# Contrato do Modulo

Dominio e regras: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do M024 — como pesquisadores, analistas e modulos internos interagem com o curriculo academico estruturado sem precisar conhecer XML Lattes, parsers ou detalhes do adapter externo M023/lattes.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Pesquisador | Vincula e sincroniza o proprio curriculo; consulta seu perfil academico |
| Analista da Agencia | Consulta e sincroniza curriculos de qualquer pesquisador para elegibilidade e curadoria |
| M011 (Configuracao de Captacao) | Busca consultores Ad Hoc por area de conhecimento, titulacao e producao |
| M018 (Business Intelligence) | Calcula indicadores de producao cientifica e titulacao |
| M019 (Transparencia e Auditoria) | Publica vitrine academica de pesquisadores beneficiarios |
| M020 (Comunicacao) | Envia notificacoes de vinculacao, atualizacao, falha e desatualizacao |
| M008 (Cadastros Corporativos) | Mantem `PessoaFisica.nivelAcademico` e cadastro canonico de AreaConhecimento |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M023/lattes | Modulo interno / adapter externo | Importa e sincroniza snapshot Lattes de forma sincrona |
| Plataforma Lattes CNPq | Sistema externo | Fonte canonica dos dados academicos |
| M005 (Autenticacao) | Modulo interno | Identidade autenticada e perfis de acesso |
| M008 (Cadastros Corporativos) | Modulo interno | `PessoaFisica`, `Instituicao`, `AreaConhecimento`, `Cidade` e `Documento` |
| M020 (Comunicacao) | Modulo interno | Notificacoes ao pesquisador e operadores |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| VincularCurriculo | Command | Associar `numeroLattes` a uma `PessoaFisica` e executar primeira sincronizacao | `cpf`, `numeroLattes` | `Curriculo` versao 1 com contagens | RN-M024-01, RN-M024-02, RN-M024-05, RN-M024-07 | PessoaFisica existe; numero Lattes nao esta vinculado; pessoa nao esta suspensa | PESSOA_NAO_ENCONTRADA, NUMERO_LATTES_JA_VINCULADO, PESQUISADOR_SUSPENSO, ADAPTER_LATTES_FALHOU | Sim por `cpf` + `numeroLattes` se ja vinculado a mesma pessoa | Pesquisador proprio CPF ou Analista | `POST /api/v1/m024/pesquisadores/{cpf}/curriculo/vincular` |
| SincronizarCurriculo | Command | Reimportar o snapshot atual do Lattes preservando snapshot anterior em caso de falha | `cpf` | `Curriculo` com nova `versao` e contagens | RN-M024-03, RN-M024-04, RN-M024-05, RN-M024-07 | Curriculo vinculado; pessoa nao esta suspensa | CURRICULO_NAO_VINCULADO, PESQUISADOR_SUSPENSO, ADAPTER_LATTES_FALHOU | Sim quanto ao resultado do snapshot; versao so incrementa em sucesso | Pesquisador proprio CPF ou Analista | `POST /api/v1/m024/pesquisadores/{cpf}/curriculo/sincronizar` |
| ConsultarCurriculo | Query | Retornar perfil completo do pesquisador | `cpf` | Pessoa + Curriculo + entidades academicas/vinculos | RN-M024-04, RN-M024-05 | Curriculo vinculado | CURRICULO_NAO_VINCULADO | N/A | Pesquisador proprio CPF, Analista ou Modulo Interno | `GET /api/v1/m024/pesquisadores/{cpf}/curriculo` |
| ListarComponentesCurriculo | Query | Listar colecoes do curriculo com filtros especificos | `cpf`, `tipoComponente`, filtros | Lista paginada de formacoes/artigos/livros/orientacoes/projetos/premios/eventos/idiomas | RN-M024-03, RN-M024-04 | Curriculo vinculado | CURRICULO_NAO_VINCULADO, FILTRO_INVALIDO | N/A | Pesquisador proprio CPF, Analista ou Modulo Interno | `GET /api/v1/m024/pesquisadores/{cpf}/curriculo/{colecao}` |
| BuscarPesquisadoresPorExpertise | Query | Encontrar pesquisadores por area, titulacao minima e producao minima | `area`, `titulacaoMinima`, `producaoMinima`, `apenasValidos` | Lista paginada de pesquisadores elegiveis | RN-M024-04, RN-M024-05, RN-M024-06 | Area existe em M008 | AREA_INVALIDA | N/A | Analista ou Modulo Interno | `GET /api/v1/m024/pesquisadores` |

### Jobs

| Job | Tipo | Objetivo | Frequencia | Regras |
|-----|------|----------|------------|--------|
| SincronizarCurriculosSemanalmente | Job | Reimportar curriculos de todos pesquisadores vinculados | Semanal | RN-M024-03, RN-M024-07 |
| AlertarCurriculosDesatualizados | Job | Identificar curriculos com sincronizacao perto de 12 meses e acionar M020 | Diario | RN-M024-04 |

### Eventos publicados

| Evento | Quando | Carga util |
|--------|--------|-----------|
| `PesquisadorVinculado` | `VincularCurriculo` conclui com sucesso | `cpf`, `numeroLattes`, `dataVinculacao`, `versaoInicial` |
| `CurriculoAtualizado` | `SincronizarCurriculo` conclui com sucesso | `cpf`, `numeroLattes`, `versao`, `dataSincronizacao`, `contagens` |
| `AreaConhecimentoNaoMapeada` | Adapter encontra area Lattes sem correspondencia M008 | `cpf`, `areaLattesString`, `dataSincronizacao` |
| `PesquisadorSuspenso` | M024 recebe suspensao de PessoaFisica com curriculo | `cpf`, `numeroLattes`, `dataSuspensao` |
| `PesquisadorReativado` | PessoaFisica com curriculo e reativada | `cpf`, `numeroLattes`, `dataReativacao` |

## Padrao de Payload e Erro

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "cpf": "12345678901"
    }
  }
}
```

## Exemplos JSON por Operacao

### VincularCurriculo

**Entrada**

```json
{
  "numeroLattes": "1234567890123456"
}
```

**Saida**

```json
{
  "cpf": "12345678901",
  "numeroLattes": "1234567890123456",
  "versao": 1,
  "dataAtualizacaoLattes": "2026-05-03",
  "dataUltimaSincronizacao": "2026-05-11T14:32:42Z",
  "resumo": "Pesquisadora em Ciencia da Computacao...",
  "contagens": {
    "formacoes": 3,
    "artigos": 27,
    "livros": 4,
    "orientacoes": 12,
    "projetos": 8,
    "premios": 2,
    "eventos": 18,
    "idiomas": 3,
    "areasDeAtuacao": 2
  }
}
```

### BuscarPesquisadoresPorExpertise

**Entrada logica**

```json
{
  "area": "10303000",
  "titulacaoMinima": "Doutorado",
  "producaoMinima": 5,
  "apenasValidos": true
}
```

**Saida**

```json
{
  "pesquisadores": [
    {
      "cpf": "12345678901",
      "nome": "Maria Oliveira",
      "numeroLattes": "1234567890123456",
      "titulacaoMaxima": "Doutorado",
      "areaPrincipal": "Ciencia da Computacao",
      "totalArtigos": 27,
      "curriculoValido": true
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 134
}
```

## Referencias

- [README.md](README.md) — dominio e regras do modulo
- [modelo-estrutural.md](modelo-estrutural.md) — mapa consolidado do modelo academico
- [submodelos/README.md](submodelos/README.md) — dicionarios de dados por assunto do curriculo
- [modelo-comportamental.md](modelo-comportamental.md) — ciclos de vida e transicoes
- [contrato-api.md](contrato-api.md) — contrato HTTP REST
- [eventos-dominio.md](eventos-dominio.md) — eventos publicados pelo modulo
- [M023/lattes](../M023-integracoes/lattes/README.md) — adapter externo de importacao Lattes
