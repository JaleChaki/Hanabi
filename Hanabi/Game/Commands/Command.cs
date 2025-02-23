namespace Hanabi.Game.Commands {
    public abstract class Command {

        protected Command(GameModel gameModel) {
            GameModel = gameModel;
        }

        protected GameModel GameModel { get; }

        public abstract void Apply();

        protected void EndTurn() {
            GameModel.ActivePlayerIndex = (GameModel.ActivePlayerIndex + 1) % GameModel.PlayerOrder.Count;
            GameModel.TotalTurnsCount++;
        }

        protected void DrawCard() {
            if(GameModel.Deck.Count > 0) {
                var newCard = GameModel.Deck.Last();
                GameModel.Deck.RemoveAt(GameModel.Deck.Count - 1);

                GameModel.PlayerHands[GameModel.ActivePlayer].Add(new HeldCard(newCard.Number, newCard.Color, false, false));

                if(GameModel.Deck.Count == 0) {
                    // TODO
                }

            }
        }

    }
}