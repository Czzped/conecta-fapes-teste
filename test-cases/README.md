# Casos de Teste — Conecta FAPES

Repositório de casos de teste funcionais e de integração da plataforma.

> 🤖 **Atenção Agentes de IA (Diretrizes Obrigatórias):**
> 1. **Código em Produção é ESTRITAMENTE READ-ONLY:** Pastas como `leds-conectafapes-frontoffice-frontend-develop/` são exclusivas para leitura e inspeção. **NUNCA modifique arquivos de código-fonte.** Qualquer arquivo gerado deve ser salvo exclusivamente em `test-cases/`.
> 2. **Token-Saving & Mapeamento:** Consulte PRIMEIRO o [**MAPA-QA-GLOBAL.md**](MAPA-QA-GLOBAL.md) para localizar a tela, módulo, regra canônica e diretório de salvamento.
> 3. **Manuais Obrigatórios:** Leia as instruções completas em [instrucoes-ia-casos-de-teste.md](referencias/instrucoes-ia-casos-de-teste.md) e [instrucoes-ia-relato-de-bug.md](referencias/instrucoes-ia-relato-de-bug.md).

## Organização do Repositório de Testes

Os casos de teste e relatos de defeitos estão organizados por canais de produto, perfis e fluxos:

```text
test-cases/
├── MAPA-QA-GLOBAL.md          # Matriz unificada de consulta rápida para IAs e humanos
├── referencias/               # Templates e manuais de token-saving para IAs
├── frontoffice/               # Testes e bugs do Portal Coordenador e Bolsista
│   ├── coordenador/           # Rotas /coordenador/* (início, perfil, pagamentos, prestação)
│   └── bolsista/              # Rotas do bolsista
└── backoffice/                # Testes e bugs do Portal Admin (FAPES)
    └── admin/                 # Rotas /admin/* (modalidades, importação, folhas, análise)
```

Cada diretório de tela contém seus casos de teste (`CT-*.md`) e uma subpasta dedicada `bugs/` para os defeitos encontrados (`BUG-*.md`) e suas evidências de imagem/vídeo.

## Conteúdo mínimo de um caso

- Identificador e título
- Módulo e requisito/regra de negócio de origem
- Pré-condições e dados de teste
- Passos de execução
- Resultado esperado
- Tipo: unitário, integração ou ponta a ponta
- Status e evidência de execução, quando houver

Todo código implementado deve manter testes unitários e de integração, conforme a Definition of Done do projeto.
