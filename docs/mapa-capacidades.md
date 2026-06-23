# Mapa de Capacidades

Grafo interativo dos 24 módulos da plataforma: **importância**, **impacto** e como cada módulo **habilita** os demais. Abre em página cheia, fora do layout da documentação.

<p style="margin:22px 0">
  <a href="../assets/mapa-capacidades.html" target="_blank" rel="noopener"
     style="display:inline-flex;align-items:center;gap:10px;background:#3b82f6;color:#fff;
            font-weight:600;font-size:15px;padding:13px 22px;border-radius:10px;text-decoration:none">
    ▶ Abrir o Mapa de Capacidades
  </a>
</p>

O que dá pra fazer na ferramenta:

- Clicar num módulo para isolar sua cadeia (verde = habilita à frente, azul = depende atrás).
- **Buscar** um módulo ou epic e ver seu impacto/habilitação.
- **⚠ Simular queda** — ver o efeito-cascata se um módulo falhar.
- Abas **Modelo** (entidades/eventos da ontologia) e **Entrega** (epics e user stories).
- **⚡ impacto epics** — setas epic → módulo.

!!! info "Como é gerado"
    Fonte autoral: [`docs/data/capacidades.yaml`](data/capacidades.yaml) (nós, importância, impacto, status, arestas transversais).
    Grafo estrutural e modelo: extraídos das `ontology.yaml`. Epics e user stories: dos `EPIC-*.md`.
    Tudo mesclado por [`tools/build_capacidades.py`](https://github.com/leds-conectafapes/conectafapes-project/blob/main/tools/build_capacidades.py), executado a cada build do site.
