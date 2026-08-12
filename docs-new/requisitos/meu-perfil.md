---
title: Meu Perfil
tipo: requisito
---

# Meu Perfil

O Meu Perfil reúne os dados pessoais, os endereços e os dados bancários de cada usuário do ConectaFapes. É onde a pessoa consulta e mantém seu cadastro atualizado — condição para solicitar bolsa e para participar como voluntária. O perfil também garante o direito ao uso do **nome social**, oferece o **preenchimento automático de endereço por CEP** e trata do cadastro bancário na **agência Banestes**. Um cadastro só é considerado completo quando reúne dados pessoais e endereço residencial completos; o endereço profissional é opcional, mas, se informado, precisa estar completo.

## Atores

- **Usuário autenticado** — consulta e atualiza os próprios dados pessoais, endereços e dados bancários, e define o nome social.
- **Acesso Cidadão** — fonte da identificação inicial (CPF, nome e e-mail) e da consulta de CEP.
- **Agência Banestes** — destino do pedido de cadastro bancário do usuário.
- **Sistema** — valida a identificação, avalia a completude do cadastro, preenche endereço a partir do CEP e processa o pedido de cadastro Banestes.

## Fluxo principal

1. O usuário autenticado abre o Meu Perfil. É necessário estar **pré-cadastrado** na base da FAPES; caso contrário, o sistema informa a pendência ("A pessoa não está pré-cadastrada!").
2. O sistema apresenta o perfil completo: **dados pessoais, endereços e dados bancários**.
3. O usuário atualiza os dados pessoais (nome, data de nascimento, e-mail, celular, sexo, raça, endereço do currículo Lattes e nível acadêmico).
4. Para o endereço, o usuário pode informar o **CEP** e o sistema preenche automaticamente logradouro, bairro, município e UF; o usuário completa número e complemento.
5. O usuário informa os **dados bancários** (banco, agência e conta) e, se for o caso, solicita o **cadastro na agência Banestes**.
6. Se desejar, o usuário define o **nome social**, que passa a ser o nome de identificação exibido no sistema.
7. O sistema avalia a **completude do cadastro** e sinaliza se ele está completo ou se ainda há pendências.

## Regras de negócio

### Consulta e atualização

- **Consulta do perfil**: retorna dados pessoais, endereços e dados bancários da pessoa autenticada.
- **Pré-cadastro obrigatório**: só é possível consultar ou atualizar o perfil de quem já está pré-cadastrado na base ("A pessoa não está pré-cadastrada!").
- **Identificação válida**: a operação exige identificação válida vinda do Acesso Cidadão; identificação vazia é recusada ("As claims vieram vazias do Acesso Cidadão"). Ver [[autenticacao-autorizacao]].
- **Atualização de dados pessoais**: aceita nome, data de nascimento, e-mail, celular, sexo, raça, endereço do currículo Lattes e nível acadêmico.

### Completude do cadastro

- **Dados pessoais obrigatórios** (todos preenchidos para o cadastro ser completo): nome, CPF, data de nascimento, e-mail, celular, sexo, raça, endereço do currículo Lattes e nível acadêmico.
- **Sexo não informado**: enquanto o sexo estiver como "não informado", o cadastro é considerado **incompleto** (é um exemplo de campo pessoal que precisa estar efetivamente preenchido).
- **Endereço residencial obrigatório e completo**: precisa ter país, logradouro, número, complemento, CEP, bairro, município e UF. Sem endereço residencial completo, o cadastro é **incompleto**.
- **Endereço profissional opcional**: sua ausência **não** torna o cadastro incompleto. Porém, se um endereço profissional for informado, ele precisa estar **completo** — endereço profissional preenchido pela metade deixa o cadastro **incompleto**.
- **Resultado da avaliação**: o cadastro é considerado **completo** apenas quando os dados pessoais e o endereço residencial estão completos e, havendo endereço profissional, ele também está completo.

### Nome social

- O usuário pode definir seu **nome social**; ao fazê-lo, o nome de identificação da pessoa passa a ser o nome social informado.
- A atualização identifica a pessoa e o novo nome. Pessoa inexistente faz a operação falhar ("Pessoa não encontrada.").
- O uso do nome social é um direito do usuário conforme a legislação vigente e vale para a identificação em todo o sistema.

### Consulta de CEP

- O CEP precisa ter **8 dígitos**. Formato diferente disso é recusado ("CEP inválido. Deve conter 8 dígitos.").
- Um CEP válido retorna **logradouro, bairro, município e UF**, usados para preencher automaticamente o endereço.
- Falhas tratadas com mensagem clara: serviço de CEP indisponível ("Erro ao consultar CEP."), CEP inexistente ("Dados do CEP não encontrados."), falha ao obter acesso ao serviço ("Erro ao obter token de acesso.") e configuração de acesso ausente ("Client ID ou Secret não encontrados nas variáveis de ambiente.").

### Dados bancários e agência Banestes

- Os dados bancários guardam **banco, agência e conta** da pessoa, com a indicação de qual é o registro **atual**.
- O usuário pode **solicitar o cadastro na agência Banestes**; o pedido é processado pelo sistema.
- O cadastro Banestes se apoia nas agências Banestes conhecidas (identificadas por código, nome e município).

## Estados e transições

- **Perfil não pré-cadastrado** → operação recusada até haver pré-cadastro na base da FAPES.
- **Cadastro incompleto** → **cadastro completo**: quando dados pessoais e endereço residencial passam a estar completos (e o profissional, se existir, também).
- **Cadastro completo** → **cadastro incompleto**: quando algum campo obrigatório deixa de estar preenchido (por exemplo, sexo volta a "não informado") ou quando um endereço profissional parcial é adicionado.
- **Sem nome social** → **com nome social**: ao definir o nome social, ele passa a ser o nome de identificação.
- **Endereço em branco** → **endereço preenchido por CEP**: consulta de CEP válida preenche logradouro, bairro, município e UF.
- **Sem dados bancários / sem cadastro Banestes** → **pedido de cadastro Banestes processado**.

## Casos especiais e exceções

- **Pessoa não pré-cadastrada**: consulta e atualização recusadas com mensagem específica.
- **Identificação vazia**: operação recusada.
- **Sexo como "não informado"**: mantém o cadastro incompleto mesmo com os demais dados pessoais preenchidos.
- **Falta de endereço residencial**: cadastro incompleto.
- **Ausência de endereço profissional**: não impede a completude.
- **Endereço profissional parcial**: torna o cadastro incompleto.
- **CEP com formato inválido**: recusado por não ter 8 dígitos.
- **CEP inexistente ou serviço de CEP indisponível**: mensagens específicas, sem preencher o endereço.
- **Nome social de pessoa inexistente**: operação falha com mensagem específica.

## Dados envolvidos

[[Pessoa]] · [[Endereco]] · [[Telefone]] · [[Naturalidade]] · [[DadosBancarios]] · [[Banco]] · [[AgenciaBanestes]] · [[User]]

## Funcionalidades relacionadas

[[autenticacao-autorizacao]] · [[solicitacao-de-bolsa]] · [[voluntariacao]] · [[importacao-curriculo-lattes]] · [[gestao-pessoas-fisicas]]
