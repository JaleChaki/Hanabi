using Hanabi.Hubs;
using Hanabi.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;

namespace Hanabi.Services;

public sealed class PlayerSessionCleanupService(
    IGameService gameService, 
    IHubContext<GameHub> hub,  
    IOptions<PlayerSessionOptions> playerSessionOptions
) : BackgroundService {
    protected override async Task ExecuteAsync(CancellationToken stop) {
        while (!stop.IsCancellationRequested) {
            foreach (var playerId in gameService.CollectExpired()) {
                try {
                    gameService.TerminateGame(playerId);
                    await hub.Clients.All.SendAsync("RequestUpdate", stop);
                } catch (Exception e) {
                    // swallow or log – a stale player can already be gone
                }
            }
            gameService.CleanupExpired();
            await Task.Delay(playerSessionOptions.Value.GraceTimeout, stop);
        }
    }
}
