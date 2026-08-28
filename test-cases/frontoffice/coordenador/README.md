# Rotas — Coordenador

Rotas do perfil de coordenador verificadas na aplicação publicada em
`https://frontoffice-conecta.vercel.app/` em 26/08/2026.

| Diretório de testes | Rota publicada | Acesso |
|---|---|---|
| `inicio` | `/coordenador/inicio` | página inicial |
| `informacoes` | `/coordenador/informacoes` | Meu Perfil |
| `pagamentos` | `/coordenador/pagamentos` | pagamentos pessoais |
| `projetos` | `/coordenador/projetos` | Meu Projeto |
| `minha-equipe` | `/coordenador/minha-equipe` | equipe e bolsas |
| `minha-equipe/cadastrar-bolsista` | `/coordenador/cadastrar-bolsista` | fluxo derivado da equipe |
| `minha-equipe/solicitar-auxilio` | `/coordenador/solicitar-auxilio` | fluxo derivado da equipe |
| `minha-equipe/pagamentos-projeto` | `/coordenador/pagamentos-projeto` | pagamentos do projeto |
| `certificados` | `/coordenador/certificados` | solicitações e diárias |
| `prestacao-contas/financeira` | `/coordenador/financeira` | prestação financeira |
| `prestacao-contas/financeira/detalhe-comprovacao-transacao/classificar-credito` | `/coordenador/prestacao-financeira/classificar-credito/:paymentId` | classificar crédito (exclusivo para transações de Crédito) |
| `prestacao-contas/tecnica` | `/coordenador/prestacao-contas-tecnica` | prestação técnica |
| `prestacao-contas/remanejamento` | `/coordenador/remanejamento` | remanejamento orçamentário |

Cada diretório deve conter os casos de teste da página ou fluxo correspondente.

