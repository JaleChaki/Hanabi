using Hanabi.Models;
using Hanabi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Hanabi.Hubs {

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class GameHub : Hub {

        public GameHub(GameService gameService) {
            GameService = gameService;
        }

        private GameService GameService { get; }

        public async Task GetGameState() {
            var userId = GetUserGuid(Context.User.Identity.Name);
            await Clients.Caller.SendAsync("SetGameState", GameService.GetGameState(userId));
        }

        public Task MakeColorHint(string targetPlayerNickname, int color) {
            var userId = GetUserGuid(Context.User.Identity.Name);
            var targetPlayerId = GetUserGuid(targetPlayerNickname);
            GameService.GetController(userId).MakeHint(userId, targetPlayerId, HintOptions.FromCardColor(color));
            return Task.CompletedTask;
        }

        public Task MakeNumberHint(string targetPlayerNickname, int number) {
            var userId = GetUserGuid(Context.User.Identity.Name);
            var targetPlayerId = GetUserGuid(targetPlayerNickname);
            GameService.GetController(userId).MakeHint(userId, targetPlayerId, HintOptions.FromCardNumber(number));
            return Task.CompletedTask;
        }

        public Task DropCard(int cardIndex) {
            var userId = GetUserGuid(Context.User.Identity.Name);
            GameService.GetController(userId).DropCard(userId, cardIndex);
            return Task.CompletedTask;
        }

        public Task PlayCard(int cardIndex) {
            var userId = GetUserGuid(Context.User.Identity.Name);
            GameService.GetController(userId).PlayCard(userId, cardIndex);
            return Task.CompletedTask;
        }

        private Guid GetUserGuid(string nickname) {
            // TODO
            return nickname == "staziz" ? Guid.Parse("6478E542-4E96-421B-987F-767A3171B766") : Guid.Parse("1744A9C2-C357-48BE-B955-50374801877A");
        }

    }
}