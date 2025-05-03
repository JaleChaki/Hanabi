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
            id => new PlayerSessionInfo(playerSessionOptions) {
                PlayerId = id,
                NickName = nickname,
                IsIntentionallyDisconnected = false,
                Connected = true,
                ConnectionId = connectionId,
                LastActive = null
            },
            (id, existing) => {
                if(existing.IsExpired) {
                    return new PlayerSessionInfo(playerSessionOptions) {
                        PlayerId = id,
                        Connected = true,
                        LastActive = null
                    };
                }

                existing.Connected = true;
                existing.ConnectionId = connectionId;
                existing.LastActive = null;
                return existing;
            }
        );
    }

    public void MarkDisconnected(Guid playerId) {
        if (_players.TryGetValue(playerId, out var session)) {
            session.Connected = false;
            session.LastActive = DateTime.UtcNow;
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
        if(_players.TryGetValue(playerId, out var session)) {
            session.NickName = newNickname;
        }
    }

    public Guid CreateGame(Guid playerId) {
        lock(_syncRoot) {
            CheckPlayerExists(playerId);

            if(_players.TryGetValue(playerId, out var session)) {
                var gameId = Guid.NewGuid();
                var newSessionManager = new GameSessionManager(gameId);
                newSessionManager.RegisterPlayer(gameId, playerId, session.NickName, session.ConnectionId);
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

            if(_players.TryGetValue(playerId, out var session)) {
                gameSession.RegisterPlayer(gameId, playerId, session.NickName, session.ConnectionId);
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
        var session = GetSessionManagerByPlayer(playerId);
        var playersCount = session.GetCurrentPlayersCount();

        if (playersCount <= 1)
            throw new InvalidGameStateException("Cannot start game with 1 or less players.");
        if (playersCount > 5)
            throw new InvalidGameStateException("Cannot start game with 6 or more players.");

        session.Start();
    }

    public void TerminateGame(Guid playerId) {
        lock(_syncRoot) {
            var session = GetSessionManagerByPlayer(playerId);
            session.Terminate();
            _games.TryRemove(session.GameId, out _);
            var keysToRemove = _playerGameMap.Where(kvp => kvp.Value == session.GameId).Select(kvp => kvp.Key).ToList();
            foreach (var key in keysToRemove) {
                _playerGameMap.TryRemove(key, out _);
            }
        }
    }

    public void LeaveGame(Guid playerId, bool isItentionally) {
        CheckPlayerExists(playerId);
        var session = GetSessionManagerByPlayer(playerId);
        if(isItentionally) {
            session.RemovePlayer(playerId);
        } else {
            session.MarkPlayerDisconnected(playerId);
        }

        if(session.AreAllPlayersDisconnected() || session.GetCurrentPlayersCount() == 0) {
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

    private void CheckPlayerExists(Guid playerId) {
        if (!_players.ContainsKey(playerId))
            throw new PlayerNotFoundException(playerId);
    }

    private GameSessionManager TryGetGame(Guid gameId) {
        if (!_games.TryGetValue(gameId, out var session))
            throw new GameNotFoundException();
        return session;
    }
}
