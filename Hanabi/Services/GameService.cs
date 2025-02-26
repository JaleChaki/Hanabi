using Hanabi.Game;
using Hanabi.Models;

namespace Hanabi.Services;
public class GameService {
    private GameSessionManager CurrentGame { get; }

    public GameService() {
        CurrentGame = new GameSessionManager(GameModelBuilder.CreateNew());
    }

    public void RegisterPlayer(string nickname, string connectionId) {
        CurrentGame.RegisterPlayer(nickname, connectionId);
    }
    public string GetPlayerConnectionId(string nickname) {
        return CurrentGame.GetPlayerConnectionId(nickname);
    }

    public GameSessionManager GetController(Guid playerId) {
        return CurrentGame;
    }

    public SerializedGameState GetGameState(Guid playerId) {
        return CurrentGame.GetModelCurrentState(playerId);
    }
}