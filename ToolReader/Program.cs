using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Reflection;
using System.Text;
using WebApi;


var builder = WebApplication.CreateBuilder(args);

ConfigurationManager configuration = builder.Configuration;
IWebHostEnvironment environment = builder.Environment;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = configuration["Authentication:Jwt:Issuer"],
                        ValidAudience = configuration["Authentication:Jwt:Issuer"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Authentication:Jwt:Key"]))
                    };
                });
builder.Services.AddAuthorization(options =>
{
    options.DefaultPolicy = new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme)
        .RequireAuthenticatedUser()
        .Build();
});


//var settings = builder.Configuration.GetSection("AppSettings").Get<AppSettings>();
//set static WebConfigs
WebConfigs.WebRootPath = environment.WebRootPath;
WebConfigs.ContentRootPath = environment.ContentRootPath;
//WebConfigs.AppSettings = settings;
WebConfigs.AppSettings = builder.Configuration.GetSection("AppSettings").Get<AppSettings>();
WebConfigs.ConnectionStrings = builder.Configuration.GetSection("ConnectionStrings").Get<ConnectionStrings>();
WebConfigs.Authentication = builder.Configuration.GetSection("Authentication").Get<Authentication>();
// Add services to the container.

//builder.Services.AddControllers();
builder.Services.AddControllersWithViews().AddNewtonsoftJson();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "EReader Web API",
    });

    c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.OAuth2,
        Flows = new OpenApiOAuthFlows
        {
            ClientCredentials = new OpenApiOAuthFlow
            {
                TokenUrl = new Uri("../../api/auth/token", UriKind.Relative)
            },

        },
    });
    c.OperationFilter<SecurityRequirementsOperationFilter>();

    //// Set the comments path for the Swagger JSON and UI.
    //var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    //var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    //c.IncludeXmlComments(xmlPath);
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// If using Kestrel:
builder.Services.Configure<KestrelServerOptions>(options =>
{
    options.AllowSynchronousIO = true;
});

// If using IIS:
builder.Services.Configure<IISServerOptions>(options =>
{
    options.AllowSynchronousIO = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
if (WebConfigs.AppSettings.PublicSwagger == true
    || app.Environment.IsDevelopment()
    )
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
//Enable Cors All app
app.UseCors(builder =>
    builder
        //.WithOrigins(appSettings.Value.AllowOrigins != null ? appSettings.Value.AllowOrigins.Split(',') : new string[] { "*" })
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader()
        //.AllowCredentials()
        .SetIsOriginAllowedToAllowWildcardSubdomains()
);
app.UseRouting();
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();
