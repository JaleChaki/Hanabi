using Hanabi.Models;
using Microsoft.Extensions.Options;
namespace Hanabi.Services;

public class PlayerSessionInfo(IOptions<PlayerSessionOptions> playerSessionOptions) {
    public Guid PlayerId { get; set; }
    public string NickName { get; set; }
    public bool IsIntentionallyDisconnected { get; set; }
    public bool Connected { get; set; }
    public string ConnectionId { get; set; }
    public DateTime? LastActive { get; set; }
    public bool IsExpired => !Connected && LastActive.HasValue && DateTime.UtcNow - LastActive.Value > playerSessionOptions.Value.GraceTimeout;
}