"""MkDocs hooks. Regenera o Mapa de Capacidades antes de cada build.

Registrado em mkdocs.yml:
    hooks:
      - tools/mkdocs_hooks.py
"""
import os
import sys


def on_pre_build(config, **kwargs):
    here = os.path.dirname(os.path.abspath(__file__))
    if here not in sys.path:
        sys.path.insert(0, here)
    import build_capacidades
    build_capacidades.main()
