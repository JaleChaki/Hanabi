namespace Hanabi.Services;

public class PlayerSessionInfo {
    public Guid PlayerId { get; set; }
    public string NickName { get; set; }
    public string ConnectionId { get; set; }
}