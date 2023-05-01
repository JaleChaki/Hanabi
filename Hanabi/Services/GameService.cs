using Hanabi.Game;
using Hanabi.Models;

namespace Hanabi.Services {
    public class GameService {
        private GameController CurrentGame { get; }

        public GameService() {
            CurrentGame = new GameController(GameModelBuilder.CreateNew());
        }

        public void RegisterPlayer(string nickname, string connectionId) {
            CurrentGame.RegisterPlayer(nickname, connectionId);
        }
        public string GetPlayerConnectionId(string nickname) {
            return CurrentGame.GetPlayerConnectionId(nickname);
        }

        public GameController GetController(Guid playerId) {
            return CurrentGame;
        }

        public SerializedGameState GetGameState(Guid playerId) {
            return CurrentGame.GetModelCurrentState(playerId);
        }
    }
}