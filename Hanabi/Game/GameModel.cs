﻿namespace Hanabi.Game {
    public class GameModel {

        public GameModel(IEnumerable<Card> deck, int informationTokens, int fuseTokens, IReadOnlyCollection<CardColor> colors, IEnumerable<Guid> playerOrder, IReadOnlyDictionary<Guid, IEnumerable<HeldCard>> playerHands) {
            Deck = deck.ToList();
            InformationTokens = informationTokens;
            FuseTokens = fuseTokens;
            Fireworks = colors.ToDictionary(c => c, _ => 0);
            PlayerOrder = playerOrder.ToArray();
            CurrentPlayerIndex = 0;
            PlayerHands = playerHands.ToDictionary(kv => kv.Key, kv => kv.Value.ToList());
        }

        public List<Card> Deck { get; }

        public int InformationTokens { get; set; }

        public int FuseTokens { get; set; }

        public Dictionary<CardColor, int> Fireworks { get; }

        public Dictionary<Guid, List<HeldCard>> PlayerHands { get; }

        public Guid CurrentPlayer => PlayerOrder[CurrentPlayerIndex];

        public IReadOnlyList<Guid> PlayerOrder { get; }

        public int CurrentPlayerIndex { get; set; }

    }
}