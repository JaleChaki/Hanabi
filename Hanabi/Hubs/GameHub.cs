using Hanabi.Models;
using Hanabi.Game;
using Hanabi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Principal;
using Hanabi.Exceptions;

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
public class GameHub(IPlayerSessionStoreService playerSessionStore, GameService gameService) : Hub {
    Dictionary<string, string> ClientIds = new();
    
    public bool RegisterPlayer(string userNickName) {
        var userId = GetRequestPlayerGuid();
        gameService.RegisterOrUpdatePlayer(userId, userNickName, Context.ConnectionId);
        return true;
    }

    public async Task<bool> CreateGame() {
        var userId = GetRequestPlayerGuid();
        gameService.CreateGame(userId);
        await ScheduleGameStateUpdate();
        return true;
    }

    public async Task<bool> JoinGame(string gameLink) {
        var userId = GetRequestPlayerGuid();
        try {
            gameService.JoinGame(gameLink.FromUrlSafeShortString(), userId);
            await ScheduleGameStateUpdate();
            return true;
        } catch (GameExceptionBase e) {
            await Clients.Caller.SendAsync("Error", e.Message);
            return false;
        }
    }

    public async Task LeaveGame() {
        gameService.LeaveGame(GetRequestPlayerGuid(), true);
        await ScheduleGameStateUpdate();
    }

    public async Task StartGame() {
        var userId = GetRequestPlayerGuid();
        gameService.StartGame(userId);
        await ScheduleGameStateUpdate();
    }

    public async Task<bool> GetGameState() {
        var userId = GetRequestPlayerGuid();
        try {
            await Clients.Caller.SendAsync("SetGameState", gameService.GetGameState(userId));
            return true;
        } catch {
            return false;
        }
    }

    public async Task ScheduleGameStateUpdate() {
        await Clients.All.SendAsync("RequestUpdate");
    }

    public async Task MakeColorHint(string targetPlayerNickname, int color) {
        var userId = GetRequestPlayerGuid();
        var targetPlayerId = GetPlayerGuid(targetPlayerNickname);
        gameService.GetSessionManagerByPlayer(userId).MakeHint(userId, targetPlayerId, HintOptions.FromCardColor(color));
        await ScheduleGameStateUpdate();
    }

    public async Task MakeNumberHint(string targetPlayerNickname, int number) {
        var userId = GetRequestPlayerGuid();
        var targetPlayerId = GetPlayerGuid(targetPlayerNickname);
        gameService.GetSessionManagerByPlayer(userId).MakeHint(userId, targetPlayerId, HintOptions.FromCardNumber(number));
        await ScheduleGameStateUpdate();
    }

    public async Task DropCard(int cardIndex) {
        var userId = GetRequestPlayerGuid();
        gameService.GetSessionManagerByPlayer(userId).DropCard(userId, cardIndex);
        await ScheduleGameStateUpdate();
    }

    public async Task PlayCard(int cardIndex) {
        var userId = GetRequestPlayerGuid();
        gameService.GetSessionManagerByPlayer(userId).PlayCard(userId, cardIndex);
        await ScheduleGameStateUpdate();
    }

    private Guid GetPlayerGuid(string userIdString) => Guid.Parse(userIdString);
    private Guid GetRequestPlayerGuid() => GetPlayerGuid(Context.User.Identity.Name);
    public override async Task OnConnectedAsync() {
        ClientIds.Add(Context.User.Identity.Name, Context.ConnectionId);
        var userId = GetRequestPlayerGuid();
        playerSessionStore.AddOrUpdateSession(userId, Context.ConnectionId);
        if(gameService.TryReconnect(userId, Context.ConnectionId)) {
            await ScheduleGameStateUpdate();
        }
        await base.OnConnectedAsync();
    }
    public override async Task OnDisconnectedAsync(Exception exception) {
        ClientIds.Remove(Context.User.Identity.Name);
        var userId = GetRequestPlayerGuid();
        playerSessionStore.MarkDisconnected(userId);
        gameService.LeaveGame(GetRequestPlayerGuid(), false);
        await ScheduleGameStateUpdate();
        await base.OnDisconnectedAsync(exception);
    }
}