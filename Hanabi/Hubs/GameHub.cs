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
    
    public bool RegisterPlayer(string userNickName) {
        var userId = GetRequestPlayerGuid();
        GameService.RegisterOrUpdatePlayer(userId, userNickName, Context.ConnectionId);
        return true;
    }

    public async Task<bool> CreateGame() {
        var userId = GetRequestPlayerGuid();
        GameService.CreateGame(userId);
        await ScheduleGameStateUpdate();
        return true;
    }

    public async Task<bool> JoinGame(string gameLink) {
        var userId = GetRequestPlayerGuid();
        GameService.JoinGame(gameLink.FromUrlSafeShortString(), userId);
        await ScheduleGameStateUpdate();
        return true;
    }

    public async Task StartGame() {
        var userId = GetRequestPlayerGuid();
        GameService.StartGame(userId);
        await ScheduleGameStateUpdate();
    }

    public async Task GetGameState() {
        var userId = GetRequestPlayerGuid();
        await Clients.Caller.SendAsync("SetGameState", GameService.GetGameState(userId));
    }

    public async Task ScheduleGameStateUpdate() {
        await Clients.All.SendAsync("RequestUpdate");
    }

    public async Task MakeColorHint(string targetPlayerNickname, int color) {
        var userId = GetRequestPlayerGuid();
        var targetPlayerId = GetPlayerGuid(targetPlayerNickname);
        GameService.GetSessionManagerByPlayer(userId).MakeHint(userId, targetPlayerId, HintOptions.FromCardColor(color));
        await ScheduleGameStateUpdate();
    }

    public async Task MakeNumberHint(string targetPlayerNickname, int number) {
        var userId = GetRequestPlayerGuid();
        var targetPlayerId = GetPlayerGuid(targetPlayerNickname);
        GameService.GetSessionManagerByPlayer(userId).MakeHint(userId, targetPlayerId, HintOptions.FromCardNumber(number));
        await ScheduleGameStateUpdate();
    }

    public async Task DropCard(int cardIndex) {
        var userId = GetRequestPlayerGuid();
        GameService.GetSessionManagerByPlayer(userId).DropCard(userId, cardIndex);
        await ScheduleGameStateUpdate();
    }

    public async Task PlayCard(int cardIndex) {
        var userId = GetRequestPlayerGuid();
        GameService.GetSessionManagerByPlayer(userId).PlayCard(userId, cardIndex);
        await ScheduleGameStateUpdate();
    }

    private Guid GetPlayerGuid(string userIdString) => Guid.Parse(userIdString);
    private Guid GetRequestPlayerGuid() => GetPlayerGuid(Context.User.Identity.Name);
    public override Task OnConnectedAsync() {
        Console.WriteLine("New connection!");
        // this.Clients.Client("XGgSrccsRa6o5GNKkimp9w").SendAsync()
        // this.Clients.User("XGgSrccsRa6o5GNKkimp9w")
        ClientIds.Add(Context.User.Identity.Name, Context.ConnectionId);
        return base.OnConnectedAsync();
    }
}