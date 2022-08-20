using Hanabi.Game;
using Hanabi.Models;

namespace Hanabi.Services {
    public class GameService {
        private GameController CurrentGame { get; }

        public GameService() {
            CurrentGame = new GameController(GameModelBuilder.CreateNew());
        }

        public GameController GetController(Guid playerId) {
            return CurrentGame;
        }

        public SerializedGameState GetGameState(Guid playerId) {
            return CurrentGame.CreateModel(playerId);
        }

    }
}