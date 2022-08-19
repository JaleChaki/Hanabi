using Hanabi.Services;
using Microsoft.AspNetCore.SignalR;

namespace Hanabi.Hubs {
    public class GameHub : Hub {

        public GameHub(GameStateKeeper gameStateKeeper) {
            GameStateKeeper = gameStateKeeper;
        }

        private GameStateKeeper GameStateKeeper { get; }

        public async Task GetGameState() {
            await Clients.Caller.SendAsync("SetGameState", GameStateKeeper.GetGameState());
        }

    }
}