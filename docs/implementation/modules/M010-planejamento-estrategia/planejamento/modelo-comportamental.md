# Modelo Comportamental — Planejamento Estrategico

[← Voltar ao M010](../README.md)

**Escopo**: Plano Estrategico e Eixos nao possuem maquina de estados complexa nesta fase. Um PlanoEstrategico e criado com estado `EmElaboracao`, pode ser marcado como `Ativo` ou `Encerrado`, e somente um Plano pode estar `Ativo` por vez (RN09). Eixos sao entidades agregadas ao plano (ciclo de vida simples: criado / atualizado / removido).

---

## Operacoes possiveis

| Operacao | Efeito |
|----------|--------|
| `RegistrarPlanoEstrategico` | Cria novo plano (RN09 valida unicidade de ativo) |
| `AtualizarPlanoEstrategico` | Edita dados; pode alterar o estado do plano |
| `AtivarPlanoEstrategico` | Define o plano como `Ativo` e garante que nao haja outro Plano ativo |
| `EncerrarPlanoEstrategico` | Define o plano como `Encerrado`, preservando historico |
| `CadastrarEixoEstrategico` | Adiciona eixo ao plano |
| `AtualizarEixoEstrategico` | Edita eixo |
| `ExcluirEixoEstrategico` | Remove eixo (bloqueado se houver Programas vinculados) |

> Ciclos de vida de Programa e Parceria estao em [programas/modelo-comportamental.md](../programas/modelo-comportamental.md) e [parcerias/modelo-comportamental.md](../parcerias/modelo-comportamental.md).
