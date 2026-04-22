# Implementação — Instituição (backend-admin)

Módulo: M008 — Cadastros Corporativos  
Repositório: `leds-conectafapes-backend-admin`  
Issue: [#1749](https://github.com/leds-conectafapes/leds-conectafapes-backend-admin/issues/1749)  
Sprint: SPRINT-007

> **Nota:** Este documento descreve a implementação interna do backend-admin para a entidade Instituição.
> O contrato canônico do módulo M008 está em [contrato-api.md](contrato-api.md).
> A implementação atual segue as convenções internas do projeto (Opção B — alinhamento futuro ao contrato M008).

---

## Endpoint

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`    | `/api/cadastroscorporativos/instituicao`     | Lista todas as instituições |
| `GET`    | `/api/cadastroscorporativos/instituicao/{id}` | Consulta instituição por Id |
| `POST`   | `/api/cadastroscorporativos/instituicao`     | Cadastra nova instituição |
| `PUT`    | `/api/cadastroscorporativos/instituicao/{id}` | Atualiza instituição |
| `DELETE` | `/api/cadastroscorporativos/instituicao/{id}` | Remove instituição (soft delete) |

Autenticação: JWT Bearer (`Authorization: Bearer <token>`)

---

## Payload de criação (POST)

```json
{
  "cnpj": "11444777000161",
  "razaoSocial": "Universidade Federal Teste",
  "nomeFantasia": "UFT",
  "isExterna": false,
  "tipoInstituicaoId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

| Campo | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `cnpj` | string | Sim | Exatamente 14 dígitos numéricos, dígitos verificadores válidos |
| `razaoSocial` | string | Sim | Máximo 200 caracteres |
| `nomeFantasia` | string | Não | Máximo 200 caracteres |
| `isExterna` | boolean | Sim | Indica se a instituição é externa à agência |
| `tipoInstituicaoId` | Guid | Sim | Id de um TipoInstituicao cadastrado |

---

## Payload de atualização (PUT)

Mesmo schema do POST acrescido de `id` (Guid) e `ativa` (boolean).

---

## Entidade — Instituicao

```csharp
public class Instituicao : BaseEntity
{
    public string Cnpj { get; set; }          // 14 dígitos numéricos
    public string RazaoSocial { get; set; }   // máx 200 chars
    public string? NomeFantasia { get; set; } // máx 200 chars, opcional
    public bool Ativa { get; set; }           // default true
    public bool IsExterna { get; set; }
    public Guid TipoInstituicaoId { get; set; }
    public TipoInstituicao TipoInstituicao { get; set; }
}
```

Herda `BaseEntity`: `Id` (Guid), `DateCreated`, `DateUpdated`, `DateDeleted` (soft delete).

---

## Regras de negócio

| Código | Descrição |
|--------|-----------|
| RN01 | CNPJ obrigatório, exatamente 14 dígitos numéricos |
| RN02 | CNPJ deve conter dígitos verificadores válidos (algoritmo Módulo 11 — Receita Federal) |
| RN03 | CNPJ não pode ter todos os dígitos iguais (ex: `11111111111111`) |
| RN04 | CNPJ único no sistema — erro `400` com mensagem `"O CNPJ {cnpj} já está cadastrado no sistema."` |
| RN05 | `Ativa = true` por padrão na criação |
| RN06 | `TipoInstituicaoId` deve referenciar um TipoInstituicao existente |

Validações RN01–RN03 lançam `DomainValidationException` no construtor da entidade.  
Validação RN04 é aplicada na camada de serviço (`InstituicaoService.Create`).

---

## TipoInstituicao — Seed inicial

| Id | Nome | Descrição |
|----|------|-----------|
| `a1b2c3d4-e5f6-7890-abcd-ef1234567890` | Universidade | Instituição de ensino superior universitária |
| `b2c3d4e5-f6a7-8901-bcde-f12345678901` | Empresa | Empresa privada ou organização empresarial |
| `c3d4e5f6-a7b8-9012-cdef-123456789012` | Órgão Governamental | Órgão ou entidade da administração pública |

---

## Camadas implementadas

```
Domain
  Entities/CadastrosCorporativos/Instituicao.cs
  Entities/CadastrosCorporativos/TipoInstituicao.cs
  Interfaces/CadastrosCorporativos/IInstituicaoRepository.cs
  Interfaces/CadastrosCorporativos/ITipoInstituicaoRepository.cs

Application
  DTOs/CadastrosCorporativos/Request/InstituicaoRequestDTO.cs
  DTOs/CadastrosCorporativos/Response/InstituicaoResponseDTO.cs
  DTOs/CadastrosCorporativos/Response/TipoInstituicaoResponseDTO.cs
  Interfaces/CadastrosCorporativos/IInstituicaoService.cs
  Services/CadastrosCorporativos/InstituicaoService.cs
  Mappers/CadastrosCorporativos/InstituicaoMapper.cs
  UseCases/CadastrosCorporativos/InstituicaoCases/Create/*
  UseCases/CadastrosCorporativos/InstituicaoCases/GetAll/*
  UseCases/CadastrosCorporativos/InstituicaoCases/GetById/*
  UseCases/CadastrosCorporativos/InstituicaoCases/Update/*
  UseCases/CadastrosCorporativos/InstituicaoCases/Delete/*

Infrastructure
  Repositories/CadastrosCorporativos/InstituicaoRepository.cs
  Repositories/CadastrosCorporativos/TipoInstituicaoRepository.cs
  EntitiesConfiguration/CadastrosCorporativos/InstituicaoConfiguration.cs
  EntitiesConfiguration/CadastrosCorporativos/TipoInstituicaoConfiguration.cs

WebApi
  Controllers/CadastrosCorporativos/InstituicaoController.cs
```

---

## Testes

| Projeto | Arquivo | Casos |
|---------|---------|-------|
| `ConectaFapes.Domain.Test` | `CadastrosCorporativos/InstituicaoTest.cs` | CNPJ vazio, length ≠ 14, dígito verificador inválido, todos dígitos iguais, RazaoSocial vazia, TipoId empty, criação válida, Ativa default |
| `ConectaFapes.Application.Test` | `UseCases/CadastrosCorporativos/CreateInstituicaoTest.cs` | CNPJ duplicado retorna erro, dados válidos persiste e retorna response, Ativa=true |
| `ConectaFapes.Infrastructure.Test` | `Repositories/CadastrosCorporativos/InstituicaoRepositoryTest.cs` | Insert, Update, Delete (soft), GetAll, CnpjExiste |
| `ConectaFapes.Test` | `Features/CadastrosCorporativos/InstituicaoApiTest.cs` | 9 cenários E2E (POST, GET, PUT, DELETE) |

---

## Migration pendente

```bash
# Instalar dotnet-ef (se necessário)
dotnet tool install --global dotnet-ef

# Gerar migration (executar de: src/ConectaFapes/)
dotnet ef migrations add AddInstituicao \
  --project ConectaFapes.Infrastructure \
  --startup-project ConectaFapes.WebApi
```
