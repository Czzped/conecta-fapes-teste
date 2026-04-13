---
sidebar_position: 04
title: "Integração Acesso Cidadão"
---

# Integração Acesso Cidadão

## O que é o Acesso Cidadão ?
O **Acesso Cidadão** é um sistema que centraliza as informações dos servidores públicos do estado do Espírito Santo, além disso, a plataforma disponibiliza serviços de autenticação e autorização de usuários em sistemas externos por meio do **OpenId**.

## O que é o OpenId ?

O **OpenId** é um protocolo de autenticação capaz de interagir com outros sistemas, baseado na estrutura do **OAuth 2.0** o **OpenId** simplifica a verificação de identidade dos usuários com base na autenticação realizada por um servidor de identificação, no caso do Conecta Fapes esse servidor é o **Acesso Cidadão**.

## Configuração de Autenticação
No arquivo principal da api AspNetCore, o Program.cs, configure a autenticação conforme o trecho de codigo abaixo:

```csharp
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
```

- builder.services.AddAuthentication: Esta função configura o serviço de autenticação ao pipeline de serviços da api, definindo as opções padrão que serão usadas para autenticar os usuários e desafiar **(challenge)** o usuário para fornecer credenciais de autenticação.
  
- Por padrão o **OpenId** utiliza cookies para armazenar e validar as informações de autenticação do usuário, por isso o foi definido como mecanismo principal para autenticação e realizar o desafio **(challenge)**.
  
> **Challenge** é o processo o qual a aplicação solicita ao usuário que forneça suas credenciais ou aceite uma forma de autenticação. No contexto do **OpenId** isso significa redirecionar o usuário para um provedor de identidade para que o usuário possa se autenticar.

## Configuração dos Cookies

```csharp
.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
{
    options.Cookie.Name = "oidc-conecta-fapes";
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.None;
    options.ExpireTimeSpan = TimeSpan.FromSeconds(3600);
    options.SlidingExpiration = true;
    options.AccessDeniedPath = "/auth/not-authorized";
    options.LogoutPath = "/auth/logout";
})
```
- Cookie.Name: É um identificador do cookie.

- Cookie.SecurePolicy: O **SecurePolicy** determinar se um cookie deve ser enviado apenas em conexões seguras, o **CookieSecurePolicy.Always** define que ele só será enviado ao servidor em uma conexão do tipo HTTPS, ou seja, apenas conexões seguras.

- Cookie.SameSite: Configura o comportamento do envio de cookies em diferentes contextos, como requisições de mesmo site ou de terceiros, além disso, define como os cookies são compartilhados entre diferentes sites, o que é importante para prevenir ataques como Cross-Site Request Forgery (CSRF). A opção **SameSiteMode.None** Define que o cookie será enviado em todas as situações, incluindo requisições de terceiros, de modo que permita o uso de provedores de autenticação de terceiros como o (OpenID OAuth, etc.). 
> Para habilitar o **SameSiteMode.None** o **SecurityPolicy** deve ser definido como **CookieSecurePolicy.Always**.


- ExpireTimeSpan: Define o tempo de expiração para o cookie em segundos, no exemplo acima o cookie deve expirar dentro de 1 hora.

- SlidingExpiration: Define se o tempo de expiração do cookie deve ser prolongado, caso definida como **true**, o tempo de expiração do token será prolongado conforme o momemento da última requisição do usuário.

- AccessDeniedPath: Rota de redirecionamento caso o usuário não seja autênticado.

- LogoutPath: Rota de redirecionamento após o **logout** do usuário do sistema.

## Configuração do **OpenId**

Agora vamos configurar o **middleware** de autenticação baseado no protocolo **OpenId**.

> Middleware é um componente de software usado em aplicações web para processar requisições HTTP. Em termos simples, middleware é um pedaço de código que fica no meio do caminho entre a solicitação do cliente e a resposta do servidor.

