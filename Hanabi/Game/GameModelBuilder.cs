namespace Hanabi.Game {
    public class GameModelBuilder {

        public static GameModel CreateNew(long? seed = null) {
            seed ??= DateTime.Now.Ticks;
            // TODO KISS
            var cards = Enumerable.Range(1, 5).SelectMany(
                color => Enumerable.Range(1, 5)
                    .SelectMany(number => {
                        int amount = 2;
                        if(number == 1)
                            amount = 3;
                        if(number == 5)
                            amount = 1;
                        return Enumerable.Repeat(0, amount).Select(_ => new Card(number, (CardColor) color));
                    })
            ).Shuffle(new Random((int)seed.Value)).ToList();

            var playerOrder = new[] {
                Guid.Parse("6478E542-4E96-421B-987F-767A3171B766"),
                Guid.Parse("1744A9C2-C357-48BE-B955-50374801877A")
            };
            var playerHands = new Dictionary<Guid, IEnumerable<HeldCard>>();
            for(int i = 0; i < playerOrder.Length; ++i) {
                playerHands.Add(playerOrder[i], cards.TakeLast(5).Select(HeldCard.FromCard).ToArray());
                cards.RemoveRange(cards.Count - 5, 5);
            }

            var model = new GameModel(cards, 8, 0, Enum.GetValues<CardColor>().Take(5).ToArray(), playerOrder, playerHands);
            return model;
        }

    }
}