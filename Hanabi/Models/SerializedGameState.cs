namespace Hanabi.Models {
    public class SerializedGameState {

        public int CardsInDeck { get; set; }

        public int InformationTokens { get; set; }

        public int FuseTokens { get; set; }

        public IReadOnlyList<int> Fireworks { get; set; }

    }
}