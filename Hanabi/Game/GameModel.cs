namespace Hanabi.Game {
    public class GameModel {

        public GameModel(IEnumerable<Card> deck, int informationTokens, int fuseTokens, int colors, IEnumerable<Guid> playerOrder, IReadOnlyDictionary<Guid, IEnumerable<HeldCard>> playerHands) {
            Deck = deck.ToList();
            InformationTokens = informationTokens;
            FuseTokens = fuseTokens;
            Fireworks = Enumerable.Repeat(0, colors).ToList();
            PlayerOrder = playerOrder.ToArray();
            CurrentPlayerIndex = 0;
            PlayerHands = playerHands.ToDictionary(kv => kv.Key, kv => kv.Value.ToList());
        }

        public List<Card> Deck { get; }

        public int InformationTokens { get; set; }

        public int FuseTokens { get; set; }

        public List<int> Fireworks { get; set; }

        public Dictionary<Guid, List<HeldCard>> PlayerHands { get; }

        public Guid CurrentPlayer => PlayerOrder[CurrentPlayerIndex];

        public IReadOnlyList<Guid> PlayerOrder { get; }

        public int CurrentPlayerIndex { get; set; }

    }
}