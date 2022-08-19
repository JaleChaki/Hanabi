namespace Hanabi.Game {
    public class GameState {

        public int CardsInDeck { get; set; }

        public int InformationTokens { get; set; }

        public int FuseTokens { get; set; }

        public IReadOnlyList<int> Fireworks { get; set; }

    }
}