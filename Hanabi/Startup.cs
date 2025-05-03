using System.Text;
using Hanabi.Hubs;
using Hanabi.Models;
using Hanabi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;

namespace Hanabi;
public class Startup {
    public Startup(IConfiguration configuration) {
        Configuration = configuration;
    }

    private IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services) {
        services
            .AddControllers()
            .AddNewtonsoftJson(options => {
                options.SerializerSettings.ContractResolver = new DefaultContractResolver();
            });

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => {
                options.TokenValidationParameters = new TokenValidationParameters {
                    // TODO
                    ValidateIssuer = true,
                    ValidIssuer = Configuration["Issuer"],
                    ValidateAudience = true,
                    ValidAudience = Configuration["Audience"],
                    ValidateLifetime = false,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration["SignKey"]))
                };

                // refers to https://docs.microsoft.com/en-us/aspnet/core/signalr/authn-and-authz?view=aspnetcore-6.0#built-in-jwt-authentication
                options.Events = new JwtBearerEvents {
                    OnMessageReceived = context => {
                        var accessToken = context.Request.Query["access_token"];

                        var path = context.HttpContext.Request.Path;
                        if(!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/gamehub"))
                            context.Token = accessToken;

                        return Task.CompletedTask;
                    }
                };
            });

        services.AddSingleton<AccountService>();
        services.AddSingleton<IGameService, GameService>();
        services.AddOptions<PlayerSessionOptions>().BindConfiguration("Session").ValidateOnStart().ValidateDataAnnotations();
        services.AddHostedService<PlayerSessionCleanupService>();

        services.AddSignalR();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment environment) {
        if(!environment.IsDevelopment()) {
            app.UseHsts();
        }

        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(endpoints => {
            endpoints.MapControllers();
            endpoints.MapHub<GameHub>("/gamehub", options => {
                options.AllowStatefulReconnects = true;
            });
            endpoints.MapFallbackToFile("index.html");
        });
    }
}