```csharp
.AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
{
    var configuration = builder.Configuration.GetSection("acesso-cidadao");
    options.Authority = configuration["authority"];
    options.ClientId = configuration["clientId"];
    options.ClientSecret = configuration["secret"];
    options.CallbackPath = configuration["callbackPath"];
    options.ResponseType = "code id_token";
    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.GetClaimsFromUserInfoEndpoint = true;
    options.SkipUnrecognizedRequests = true;
    ...
});
```

- Authority: Configura a autoridade (URL) do provedor de identidade **(Acesso Cidadão)**.

- ClientId: O identificador do cliente (ID da aplicação) registrado no provedor de identidade, usado para identificar a aplicação no servidor provedor de identidade.

- ClientSecret: O segredo do cliente que é usado em conjunto com o ClientId para autenticar a aplicação com o provedor de identidade.

- CallbackPath: O caminho (URL relativa) para onde o provedor de identidade redirecionará o usuário após uma tentativa de autenticação bem-sucedida. Este é o endpoint onde a aplicação receberá o token de autorização, fica a critério do programador definir esse endpoint.

- ResponseType: Define o tipo de resposta que a aplicação espera do servidor de identidade. O valor **code id_token** indica que a aplicação quer tanto o código de autorização quanto o token de identidade.

- SignInScheme: Define o esquema de autenticação a ser usado para o login. Aqui, ele usa o esquema padrão de autenticação baseado em cookies conforme o padrão do **OpenId**.

- GetClaimsFromUserInfoEndpoint: Se definido como true, faz com que a aplicação obtenha informações adicionais sobre o usuário **(claims)** diretamente do endpoint userinfo do provedor de identidade.

- SkipUnrecognizedRequests: Ignora solicitações que não são reconhecidas ou que não precisam de autenticação. Definir como true permite que a aplicação ignore essas solicitações sem falhas.

Ainda dentro do método de configuração do **OpenId** precisamos definir o validador de parâmetros bem como quais informações do usuário vamos requisitar ao provedor de identidade.

