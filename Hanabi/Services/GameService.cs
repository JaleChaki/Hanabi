using System.Collections.Concurrent;
using Hanabi.Exceptions;
using Hanabi.Game;
using Hanabi.Models;

namespace Hanabi.Services;
public class GameService {
    private readonly object _syncRoot = new object();
    private readonly ConcurrentDictionary<Guid, Guid> _playerGameMap = new();
    private readonly ConcurrentDictionary<Guid, GameSessionManager> _games = new();
    private readonly ConcurrentDictionary<Guid, (string Nickname, string ConnectionId)> _players = new();

    public void RegisterOrUpdatePlayer(Guid playerId, string nickname, string connectionId) {
        _players[playerId] = (nickname, connectionId);
    }

    public void ChangeNickname(Guid playerId, string newNickname) {
        CheckPlayerExists(playerId);
        var (_, connId) = _players[playerId];
        _players[playerId] = (newNickname, connId);
    }

    public Guid CreateGame(Guid playerId) {
        CheckPlayerExists(playerId);
        var gameId = Guid.NewGuid();
        var newSessionManager = new GameSessionManager(gameId);

        var (nickname, connectionId) = _players[playerId];
        newSessionManager.RegisterPlayer(gameId, playerId, nickname, connectionId);

        _games[gameId] = newSessionManager;
        _playerGameMap[playerId] = gameId;
        return gameId;
    }

    public void JoinGame(Guid gameId, Guid playerId) {
        CheckPlayerExists(playerId);
        var session = TryGetGame(gameId);

        if (session.GetCurrentPlayersCount() >= 5)
            throw new GameAlreadyFullException();

        if(session.GameStatus == GameStatus.InProgress)
            throw new GameAlreadyStartedException();

        var (nickname, connectionId) = _players[playerId];
        session.RegisterPlayer(gameId, playerId, nickname, connectionId);

        _playerGameMap[playerId] = gameId;
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
