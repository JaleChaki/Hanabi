using Hanabi.Game;

namespace Hanabi.Services {
    public class GameStateKeeper {
        private GameController CurrentGame { get; }

        public GameStateKeeper() {
            CurrentGame = new GameController(GameModelBuilder.CreateNew());
        }

        public GameController GetGameState() {
            return CurrentGame;
        }

    }
}