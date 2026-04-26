.PHONY: docs docs-serve docs-build docs-install docs-deploy

MKDOCS ?= $(if $(wildcard .venv/bin/mkdocs),.venv/bin/mkdocs,mkdocs)
DOCS_ADDR ?= 127.0.0.1:8001

# Instalar dependencias do MkDocs
docs-install:
	pip install -r requirements.txt

# Servidor de desenvolvimento com live reload (http://127.0.0.1:8001)
docs-serve:
	$(MKDOCS) serve --dev-addr $(DOCS_ADDR)

# Alias para docs-serve
docs: docs-serve

# Gerar site estatico em site/
docs-build:
	$(MKDOCS) build

# Deploy para GitHub Pages
docs-deploy:
	$(MKDOCS) gh-deploy --force

# Limpar site gerado
docs-clean:
	rm -rf site/
