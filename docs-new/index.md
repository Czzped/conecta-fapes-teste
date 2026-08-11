---
title: ConectaFapes - Documentação do Sistema
---

# ConectaFapes

Documentação técnica gerada a partir dos 7 repositórios do sistema.

Esta é uma página de exemplo (placeholder) publicada para validar o pipeline **Obsidian → GitHub → VPS (Quartz + Caddy) → Remark42**. O conteúdo real (requisitos, tabelas de banco, dependências entre serviços) será gerado a partir do código.

## Exemplo de ligação (grafo)

- [[frontoffice]] — front que consome a [[api-conectafapes]]
- [[api-conectafapes]] — depende da tabela [[tabela-solicitacao]]
- [[tabela-solicitacao]] — coluna `status` referenciada pelo requisito de [[solicitar-auxilio]]

> Clique em qualquer link acima, ou abra o **Graph View** (ícone no canto) para ver essas notas conectadas visualmente.

Os comentários abaixo desta página usam o [Remark42](https://remark42.com/), self-hosted na mesma VPS, com login obrigatório via conta GitHub.
