namespace Hanabi {
    public class Startup {

        public void ConfigureServices(IServiceCollection services) {
            services.AddControllers();
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
                endpoints.MapFallbackToFile("index.html");
            });
        }
    }
}