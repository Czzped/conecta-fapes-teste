.PHONY: docs docs-serve docs-build docs-install docs-deploy

# Instalar dependencias do MkDocs
docs-install:
	pip install -r requirements.txt

# Servidor de desenvolvimento com live reload (http://127.0.0.1:8000)
docs-serve:
	mkdocs serve

# Alias para docs-serve
docs: docs-serve

# Gerar site estatico em site/
docs-build:
	mkdocs build

# Deploy para GitHub Pages
docs-deploy:
	mkdocs gh-deploy --force

# Limpar site gerado
docs-clean:
	rm -rf site/
