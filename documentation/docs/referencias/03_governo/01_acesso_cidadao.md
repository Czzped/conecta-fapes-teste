---
sidebar_position: 1
---
# Acesso Cidadão
A proposta inicial do Acesso Cidadão (AC) foi criar um sistema que centralizasse as informações do cidadão e do servidor público em uma base de dados única, facilitando assim a validação da consistência dos dados e provendo autenticação e autorização de uma forma simples e segura

## Exemplo de Código
1) Primeira coisa é configurar o DataProtection, em geral fazemos no banco de dados: [https://learn.microsoft.com/en-us/aspnet/core/security/data-protection/introduction?view=aspnetcore-8.0](https://learn.microsoft.com/en-us/aspnet/core/security/data-protection/introduction?view=aspnetcore-8.0)

```csharp
_ = builder.Services
    .AddDbContext<DataProtectionKeysContext>(
        options =>
            options.UseSqlServer(sqlServerConnectionString!))
```

2) Em seguida vc configura o login do modo padrão:
[https://learn.microsoft.com/en-us/aspnet/core/security/authentication/?view=aspnetcore-8.0](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/?view=aspnetcore-8.0)

```csharp
// AUTHENTICATION
// Precisa disso para não mapear as claims do acesso cidadão para claims padrão tipo http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier
// Pode colocar e remover essa configuração para ver como as claims ficam.
JwtSecurityTokenHandler.DefaultMapInboundClaims = false;
_ = webApplicationBuilder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = "Cookies";
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
    .AddCookie("Cookies", options =>
    {
        // Pode apontar para a página que quiserem
        options.AccessDeniedPath = "/Error/AcessoNegado";

        // Precisa disso para não deslogar a cada 5 minutos. 4 horas é um tempo padrão bom para a maioria dos sistemas.
        // Se precisar de usar o access token para alguma coisa, tipo api do e-docs, tem que ser um tempo menor, tipo 1 hora que é a validade padrão dele.
        options.ExpireTimeSpan = TimeSpan.FromHours(4);
        options.Cookie.Name = "a"; // Authentication, nome customizado opcional

  // Essa parte de eventos é totalmente opcional e usada só para debugar e testar os retorno da api, bom para ver como o protocolo funciona
       // Na versão final remover isso!!!
        options.Events = new CookieAuthenticationEvents
        {
            OnValidatePrincipal = async context =>
            {
                var teste = 1;
            },
            OnCheckSlidingExpiration = async context =>
            {
                var teste = 1;
            },
        };
    })
    .AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
    {
        options.Authority = webApplicationBuilder.Configuration.GetValue<string>("LoginClient:Authority"); //"https://acessocidadao.es.gov.br/is/" o well-known fica nesse caminho
        options.ClientId = webApplicationBuilder.Configuration.GetValue<string>("LoginClient:ClientId"); // pegar no admin
        options.ClientSecret = webApplicationBuilder.Configuration.GetValue<string>("LoginClient:ClientSecret"); // pegar no admin
        options.ResponseType = "code";

        options.UsePkce = false;

        options.Scope.Add("profile");
        options.Scope.Add("openid");
   // Adicionar mais scopes conforme o sistema necessitar

        // Precisa disso para buscar todas as claims do usuário que os scopes permitem consultar
        options.GetClaimsFromUserInfoEndpoint = true;

        // Tem que mapear todas as claims que você quiser, ver o mapAll abaixo para pegar tudo antes de filtrar só o que precisa
        options.ClaimActions.MapJsonKey("apelido", "apelido");
        options.ClaimActions.MapJsonKey("role", "role");

        // Por padrão só costuma vir sub, auth_time, idp, subNovo, amr, name e email
        // Faz um mapAll, analisa o que vem e depois mapeia só o que precisar

        // Precisa disso para setar a claim de role e name do objeto User do httpContext. Se quiser por exemplo que a claim "nome", em português, seja reconhecida como name
        options.TokenValidationParameters = new TokenValidationParameters
        {
            NameClaimType = "apelido",
            RoleClaimType = JwtClaimTypes.Role,
        };

        options.SaveTokens = false; //Se for usar api que precisa de access token de usuário tem que ligar isso
        options.UseTokenLifetime = false; // O tempo de vida do access token de usuário é 1h por padrão, o de identidade 5 minutos

        options.Events = new OpenIdConnectEvents
        {
            OnUserInformationReceived = async context =>
            {
                var identity = context.Principal?.Identities.First();

                if (identity != null)
                {
                    var serviceProvider = context.HttpContext.RequestServices;
                    var permissaoService =
                        serviceProvider.GetRequiredService<IAutorizacaoService>();

                    identity.AddClaim(new Claim("teste", "valor de teste")); // É assim que se adiciona claims customizadas

                    var autorizado =
                        await permissaoService.GerarRoleClaimsNoIdentityOriginal(identity); // É nesse serviço que vc vai na api do acesso cidadão e busca qualquer informação extra que precisar durante o login para fazer autorização, eu recomendo adicionar roles aqui!!!!
                    if (autorizado.IsFailure)
                    {
                        context.Fail("Não foi possível fazer a autorização do usuário!");
                    }
                }
            },
        };
    });
```

3) Autorização: Sempre que possível recomendo usar o padrão com o mínimo de customização possível. Fica mais fácil de auditar e resolver problema de segurança (e evitar erros): https://learn.microsoft.com/en-us/aspnet/core/security/authorization/introduction?view=aspnetcore-8.0 .Por padrão a mais simples costuma ser autorização por role:
```csharp
_ = webApplicationBuilder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();

    options.AddPolicy(
        AutorizacaoConstantes.AdministradorPolicy,
        policyBuilder => policyBuilder
            .RequireRole(AutorizacaoConstantes.RoleAdministrador));

    options.AddPolicy(
        AutorizacaoConstantes.LogadoPolicy,
        policyBuilder => policyBuilder
            .RequireAuthenticatedUser());

    options.AddPolicy(AutorizacaoConstantes.ComissoesPolicy, policyBuilder =>
    {
        _ = policyBuilder.RequireAssertion(context =>
            context.User.IsInRole(AutorizacaoConstantes.RoleAdministrador) ||
            context.User.IsInRole(AutorizacaoConstantes.RoleAcessoComissoes));
    });
}
```
## Links

* [Documentação do Desenvolvedor](https://docs.developer.acessocidadao.es.gov.br/)