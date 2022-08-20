using Hanabi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Hanabi.Hubs {

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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