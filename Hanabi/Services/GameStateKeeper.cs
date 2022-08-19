using Hanabi.Game;

namespace Hanabi.Services {
    public class GameStateKeeper {
        private GameState CurrentGame { get; }

        public GameStateKeeper() {
            CurrentGame = new GameState {
                CardsInDeck = 228,
                Fireworks = new [] { 1, 2, 3, 5, 4 },
                FuseTokens = 322,
                InformationTokens = 0
            };
        }

        public GameState GetGameState() {
            return CurrentGame;
        }

    }
}