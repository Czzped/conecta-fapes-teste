---
sidebar_position: 4
---
# API de Notificações
API responsavel por enviar email pelo sistema do Prodest
## Orientações Gerais 

1- Ambiente de Homologação - [https://api.notificacoes.hom.es.gov.br/swagger/index.html](https://api.notificacoes.hom.es.gov.br/swagger/index.html)

2- O envio da notificação é realizado com um Access Token do fluxo ClientCredentials.

3- Para consultar as notificações no sistema, um Acess Token do usuário autenticado precisa ser utilizado.

4- Habilitar o sistema nos scopes da API de notificação.

5- Configurar os scopes de API de notificação no APP do AC e no sistema.

6- Meios de Envio:
    
    1- E-mail Pessoal
    2- E-mail Corporativo (prioritário)

---

```
curl -X 'POST' \
  'https://api.notificacoes.hom.es.gov.br/api/notificacoes' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer acesss-tooken' \
  -H 'Content-Type: application/json-patch+json' \
  -d '{
  "categoria": "[TESTE] - Teste API de Notificações",
  "titulo": "Teste API de Notificações",
  "conteudo": "Teste API de Notificações",
  "resumo": "Teste API de Notificações",
  "destinatariosGuid": [
    "alterar-para-o-guid-do-usuário-do-acesso-cidadão"
  ],
  "anexoUrl": "",
  "url": "",
  "meiosEnvio": [
    1
  ]
}'
```

## JSON - Request
```
{
  "categoria": "[TESTE] - Teste API de Notificações",
  "titulo": "Teste API de Notificações",
  "conteudo": "Teste API de Notificações",
  "resumo": "Teste API de Notificações",
  "destinatariosGuid": [
    "alterar-para-o-guid-do-usuário-do-acesso-cidadão"
  ],
  "anexoUrl": "",
  "url": "",
  "meiosEnvio": [
    1
  ]
}
```

## JSON Response
```
{
  "id": 930490,
  "lida": false,
  "categoriaId": 259,
  "titulo": "Teste API de Notificações",
  "conteudo": "Teste API de Notificações",
  "resumo": "Teste API de Notificações",
  "anexoUrl": "",
  "url": "",
  "usuarioGuid": "00000000-0000-0000-0000-000000000000",
  "dataCriacao": "2025-05-28T13:48:09.6868123Z",
  "dataEnvio": "0001-01-01T00:00:00Z",
  "categoria": {
    "id": 259,
    "nome": "[TESTE] - Teste API de Notificações",
    "sigla": "teste-teste-api-de-notificacoes"
  }
}
```

## Orientações Gerais - API de CEP

1- https://api.consultacep.es.gov.br/swagger/index.html

2- O envio da notificação é realizado com um Access Token do fluxo ClientCredentials.

3- Habilitar o sistema nos scopes da API de CEP.

4- Configurar os scopes de API de CEP no APP do AC e no sistema.