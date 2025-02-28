namespace Hanabi.Game;
public class GameModelBuilder {

    public static GameModel CreateNew(Guid[] playerIds, long? seed = null) {
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

        var playerHands = new Dictionary<Guid, IEnumerable<HeldCard>>();
        for(int i = 0; i < playerIds.Length; ++i) {
            playerHands.Add(playerIds[i], cards.TakeLast(5).Select(HeldCard.FromCard).ToArray());
            cards.RemoveRange(cards.Count - 5, 5);
        }

        return new GameModel(cards, 8, 0, Enum.GetValues<CardColor>().Take(5).ToArray(), playerIds, playerHands);
    }

    public static GameModel CreateMock(Guid[] playerIds) {
        return new GameModel(playerIds);
    }

}