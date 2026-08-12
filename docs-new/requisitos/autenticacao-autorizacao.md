---
title: Acesso e Permissões
tipo: requisito
---

# Acesso e Permissões

O acesso ao ConectaFapes é feito por **login único do Acesso Cidadão** — a identidade digital do Governo do Espírito Santo. O usuário não cria nem guarda senha no ConectaFapes: ele entra com a mesma conta que já usa nos demais serviços do estado. A partir desse login, o sistema identifica a pessoa, carrega o perfil de acesso e decide o que ela pode fazer em cada projeto. Essa identidade validada é a base de todas as demais funcionalidades — sem ela, nenhuma ação é permitida.

## Atores

- **Usuário do portal** — qualquer pessoa que entra pelo Acesso Cidadão (pesquisadores, coordenadores, orientadores, bolsistas e voluntários).
- **Equipe FAPES** — usuários administrativos, com papéis internos de gestão (administrador, gerente de área técnica e operador).
- **Acesso Cidadão** — provedor externo da identidade digital; é quem confirma quem é a pessoa e fornece seus dados de identificação.
- **Sistema** — valida a identificação, carrega o perfil, aplica as permissões por projeto e mantém a sessão viva.

## Fluxo principal

1. O usuário escolhe entrar e é levado ao **Acesso Cidadão** para se identificar com a conta do governo do estado.
2. Ao voltar, o sistema recebe a identificação da pessoa e valida os dados essenciais: **CPF, nome e e-mail**.
3. Com a identificação válida, o sistema carrega o **perfil de acesso** da pessoa: seus papéis e a informação de quais projetos ela coordena.
4. No **primeiro acesso**, o sistema registra automaticamente a conta de acesso do usuário a partir dos dados vindos do login, sem exigir novo cadastro manual.
5. O usuário passa a navegar pelas funcionalidades permitidas ao seu perfil; a cada ação, o sistema confere se o papel e o vínculo com o projeto autorizam aquilo.
6. Enquanto o usuário está ativo, a **sessão é renovada automaticamente**. Quando a sessão expira, o sistema pede para renovar o acesso antes de continuar.

## Regras de negócio

- **Login único, sem senha própria**: a autenticação é sempre delegada ao Acesso Cidadão. O ConectaFapes não mantém senha do usuário.
- **Identificação obrigatória**: o acesso só é concedido quando a identificação traz CPF, nome e e-mail. Faltando qualquer um desses dados, o acesso é recusado ("Token claims inválidas"). Se a identificação vier totalmente vazia, o erro é específico ("As claims vieram vazias do Acesso Cidadão").
- **Perfil carregado por CPF**: o sistema localiza a pessoa pelo CPF da identificação e carrega seus papéis e a marcação de coordenador. Se o CPF não corresponder a um usuário conhecido, o carregamento do perfil falha ("Não foi possível carregar o usuário").
- **Papéis existentes**: do lado dos participantes — **Bolsista**, **Coordenador** e **Orientador**; do lado da equipe FAPES — papéis administrativos (**Administrador**, **Gerente de Área Técnica** e **Operador**). Cada papel é verificável individualmente pelo sistema (por exemplo, "é coordenador?", "é orientador?", "é administrador?").
- **Permissões por projeto, não globais**: ser coordenador, orientador ou bolsista vale **por projeto**. A mesma pessoa pode ser coordenadora de um projeto e apenas bolsista de outro. As permissões de uma ação sempre consideram o vínculo da pessoa com aquele projeto específico.
- **Papel único por projeto**: dentro de um mesmo projeto, uma pessoa assume um único papel de participação — não pode ser, ao mesmo tempo, bolsista e voluntária no mesmo projeto.
- **Primeiro acesso**: a conta de acesso é criada a partir do login na primeira entrada. As funcionalidades de perfil, bolsa e voluntariado, porém, dependem de a pessoa já estar **pré-cadastrada** na base da FAPES; enquanto não estiver, essas telas informam a pendência (ver [[meu-perfil]]).
- **Renovação de sessão**: a sessão é mantida enquanto o usuário está ativo e renovada de forma automática. Ao expirar, o sistema solicita a renovação do acesso antes de liberar novas ações, preservando a continuidade do trabalho.
- **Base para tudo**: nenhuma funcionalidade do portal opera sem uma identidade válida e um perfil carregado. Ações sensíveis conferem, além da identidade, o papel e o vínculo com o projeto.

## Estados e transições

- **Não autenticado** → **autenticado**: usuário se identifica com sucesso pelo Acesso Cidadão e traz CPF, nome e e-mail.
- **Autenticado sem perfil** → **autenticado com perfil**: o sistema localiza a pessoa pelo CPF e carrega papéis e marcação de coordenador.
- **Autenticado** → **primeiro acesso registrado**: na primeira entrada, cria-se a conta de acesso a partir dos dados do login.
- **Sessão ativa** → **sessão renovada**: renovação automática enquanto o usuário está ativo.
- **Sessão ativa** → **sessão expirada** → **renovação solicitada**: ao expirar, o sistema pede a renovação antes de continuar.
- **Autenticação recusada**: quando faltam dados de identificação ou o CPF não corresponde a um usuário conhecido, o acesso ou o perfil não são liberados.

## Casos especiais e exceções

- **Identificação incompleta** (falta CPF, nome ou e-mail): acesso recusado por identificação inválida.
- **Identificação vazia**: recusa com mensagem específica de que os dados vieram vazios do Acesso Cidadão.
- **CPF sem correspondência na base de usuários**: o perfil não é carregado; a pessoa precisa estar cadastrada.
- **Pessoa autenticada mas não pré-cadastrada na FAPES**: consegue entrar, mas as funcionalidades que exigem cadastro completo indicam a pendência.
- **Sessão expirada durante o uso**: o sistema interrompe a ação em curso e pede a renovação do acesso, evitando executar algo com sessão vencida.
- **Ação fora do vínculo com o projeto**: mesmo autenticada, a pessoa não executa ações restritas a coordenador (ou outro papel) em projetos onde não tem aquele papel.

## Dados envolvidos

[[User]] · [[Role]] · [[RoleUser]] · [[Pessoa]]

## Funcionalidades relacionadas

[[meu-perfil]] · [[voluntariacao]] · [[solicitacao-de-bolsa]] · [[gestao-usuarios-backoffice]] · [[gestao-pessoas-fisicas]] · [[notificacoes]]
