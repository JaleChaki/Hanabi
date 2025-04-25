using System.Collections.Concurrent;
using Hanabi.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
namespace Hanabi.Services;

public interface IPlayerSessionStoreService {
    PlayerSessionInfo AddOrUpdateSession(Guid playerId, string connectionId);
    void MarkDisconnected(Guid playerId);
    IReadOnlyList<Guid> CollectExpired();
    void CleanupExpired();
}

public class PlayerSessionStoreService(IOptions<PlayerSessionOptions> playerSessionOptions) : IPlayerSessionStoreService {
    private readonly ConcurrentDictionary<Guid, PlayerSessionInfo> _sessions = new();

    public PlayerSessionInfo AddOrUpdateSession(Guid playerId, string connectionId) {
        return _sessions.AddOrUpdate(
            playerId,
            id => new PlayerSessionInfo(playerSessionOptions) {
                PlayerId = id,
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
        if (_sessions.TryGetValue(playerId, out var session)) {
            session.Connected = false;
            session.LastActive = DateTime.UtcNow;
        }
    }

    public IReadOnlyList<Guid> CollectExpired() {
        return _sessions
            .Where(kvp => kvp.Value.IsExpired)
            .Select(kvp => kvp.Key)
            .ToList();
    }
    
    public void CleanupExpired() {
        foreach (var expiredPlayerId in CollectExpired()) {
            _sessions.TryRemove(expiredPlayerId, out _);
        }
    }
}

public class PlayerSessionInfo(IOptions<PlayerSessionOptions> playerSessionOptions) {
    public Guid PlayerId { get; set; }
    public bool Connected { get; set; }
    public string ConnectionId { get; set; }
    public DateTime? LastActive { get; set; }
    public bool IsExpired => !Connected && LastActive.HasValue && DateTime.UtcNow - LastActive.Value > playerSessionOptions.Value.GraceTimeout;
}