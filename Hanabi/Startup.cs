using Hanabi.Hubs;
using Hanabi.Services;

namespace Hanabi {
    public class Startup {
        public void ConfigureServices(IServiceCollection services) {
            services.AddControllers();

            services.AddSingleton<GameStateKeeper>();

            services.AddSignalR();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment environment) {
            if(!environment.IsDevelopment()) {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();

            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();
                endpoints.MapHub<GameHub>("/gamehub");
                endpoints.MapHub<TestHub>("/testhub");
                endpoints.MapFallbackToFile("index.html");
            });
        }
    }
}