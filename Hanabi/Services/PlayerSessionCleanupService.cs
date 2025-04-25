using Hanabi.Hubs;
using Hanabi.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;

namespace Hanabi.Services;

public sealed class PlayerSessionCleanupService(
    GameService gameService, 
    IHubContext<GameHub> hub, 
    IPlayerSessionStoreService playerSessionStore, 
    IOptions<PlayerSessionOptions> playerSessionOptions
) : BackgroundService {
    protected override async Task ExecuteAsync(CancellationToken stop) {
        while (!stop.IsCancellationRequested) {
            foreach (var playerId in playerSessionStore.CollectExpired()) {
                try {
                    gameService.TerminateGame(playerId);
                    await hub.Clients.All.SendAsync("RequestUpdate", stop);
                } catch (Exception e) {
                    // swallow or log – a stale player can already be gone
                }
            }
            playerSessionStore.CleanupExpired();
            await Task.Delay(playerSessionOptions.Value.GraceTimeout, stop);
        }
    }
}
