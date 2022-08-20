namespace Hanabi.Game {
    public class GameModelBuilder {

        public static GameModel CreateNew() {

            // TODO KISS
            var cards = Enumerable.Repeat(0, 5).SelectMany(
                color => Enumerable.Repeat(1, 5)
                    .SelectMany(number => {
                        int amount = 2;
                        if(number == 1)
                            amount = 3;
                        if(number == 5)
                            amount = 1;
                        return Enumerable.Repeat(0, amount).Select(_ => new Card(color, number));
                    })
            );

            return new GameModel(cards, 8, 0, 5, Array.Empty<Guid>());
        }

    }
}