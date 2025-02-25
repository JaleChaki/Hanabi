namespace Hanabi.Models {
    public class SerializedGameState {
        public int CardsInDeck { get; init; }
        public int InformationTokens { get; init; }
        public int FuseTokens { get; init; }
        public IReadOnlyList<int> Fireworks { get; init; }
        public IReadOnlyList<SerializedPlayer> Players { get; init; }
        public int TurnIndex { get; init; }
        public GameStatus GameStatus { get; init; }
        public int LastThreeTurns { get; set; }
    }
}