BUILD_DIR = public

install:
	@echo "Instalando dependências..."
	npm install

dev:
	@echo "Iniciando servidor de desenvolvimento..."
	npm run start

build:
	@echo "Construindo o site para produção..."
	npm run build

serve:
	@echo "Servindo arquivos estáticos da pasta $(BUILD_DIR)..."
	npx serve $(BUILD_DIR)

clean:
	@echo "Limpando diretórios de build..."
	rm -rf $(BUILD_DIR)

lint:
	@echo "Verificando o código com ESLint..."
	npm run lint

format:
	@echo "Formatando código com Prettier..."
	npm run format

all: install dev build serve
	@echo "Processo completo: instalação, desenvolvimento, build e servidor concluídos."

help:
	@echo "Comandos disponíveis:"
	@echo "  make install     - Instala as dependências do projeto"
	@echo "  make dev         - Inicia o servidor de desenvolvimento"
	@echo "  make build       - Gera o build de produção do site"
	@echo "  make serve       - Serve os arquivos estáticos localmente"
	@echo "  make clean       - Remove os arquivos de build"
	@echo "  make deploy      - Faz deploy no GitHub Pages"
	@echo "  make lint        - Verifica o código com ESLint"
	@echo "  make format      - Formata o código com Prettier"
	@echo "  make help        - Mostra esta ajuda"

.DEFAULT_GOAL := help

