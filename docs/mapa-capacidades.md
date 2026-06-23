# Mapa de Capacidades

Grafo interativo dos 24 módulos da plataforma: **importância**, **impacto** e como cada módulo **habilita** os demais.

- Clique num módulo para isolar sua cadeia (verde = habilita à frente, azul = depende atrás).
- Use a **busca** para pular a um módulo ou epic e ver seu impacto.
- Ative **⚠ Simular queda** para ver o efeito-cascata se um módulo falhar.
- Abra um módulo e vá às abas **Modelo** (entidades/eventos da ontologia) e **Entrega** (epics e user stories).
- **⚡ impacto epics** desenha as setas epic → módulo.

<iframe src="../assets/mapa-capacidades.html" title="Mapa de Capacidades — ConectaFAPES"
        style="width:100%;height:84vh;border:1px solid var(--md-default-fg-color--lightest);border-radius:12px;margin-top:8px"
        loading="lazy"></iframe>

!!! info "Como é gerado"
    Fonte autoral: [`docs/data/capacidades.yaml`](data/capacidades.yaml) (nós, importância, impacto, status, arestas transversais).
    Grafo estrutural e detalhe do modelo: extraídos das `ontology.yaml` de cada módulo.
    Epics e user stories: extraídos dos `EPIC-*.md`.
    Tudo é mesclado por [`tools/build_capacidades.py`](https://github.com/leds-conectafapes/conectafapes-project/blob/main/tools/build_capacidades.py), executado automaticamente a cada build do site.
