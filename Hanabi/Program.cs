namespace Hanabi {
    internal static class Program {
        public static void Main(string[] args) {
            var builder = CreateHostBuilder(args);
            builder.ConfigureServices(s => { s.AddSignalR(); });
            builder.Build().Run();
        }

        private static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => webBuilder.UseStartup<Startup>());
    }
}