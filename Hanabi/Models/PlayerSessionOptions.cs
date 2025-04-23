namespace Hanabi.Models;
public sealed class PlayerSessionOptions {
    public TimeSpan GraceTimeout { get; init; } = TimeSpan.FromSeconds(30);
}
