---
sidebar_position: 1
---

# Propósito

O objetivo do API Gateway é controlar o acesso aos serviços providos pelo Conecta Fapes.

## Minimundo


O gateway de API garante que somente requisições legítimas e autorizadas sejam encaminhadas aos serviços do conecta fapes (e.g. controle de bolsistas e pagamento). Para isso implementa funcionalidade de Validação de IP, Validação de Politica de Segurança e Validação de Requisição. 

A Validação do IP verifica se IP de origem de cada requisição, é valido, ou seja, se está no range de IP definido. A Validação de Politica de Segurança usa o sistema Muttley para verificar se o usuário tem a permissão de executa a operação requisitada. Por fim, a Validação de Requisição verifica se o token de autorização foi gerado por algum serviço do Conecta Fapes. 


---
