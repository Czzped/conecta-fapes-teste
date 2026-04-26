.PHONY: docs docs-serve docs-build docs-install docs-deploy backoffice backoffice-dev backoffice-install

MKDOCS ?= $(if $(wildcard .venv/bin/mkdocs),.venv/bin/mkdocs,mkdocs)
DOCS_ADDR ?= 127.0.0.1:8001
BACKOFFICE_DIR ?= prototype/backoffice
BACKOFFICE_HOST ?= 127.0.0.1
BACKOFFICE_PORT ?= 5173

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

# Instalar dependencias do prototipo backoffice
backoffice-install:
	cd $(BACKOFFICE_DIR) && npm install

# Servidor local do backoffice (http://127.0.0.1:5173)
backoffice-dev:
	cd $(BACKOFFICE_DIR) && npm run dev -- --host $(BACKOFFICE_HOST) --port $(BACKOFFICE_PORT)

# Alias para backoffice-dev
backoffice: backoffice-dev
