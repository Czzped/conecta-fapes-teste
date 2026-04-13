---
sidebar_position: 6
title: "Integração Acesso Cidadão com Token JWT"
---

# Integração Acesso Cidadão com Token JWT

Um vez que o backend tem acesso às informações do usuário, precisamos de uma maneira segura de informar ao cliente (frontend) que o usuário poderá acessar os demais recursos do sistema. No **Conecta Fapes** foi implemmentado a autênticação baseada em token, assim o backend envia esse token ao frontend que a cada requisição do usuário no **Conecta Fapes** retorna esse token ao backend que então será responsável por verificar se o token é válido e suas devidas permissões e por fim retornar ou negar o acesso ao recurso solicitado.

##  O que é o Token JWT ?

JWT (JSON Web Token) é um padrão open source usado para transmitir informações de forma segura entre duas partes (geralmente um cliente e um servidor) como um objeto JSON compactado e assinado digitalmente.

Um JWT é composto por três partes:

- Header: Define o tipo de token (JWT) e o algoritmo de assinatura usado (ex.: HMAC, RSA).
- Payload: Contém as informações (ou "claims") que estão sendo transmitidas, como o identificador do usuário, permissões, etc.
- Signature: Uma assinatura digital que garante a integridade dos dados e a autenticidade do emissor.

## Configuração de Autenticação com Token JWT
No arquivo principal da api AspNetCore, o Program.cs, configure a autenticação JWT, as configurações realizadas no tutorial anterior permanecem, entretanto ao final do **AddAuthentication** vamos adicionar o **AddJwtBearer** e configura-lo conforme o trecho de codigo abaixo:
```csharp
builder.Services.AddAuthentication(options =>
    {
        // Configurações do tutorial anterior
    })
    .AddCookie(CookieAuthenticationDefaults. AuthenticationScheme, options =>
    {
        // Configurações do tutorial anterior
    })
    .AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
    {
        // Configurações do tutorial anterior
    })
    .AddJwtBearer("JwtBearer", options => 
    {
        options.RequireHttpsMetadata = true;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["seguranca:JwtPrivateKey"])),
            ValidateIssuer = true,
            ValidateAudience = true
        };
    });
```
- AddJwtBearer: Configura middleware de autenticação JWT (JSON Web Token) na aplicação, o "JwtBearer" é apenas um identificador necessário para informar qual middleware o controlador utilizará, lembre-se que configuramos um middleware para o **OpenId** no tutorial anterior e nesse estamos configurando um para o **JWT**, logo esse identificador é necessário para evitar conflitos de middlewares.
  
- RequireHttpsMetadata: Esse comando define se o middleware deve solicitar os metadados HTTPS, caso for **true** apenas conexões do tipo HTTPS serão aceitas caso contrário será aceito conexões do tipo HTTP também, a segunda opção é indicada em apenas para o ambiente de desenvolvimento.

- SaveToken: Define se o token deve ser salvo no contexto http do AspNetCore após a autenticação, o armazenamento é útil caso exista a necessidade de acessar o token em outros pontos do código.

- TokenValidationParameters: Define quais parâmetros serão utilizados para válidar o token.

- IssuerSigningKey: Define a chave para verificar a assinatura do token, neste caso, uma chave simétrica é criada usando **SymmetricSecurityKey** com base em uma chave secreta gerada pelo time de desenvolvimento.

- ValidateIssuer: Define se o emissor do token será utilizado para verificar o token, nesse caso, o emissor desse token será o backend do Conecta Fapes.

- ValidateAudience: Define se o receptor será utilizado para válidar o token, nesse caso o receptor também será o backend do Conecta Fapes. 

> Lembre-se que o token JWT é enviado ao frontend que a cada requisição enviar novamente esse token ao backend, que é o emissor e o receptor desse token. 


Após a configuração do JWT precisamos adicionar esses dois comandos no Program.cs:

```csharp
app.UseAuthentication();  // Adiciona autenticação
app.UseAuthorization();  // Adiciona autorização
```

## Extensão JWT (Gerar Token)

Crie uma classe estática com dois métodos, um para gerar o token e o outro para gerar os claims. 

```
public static class JwtExtension
{
    public static string GenerateJwtToken(UserResponseDTO user, IConfiguration configuration)
    {
        var handler = new JwtSecurityTokenHandler();
        // chave privada
        var key = Encoding.ASCII.GetBytes(configuration["seguranca:JwtPrivateKey"]!);

        var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = GenerateClaims(user),
            Expires = DateTime.UtcNow.AddHours(2),
            SigningCredentials = credentials,
        };


        var token = handler.CreateToken(tokenDescriptor);
        return handler.WriteToken(token);
    }

    private static ClaimsIdentity GenerateClaims(UserResponseDTO user)
    {
        var ci = new ClaimsIdentity();
        // informações do usuário
        ci.AddClaim(new Claim("Id", user.Id.ToString()));
        ci.AddClaim(new Claim(ClaimTypes.Name, user.Email));
        ci.AddClaim(new Claim(ClaimTypes.Email, user.Email));
        ci.AddClaim(new Claim("Cpf", user.Cpf));
        // papeis do usuário no sistema
        foreach (var role in user.Roles)
        {
            ci.AddClaim(new Claim(ClaimTypes.Role, role.Name));
        }

        return ci;
    }

}
```

### Método para gerar o token JWT

- JwtSecurityTokenHandler(): É uma instância de um objeto capaz de gerenciar tokens JWTs.

- Uma chave privada é gerada pelo time de desenvolvimento e armazenada em um arquivo de variáveis de ambiente.

