# ADR-010: MinIO como armazenamento de objetos S3-compativel

| Atributo | Valor |
|----------|-------|
| **Status** | Aceita |
| **Data** | 2026-04-14 |
| **Autores** | Time de Arquitetura ConectaFAPES |
| **Modulos impactados** | M004, M014 |

## Contexto

O ConectaFAPES gera e consome arquivos em varios contextos:

- **M004**: arquivos de remessa bancaria (largura fixa), retornos, guias de liberacao (PDF), relacoes de pagamento (PDF/CSV/ZIP);
- **M014**: PDFs de orcamento de fornecedor, justificativas de despesa, documentos fiscais;
- **Portal Coordenador**: upload de documentos de bolsista, termos de responsabilidade.

Esses arquivos nao devem ser armazenados no banco de dados (blobs) por questoes de performance e custo. Precisam de uma solucao de storage com:

- API compativel com S3 (padrao de mercado);
- suporte a buckets separados por contexto;
- pre-signed URLs para upload/download direto do frontend;
- integridade verificavel (hash).

## Decisao

Adotado **MinIO** como servico de armazenamento de objetos S3-compativel, organizado por buckets tematicos.

### Buckets configurados

| Bucket (variavel de ambiente) | Modulo | Conteudo |
|-------------------------------|--------|----------|
| `BUCKET_GUIAS` | M004 | Guias de liberacao em PDF (Banestes e Bandes) |
| `BUCKET_REMESSAS` | M004 | Arquivos de remessa e retorno bancario |
| `BUCKET_RELACOES` | M004 | Relacoes e relatorios de pagamento |
| (bucket de prestacao) | M014 | PDFs de orcamento de fornecedor e justificativas |

### Padrao de uso nos modulos

```text
Aplicacao → MinioService (Scoped) → MinIO API (S3-compativel) → Bucket
                                          ↑
                                    Pre-signed URL (upload direto do frontend)
```

- `MinioService` e um servico Scoped registrado na camada de Infrastructure.
- Os modulos referenciam o MinIO via interface `IMinioService`, nao diretamente.
- Pre-signed URLs permitem upload direto do frontend sem passar pelo backend.
- Hash SHA256 e calculado e armazenado no registro da entidade para garantia de integridade.

## Consequencias

### Positivas

- API padrao S3 — facilita migracao futura para AWS S3, Google Cloud Storage ou Azure Blob
- Buckets separados por contexto — isolamento de dados
- Pre-signed URLs — reduz carga no backend para upload/download
- Hash SHA256 — garante integridade dos arquivos

### Negativas

- Mais um servico de infraestrutura para operar e monitorar
- Backup de MinIO requer configuracao separada do backup de SQL Server
- Pre-signed URLs tem expiracao — frontend precisa tratar URLs expiradas

### Riscos

- Perda de dados se MinIO nao tiver backup — mitigado por politica de backup na Prodest
- Acesso indevido a arquivos via URLs pre-assinadas — mitigado por expiracao curta e autorizacao no backend
- Crescimento descontrolado de storage — mitigado por politica de retencao por bucket

## Referencias

- [MinIO — Documentacao](https://min.io/docs/minio/linux/index.html)
- [Arquitetura - Dados e Operacao](../04-dados-e-operacao.md) — secao "MinIO"
- [M004 - Pagamento de Bolsistas](../../implementation/modules/M004-pagamento-bolsista/README.md)
- [M014 - Prestacao de Contas](../../implementation/modules/M014-prestacao-contas/README.md)
