using Hanabi.Game;
using Hanabi.Models;

namespace Hanabi.Services {
    public class GameStateKeeper {
        private GameController CurrentGame { get; }

        public GameStateKeeper() {
            CurrentGame = new GameController(GameModelBuilder.CreateNew());
        }

        public SerializedGameState GetGameState() {
            return CurrentGame.CreateModel();
        }

    }
}