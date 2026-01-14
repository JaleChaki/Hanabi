using Hanabi.Models;
using Microsoft.Extensions.Options;

public class Player(IOptions<PlayerSessionOptions> playerSessionOptions) : IEquatable<Player> {
    public Guid Guid { get; init; }
    public string NickName { get; set; }
    public bool IsConnected { get; set; }
    public bool IsIntentionallyDisconnected { get; set; }
    public DateTime? LastActive { get; set; }
    public bool IsExpired => !IsConnected && LastActive.HasValue && DateTime.UtcNow - LastActive.Value > playerSessionOptions.Value.GraceTimeout;

    public bool Equals(Player other) {
        if(other == null) {
            return false;
        }
        return Guid.Equals(other.Guid);
    }
        public void SetConnected(bool connected, bool isIntentionallyDisconnected = false) {
        IsConnected = connected;
        if (connected) {
            IsConnected = true;
            IsIntentionallyDisconnected = false;
            LastActive = null;
        } else {
            IsConnected = false;
            IsIntentionallyDisconnected = isIntentionallyDisconnected;
            LastActive = DateTime.UtcNow;
        }
    }
}