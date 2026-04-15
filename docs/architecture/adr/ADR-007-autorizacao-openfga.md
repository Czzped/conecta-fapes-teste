# ADR-007: OpenFGA como motor de autorizacao

| Atributo | Valor |
|----------|-------|
| **Status** | Aceita |
| **Data** | 2026-04-14 |
| **Autores** | Time de Arquitetura ConectaFAPES |
| **Modulos impactados** | M006, M007, todos os modulos que aplicam controle de acesso |

## Contexto

O ConectaFAPES precisa de um modelo de autorizacao granular que suporte:

- controle de acesso baseado em papeis (RBAC) para perfis como Coordenador, Operador, Diretor e Area Tecnica;
- controle de acesso baseado em atributos (ABAC) para regras como "Area Tecnica so libera editais da sua unidade";
- delegacao de funcoes quando responsaveis estao ausentes;
- auditoria de quem acessou o que e quando.

A autenticacao e federada via Acesso Cidadao (OpenID Connect), mas a autorizacao precisa de um motor dedicado que avalie politicas em tempo real sem acoplar a logica de permissao ao codigo de cada modulo.

## Decisao

Adotado **OpenFGA** como motor de decisao de autorizacao (PDP — Policy Decision Point), integrado a arquitetura XACML adaptada descrita em [03-acesso-e-seguranca.md](../03-acesso-e-seguranca.md).

O modelo segue a separacao de responsabilidades:

| Componente | Responsabilidade | Implementacao |
|------------|-----------------|---------------|
| **PAP** (Policy Administration Point) | Definicao e manutencao das politicas | Interface administrativa + OpenFGA authorization model |
| **PIP** (Policy Information Point) | Coleta de atributos do contexto | M008 (pessoa, unidade), M005 (sessao) |
| **PDP** (Policy Decision Point) | Avaliacao das politicas em tempo real | **OpenFGA** |
| **PEP** (Policy Enforcement Point) | Aplicacao da decisao | Gateway (M007) + backends (middleware de autorizacao) |

Fluxo de autorizacao:

```text
Requisicao → Gateway (M007) → PEP verifica token → PDP (OpenFGA) avalia politica → permite/nega
```

### Modelo de autorizacao

O modelo OpenFGA sera organizado por:

- **Types**: `user`, `project`, `edital`, `alocacao`, `folha`, `organization_unit`
- **Relations**: `coordinator`, `advisor`, `analyst`, `director`, `viewer`, `admin`
- **Tuples**: associacoes concretas (ex: `user:joao is coordinator of project:PROJ-2026-014`)

### Defense in Depth

A autorizacao e aplicada em multiplas camadas:

1. **Gateway** (M007): verifica token e permissoes grosseiras (perfil x rota)
2. **Backend** (middleware): verifica permissoes finas (usuario x recurso x acao)
3. **Frontend**: esconde elementos de UI baseado em permissoes (nao substitui backend)

## Consequencias

### Positivas

- Politicas de acesso desacopladas do codigo — mudancas de permissao nao exigem deploy
- Suporte nativo a RBAC e ABAC no mesmo motor
- Avaliacao em tempo real com latencia baixa (OpenFGA otimizado para decisoes rapidas)
- Modelo de autorizacao versionavel e auditavel
- Delegacao de funcoes implementavel como tuples temporarias

### Negativas

- Dependencia de servico externo (OpenFGA) para toda decisao de acesso
- Complexidade de modelagem: definir types e relations exige design cuidadoso
- Curva de aprendizado para o time que nao conhece o padrao XACML/Zanzibar

### Riscos

- Indisponibilidade do OpenFGA bloqueia todo o sistema — mitigado por cache de decisoes e fallback permissivo para leitura
- Modelo de autorizacao incorreto pode conceder acesso indevido — mitigado por testes de politica e revisao de tuples em staging
- Performance degradada com muitas tuples — mitigado por design hierarquico e avaliacao de escala

## Referencias

- [OpenFGA — Documentacao](https://openfga.dev/docs)
- [Zanzibar: Google's Consistent, Global Authorization System](https://research.google/pubs/pub48190/)
- [Arquitetura - Acesso e Seguranca](../03-acesso-e-seguranca.md)
- [ADR-001 — Backend em C# com Clean Architecture e CQRS](ADR-001-backend-csharp-clean-architecture-cqrs.md)
