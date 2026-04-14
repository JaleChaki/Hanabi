using System.Collections.Concurrent;
using Hanabi.Exceptions;
using Hanabi.Game;
using Hanabi.Models;
using Microsoft.Extensions.Options;

namespace Hanabi.Services;

public interface IGameService {
    void RegisterOrUpdatePlayer(Guid playerId, string nickname, string connectionId);
    void ChangeNickname(Guid playerId, string newNickname);
    Guid CreateGame(Guid playerId);
    void JoinGame(Guid gameId, Guid playerId);
    void TryRejoin(Guid playerId);
    void TryReconnect(Guid playerId, string connectionId);
    void StartGame(Guid playerId);
    void TerminateGame(Guid playerId);
    void LeaveGame(Guid playerId, bool isItentionally);
    string GetPlayerConnectionId(Guid playerId);
    GameSessionManager GetSessionManagerByPlayer(Guid playerId);
    SerializedGameState GetGameState(Guid playerId);
    void MarkDisconnected(Guid playerId);
    IReadOnlyList<Guid> CollectExpired();
    void CleanupExpired();
}
public class GameService(IOptions<PlayerSessionOptions> playerSessionOptions): IGameService {
    private readonly object _syncRoot = new object();
    private readonly ConcurrentDictionary<Guid, Guid> _playerGameMap = new();
    private readonly ConcurrentDictionary<Guid, GameSessionManager> _games = new();
    private readonly ConcurrentDictionary<Guid, PlayerSessionInfo> _players = new();

    public void RegisterOrUpdatePlayer(Guid playerId, string nickname, string connectionId) {
        _players.AddOrUpdate(
            playerId,
            id => new PlayerSessionInfo {
                PlayerId = id,
                NickName = nickname,
                ConnectionId = connectionId
            },
            (id, existing) => {
                existing.PlayerId = id;
                existing.NickName = nickname;
                existing.ConnectionId = connectionId;
                return existing;
            }
        );
    }

    public void MarkDisconnected(Guid playerId) {
        if (_players.TryGetValue(playerId, out var playerSession)) {
            playerSession.SetConnected(false);
        }
    }

    public IReadOnlyList<Guid> CollectExpired() {
        return _players
            .Where(kvp => kvp.Value.IsExpired)
            .Select(kvp => kvp.Key)
            .ToList();
    }
    
    public void CleanupExpired() {
        foreach (var expiredPlayerId in CollectExpired()) {
            _players.TryRemove(expiredPlayerId, out _);
        }
    }

    public void ChangeNickname(Guid playerId, string newNickname) {
        CheckPlayerExists(playerId);
        if(_players.TryGetValue(playerId, out var playerSession)) {
            playerSession.SetConnected(true);
            playerSession.NickName = newNickname;
        }
    }

    public Guid CreateGame(Guid playerId) {
        lock(_syncRoot) {
            CheckPlayerExists(playerId);

            if(_players.TryGetValue(playerId, out var playerSession)) {
                playerSession.SetConnected(true);
                var gameId = Guid.NewGuid();
                var newSessionManager = new GameSessionManager(gameId);
                newSessionManager.RegisterPlayer(gameId, playerId, playerSession.NickName, playerSession.ConnectionId);
                _games[gameId] = newSessionManager;
                _playerGameMap[playerId] = gameId;
                return gameId;
            }
            
            throw new PlayerNotFoundException(playerId);
        }
    }

    public void JoinGame(Guid gameId, Guid playerId) {
        lock(_syncRoot) {
            CheckPlayerExists(playerId);
            var gameSession = TryGetGame(gameId);

            if (gameSession.GetCurrentPlayersCount() >= 5)
                throw new GameAlreadyFullException();

            if(gameSession.GameStatus == GameStatus.InProgress)
                throw new GameAlreadyStartedException();

            if(_players.TryGetValue(playerId, out var playerSession)) {
                playerSession.SetConnected(true);
                gameSession.RegisterPlayer(gameId, playerId, playerSession.NickName, playerSession.ConnectionId);
                _playerGameMap[playerId] = gameId;
            } else {
                throw new PlayerNotFoundException(playerId);
            }
        }
    }

    public void TryRejoin(Guid playerId) {
        CheckPlayerExists(playerId);
        var session = GetSessionManagerByPlayer(playerId);
        session.TryRejoin(playerId);
    }

    public void TryReconnect(Guid playerId, string connectionId) {
        CheckPlayerExists(playerId);
        var session = GetSessionManagerByPlayer(playerId);
        session.TryReconnectPlayer(playerId, connectionId);
    }

    public void StartGame(Guid playerId) {
        lock(_syncRoot) {
            var gameSession = GetSessionManagerByPlayer(playerId);
            var playersCount = gameSession.GetCurrentPlayersCount();

            if (playersCount <= 1)
                throw new InvalidGameStateException("Cannot start game with 1 or less players.");
            if (playersCount > 5)
                throw new InvalidGameStateException("Cannot start game with 6 or more players.");

            gameSession.Start();
        }
    }

    public void TerminateGame(Guid playerId) {
        lock(_syncRoot) {
            var gameSession = GetSessionManagerByPlayer(playerId);
            gameSession.Terminate();
            _games.TryRemove(gameSession.GameId, out _);
            var keysToRemove = _playerGameMap.Where(kvp => kvp.Value == gameSession.GameId).Select(kvp => kvp.Key).ToList();
            foreach (var key in keysToRemove) {
                _playerGameMap.TryRemove(key, out _);
            }
        }
    }

    public void LeaveGame(Guid playerId, bool isItentionally) {
        CheckPlayerExists(playerId);
        var gameSession = GetSessionManagerByPlayer(playerId);
        if(isItentionally) {
            gameSession.RemovePlayer(playerId);
        } else {
            gameSession.MarkPlayerDisconnected(playerId);
        }

        if(gameSession.AreAllPlayersDisconnected() || gameSession.GetCurrentPlayersCount() == 0) {
            TerminateGame(playerId);
        }
    }

    public string GetPlayerConnectionId(Guid playerId) {
        CheckPlayerExists(playerId);
        return _players[playerId].ConnectionId;
    }

    public SerializedGameState GetGameState(Guid playerId) {
        var sessionManager = GetSessionManagerByPlayer(playerId);
        return sessionManager.GetModelCurrentState(playerId);
    }

    public GameSessionManager GetSessionManagerByPlayer(Guid playerId) {
        CheckPlayerExists(playerId);
        if (!_playerGameMap.TryGetValue(playerId, out var gameId))
            throw new GameNotFoundException();
        return TryGetGame(gameId);
    }

    private void CheckPlayerExists(Guid playerId) { // TODO: return player
        if (!_players.ContainsKey(playerId))
            throw new PlayerNotFoundException(playerId);
    }

    private GameSessionManager TryGetGame(Guid gameId) {
        if (!_games.TryGetValue(gameId, out var session))
            throw new GameNotFoundException();
        return session;
    }
}