-  SigningCredentials: Define as credenciais utilizadas no token, o **SymmetricSecurityKey** criar uma chave simétrica a partir da **chave privada**, essa chave simétrica é gerada por meio do algoritmo **HMAC SHA-256** de criptogração por meio do comando **SecurityAlgorithms.HmacSha256**.

- SecurityTokenDescriptor: Cria a composição do token e define alguns parâmetros, o **Subject** recebe os dados do usuário,**Expires** define um tempo de válidade desse token, uma vez inválidado ele perde sua utilizade então o usuário pode logar novamente ou um novo token ser gerado e enviado ao cliente automáticamente caso o usuário esteja ativo no sistema, o **SigningCredentials** é a chave simétrica criptografada para assinar o token.

### Método para gerar as Claims

- ClaimsIdentity(): É uma instância de um objeto para gerenciar o armazenamento dos dados do usuário, necessário para o middleware tenha acesso no processo de autenticação. 

- Os claims são adicionados nesse ojeto gerenciador de claims por meio do código **ci.AddClaim(new Claim("Identificador", valor));**. Aqui o desenvolvedor é livre para criar claims customizados e filtrar quais informações serão passadas via token, também é permidito passar as **Roles** do usuário ou seja suas permissões no sistema.

## Rota de autênticação

Lembra da rota (/auth/signed)? A rota que o Acesso Cidadão retorna os dados do usuário ao backend. Uma vez que temos acesso aos dados do usuário precisamos gerar o token, então no mesmo contralador vamos invocar o gerador de tokens.

Após o recebimento das informações do usuário é importante validar se tudo veio corretamente, então um objeto **(CreateUserCommand)** é invocado que verifica se o usuário existe na base do **Conecta Fapes**, caso o mesmo exista ele é retornado junto com suas permissões, caso contrário ele é cadastrado e então retornado.

Por fim invocamos o método **GenerateJwtToken** para gerar o token, passando o usuário e o **_configuration** que é um parâmetro necessário para a função acessar a chave privada que está em um arquivo de variáveis de ambiente.

Então o com o token gerado ele é enviado na rota de **callback** do frontend o qual o cliente terá acesso ao token JWT, repare que nesse redirecionamento o Refresh Token é passado, esse token é utilizado para gerar um novo JWT caso o cliente ainda esteja ativo após o tempo de validade do JWT. Com esse Refresh Token o frontend pode requisitar um novo token JWT.

```csharp
[Route("auth")]
[ApiController]
public class AuthController : ControllerBase
{
    [HttpGet("signed")]
    public IActionResult Callback()
    {
        var nome = this.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
        var email = this.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var cpf = this.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(nome))
        {
            return BadRequest("Nome do usuário não existem no acesso cidadão");
        }

        if (string.IsNullOrEmpty(email) )
        {
            return BadRequest("Email do usuário não existem no acesso cidadão");
        }

        if (string.IsNullOrEmpty(cpf))
        {
            return BadRequest("CPF do usuário não existem no acesso cidadão");
        }

        // 1. Cria um usuário no sistema se ele não existir.
        // 2. Retornar o usuário caso o mesmo já esteja cadastrado.
        CreateUserCommand command = new CreateUserCommand(nome, email, cpf, new List<Role>());
        var response = _mediator.Send(command);

        if (response.Result.StatusCode == 400)
        {
            return BadRequest();
        }

        UserResponseDTO? user = response.Result.Body as UserResponseDTO;

        if (user == null)
        {
            return BadRequest("Usuário não existe!");
        }

        // Gera um token jwt
        var jwt = JwtExtension.GenerateJwtToken(user, _configuration);
        // Redirecione para a página inicial.
        return Redirect(_configuration.GetSection("acesso-cidadao")["frontEndCallbackPath"] + "?" + string.Join("&", $"token={jwt}&refresh_token={user.RefreshToken}"));
    }
```

## Refresh Token

No mesmo arquivo de rotas crie uma rota (refreshtoken) que será resposável por gerar um novo token JWT ao cliente, seu funcionamento é bem simples, o frontend envia o Refresh Token que pode ser um GUID ou qualquer tipo de token gerado, fica a critério do programador. Esse Refresh Token deve ser gerado no momento da criação do usuário na base de dados do **Conecta Fapes** e atualizado toda vez que for utilizado.

Essa rota verifica se existe algum usuário com o Refresh Token na base de dados, se existir esse Refresh Token deve ser atualizado e então um novo token JWT é gerado e por fim os novos Tokens (JWT e Refresh Token) são retornado para a mesma rota de **callback** do frontend.

```csharp
[HttpPost("refreshtoken")]
public IActionResult RefreshToken([FromBody] RefreshTokenCommand command)
{
    var response = _mediator.Send(command);

    if (response.Result.StatusCode != 200)
    {
        return BadRequest();
    }

    UserResponseDTO? user = response.Result.Body as UserResponseDTO;

    if (user == null)
    {
        return BadRequest("Usuário não existe!");
    }

    // Gera um token jwt
    var jwt = JwtExtension.GenerateJwtToken(user, _configuration);

    // Redirecione para a página inicial.
    return Redirect(_configuration.GetSection("acesso-cidadao")["frontEndCallbackPath"] + "?" + string.Join("&", $"token={jwt}&refresh_token={user.RefreshToken}"));
}
```

Pronto com essa configuração você deve conseguir autenticar um usuário com acesso cidadão, gerar um token JWT para o mesmo e então gerenciar o seu acesso na aplicação do **Conecta Fapes**.