> O **Authority** está disponível na documentação do [acesso cidadão](https://docs.developer.acessocidadao.es.gov.br/), nessa implementação foi utilizada a rota: "https://acessocidadao.es.gov.br/is", o **ClientId** e **ClientSecret** são acessíveis via painel de ADMIN do Acesso Cidadão. O **callbackPath** e o **frontEndCallbackPath** (será abordado à frente) são definidos pelos desenvolvedores, além disso, é necessário que essas rotas de **callback** sejam registradas no painel de ADMIN do Acesso Cidadão para serem autorizadas pelo provedor de identidade o redirecionamento.

```csharp
.AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
{
    ...
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateLifetime = true,
        ValidateIssuer = true,
        ValidateIssuerSigningKey = true,
    };
    options.Scope.Add("openid");
    options.Scope.Add("profile");
    options.Scope.Add("cpf");
    options.Scope.Add("email");
});
```

- ValidateLifetime: Verifica se o token de segurança (token JWT) recebido está dentro do período de validade. Isso ajuda a garantir que o token não tenha expirado.

- ValidateIssuer: Verifica se o emissor do token é o provedor de identidade esperado, garantindo que o token tenha sido emitido por uma fonte confiável.

- ValidateIssuerSigningKey: Verifica se a chave usada para assinar o token é válida, garantindo a integridade do token e que ele não foi manipulado.

- As informações do usuário que serão requisitadas ao provedor de identidade são: o openid que é o obrigatório em todas solicitações por meio desse protocolo, profile que são informações básicas do usuário, cpf e email.

Por fim precisamos definir o comportamento do **OpenId** nos casos de sucesso e falha na autorização do usuário.

```csharp
.AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
{
    ...
    options.Events = new OpenIdConnectEvents
    {
        OnUserInformationReceived = context =>
        {
            var nome = context.User.RootElement.GetProperty("apelido");
            var cpf = context.User.RootElement.GetProperty("cpf");
            var email = context.User.RootElement.GetProperty("email");

            var identity = new ClaimsIdentity(OpenIdConnectDefaults.AuthenticationScheme);
            identity.AddClaim(new Claim(ClaimTypes.Name, nome.ToString()));
            identity.AddClaim(new Claim(ClaimTypes.Email, email.ToString()));
            identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, cpf.ToString()));

            context.Principal = new ClaimsPrincipal(identity);

            return Task.CompletedTask;
        },

        OnAuthenticationFailed = context =>
        {
            context.HandleResponse();
            context.Response.Redirect("/error");
            return Task.CompletedTask;
        }

    };
});
```

- options.Events: Configura eventos específicos que ocorrem durante o fluxo de autenticação. Aqui, dois eventos são configurados: **OnUserInformationReceived** e **OnAuthenticationFailed**.

- **OnUserInformationReceived**: Este evento é acionado quando a aplicação recebe as informações do usuário do provedor de identidade.

- context.User.RootElement.GetProperty(...): Obtém propriedades específicas do objeto JSON que representa os dados do usuário. Neste caso, ele está acessando os valores dos campos apelido, cpf e email.

- Criação de uma Identidade Customizada: cria uma nova identidade baseada no esquema de autenticação **OpenID**,
identity.AddClaim(...) adiciona as claims à identidade.

- A Claim principal é definida como as informações básicas sobre o usuário enviada pelo provedor de identidade.

- **OnAuthenticationFailed**: Este evento é acionado se houver uma falha durante o processo de autenticação.

- context.HandleResponse(): Impede o pipeline padrão de processamento da resposta, assumindo o controle da resposta HTTP.

- context.Response.Redirect("/error"): Redireciona o usuário para uma página de erro (/error) quando a autenticação falha.

## Configuração das Rotas

A rota abaixo é utilizada para login do usuário, ao se requisitada pelo cliente ela inicia o desafio **(challenge)** redirecionando o usuário para a tela de login do acesso cidadão, após isso, caso a autenticação seja realizada com sucesso os dados são enviados ao sistema por meio da rota de **callback** definida pelo programador, assim o mesmo tem acesso as informações do usuário podendo autenticar o usuário.

```csharp
[Route("auth")]
[ApiController]
public class AuthController : ControllerBase
{
    ...
    [HttpGet]
    public IActionResult Login()
    {
        var properties = new AuthenticationProperties
        {
            RedirectUri = _configuration.GetSection("acesso-cidadao")["callbackPath"]
        };
        return Challenge(properties, OpenIdConnectDefaults.AuthenticationScheme);
    }
    ...
}
```

Então os dados são acessados pelo sistema por meio do redirecionamento a essa rota após autenticação no **Acesso Cidadão**, os dados do usuário são dispinibilizado por meio do contexto http **(HttpContext)** que vem do fluxo da rota anterior. Você pode criar uma função para gerar um token para ser retornado ao cliente.
```csharp
[Route("auth")]
[ApiController]
public class AuthController : ControllerBase
{
    ...
    [HttpGet("signed")]
    public IActionResult Callback()
    {
        var nome = this.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
        var email = this.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var cpf = this.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        var user = new {
            nome: nome,
            email: email,
            cpf: cpf
        }

        // Gera um token jwt
        var jwt = JwtExtension.GenerateJwtToken(user);
        // Redirecione para a página inicial.
        return Redirect(_configuration.GetSection("acesso-cidadao")["frontEndCallbackPath"] + "?" + string.Join("&", $"token={jwt}");
    }
}
```
> Nota: o cliente (frontend) irá requisitar o login por meio da primeira rota (/auth), que redirecionará o usuário ao **Acesso Cidadão**, após a autenticação do usuário o provedor de identidade envia os dados para a segunda rota (/auth/signed) onde o backend terá acesso a esses dados e então poderá realizar alguma decisão, com isso o backend redireciona o cliente (frontend) para a rota definida como **frontEndCallbackPath** que fica a critério dos desenvolvedores definirem essa rota, por meio dela o frontend terá acesso ao token ou a permissão do usuário.

No próximo tutorial será abordado como autenticar o usuário do lado do backend e gerar o token.