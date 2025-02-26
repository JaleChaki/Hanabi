using Hanabi.Models;
using Hanabi.Game;
using Hanabi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using System.Security.Principal;

namespace Hanabi.Hubs;
public class NameIdentity : IIdentity {
    string _name;
    public NameIdentity(string name) {
        _name = name;
    }
    public string AuthenticationType => JwtBearerDefaults.AuthenticationScheme;
    public bool IsAuthenticated => true;
    public string Name => _name;
    public string NameIdentifier => _name;
    public string NameClaimType = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

}
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class GameHub : Hub {
    Dictionary<string, string> ClientIds;
    public GameHub(GameService gameService) {
        GameService = gameService;
        ClientIds = new();
    }

    private GameService GameService { get; }
    

    public async Task GetGameState() {
        var userName = Context.User.Identity.Name;
        var userId = GetPlayerGuid(userName);
        // TODO: check if we sill need some of the things below
        // Context.User.AddIdentity(new ClaimsIdentity(new NameIdentity(userId.ToString())));
        Context.User.AddIdentity(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) }));
        // Context.User.FindFirst(ClaimTypes.Name)
        // Context.User.AddIdentity(new System.Security.Claims.ClaimsIdentity(new NameIdentity(userName)));
        GameService.RegisterPlayer(userName, Context.ConnectionId);
        // GameService.RegisterPlayer(userName, Context.UserIdentifier); // !!!
        await Clients.Caller.SendAsync("SetGameState", GameService.GetGameState(userId));
    }

    public async Task ScheduleGameStateUpdate() {
        await Clients.All.SendAsync("RequestUpdate");
    }

    public async Task MakeColorHint(string targetPlayerNickname, int color) {
        var userId = GetPlayerGuid(Context.User.Identity.Name);
        var targetPlayerId = GetPlayerGuid(targetPlayerNickname);
        GameService.GetController(userId).MakeHint(userId, targetPlayerId, HintOptions.FromCardColor(color));
        await ScheduleGameStateUpdate();
    }

    public async Task MakeNumberHint(string targetPlayerNickname, int number) {
        var userId = GetPlayerGuid(Context.User.Identity.Name);
        var targetPlayerId = GetPlayerGuid(targetPlayerNickname);
        GameService.GetController(userId).MakeHint(userId, targetPlayerId, HintOptions.FromCardNumber(number));
        await ScheduleGameStateUpdate();
    }

    public async Task DropCard(int cardIndex) {
        var userId = GetPlayerGuid(Context.User.Identity.Name);
        GameService.GetController(userId).DropCard(userId, cardIndex);
        await ScheduleGameStateUpdate();
    }

    public async Task PlayCard(int cardIndex) {
        var userId = GetPlayerGuid(Context.User.Identity.Name);
        GameService.GetController(userId).PlayCard(userId, cardIndex);
        await ScheduleGameStateUpdate();
    }

    private Guid GetPlayerGuid(string nickname) => nickname switch { // TODO
            "staziz" => Guid.Parse("6478E542-4E96-421B-987F-767A3171B766"),
            "jalechaki" => Guid.Parse("1744A9C2-C357-48BE-B955-50374801877A"),
            "test_player" => Guid.Parse("E05E5FA4-DA8C-4CBC-B9DB-231BAE63A970"),
            _ => throw new ArgumentOutOfRangeException(nameof(nickname), $"Player with nickname '{nickname}' does not exist in current game")
    };
    public override Task OnConnectedAsync() {
        Console.WriteLine("New connection!");
        // this.Clients.Client("XGgSrccsRa6o5GNKkimp9w").SendAsync()
        // this.Clients.User("XGgSrccsRa6o5GNKkimp9w")
        ClientIds.Add(Context.User.Identity.Name, Context.ConnectionId);
        return base.OnConnectedAsync();
    }
}