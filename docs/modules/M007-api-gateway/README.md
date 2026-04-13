# M007 - API Gateway

[← Voltar ao Backlog Central](../../backlog-product.md) | [Domain 01 — Corporativo e Administrativo](../../discovery/domains/01-corporativo.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de componentes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Fluxos de autenticacao e roteamento |

---

## Sobre o Modulo

Os servicos do sistema estao expostos diretamente sem uma camada unificada de roteamento, autenticacao e rate limiting, aumentando significativamente a superficie de ataque. Este modulo resolve esse problema ao prover um gateway centralizado para roteamento, autenticacao e controle de acesso das APIs, consolidando a seguranca em um unico ponto de entrada. O sucesso sera medido pela disponibilidade do gateway, latencia media das requisicoes e reducao de incidentes de seguranca.

---

## Dominio

O gateway de API garante que somente requisicoes legitimas e autorizadas sejam encaminhadas aos servicos do Conecta Fapes (e.g. controle de bolsistas e pagamento). Para isso implementa funcionalidades de Validacao de IP, Validacao de Politica de Seguranca e Validacao de Requisicao.

A Validacao do IP verifica se o IP de origem de cada requisicao e valido, ou seja, se esta no range de IP definido. A Validacao de Politica de Seguranca usa o sistema Muttley para verificar se o usuario tem a permissao de executar a operacao requisitada. Por fim, a Validacao de Requisicao verifica se o token de autorizacao foi gerado por algum servico do Conecta Fapes.

O API Gateway atua como o ponto unico de entrada para todas as requisicoes feitas pelos dispositivos clientes. Ele processa e encaminha as requisicoes para os servicos internos, funcionando como uma ponte entre o cliente e o sistema. Todas as requisicoes e respostas geram registros detalhados (logs), que sao usados para monitoramento, auditoria e diagnostico.

O processo de autenticacao envolve o encaminhamento da requisicao ao modulo Auth, que redireciona o cliente para a pagina de login do Acesso Cidadao. Apos a validacao das credenciais, o modulo Auth emite um token JWT que e validado pelo API Gateway antes de rotear a requisicao para o servico apropriado.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Somente requisicoes originadas de IPs dentro do range definido podem ser encaminhadas aos servicos internos. | Must |
| RN02 | IPs validos devem ser cadastrados previamente no sistema para que possam ser usados na validacao. | Must |
| RN03 | O acesso as rotas deve ser autorizado com base nos papeis (cargos) do usuario, conforme as politicas de acesso definidas no sistema Muttley. | Must |
| RN04 | O token de acesso (JWT) deve ter sido gerado por um servico do Conecta Fapes para ser considerado valido. | Must |
| RN05 | Cada rota deve possuir um limite configuravel de acessos (rate limit) para prevenir abuso e sobrecarga. | Should |
| RN06 | Requisicoes nao autorizadas ou nao autenticadas devem ser bloqueadas pelo gateway, impedindo acesso direto aos servicos internos. | Must |
| RN07 | Todas as requisicoes e respostas devem gerar registros detalhados (logs) para fins de monitoramento, auditoria e diagnostico. | Must |
| RN08 | O gateway deve funcionar como ponto unico de entrada, impedindo que clientes acessem servicos internos diretamente. | Must |
