namespace Hanabi.Game.Commands {
    public class PlayCardCommand : Command {

        public PlayCardCommand(GameModel gameModel, int cardIndex) : base(gameModel) {
            CardIndex = cardIndex;
        }

        private int CardIndex { get; }

        public override void Apply() {
            var card = GameModel.PlayerHands[GameModel.ActivePlayer][CardIndex];

            GameModel.PlayerHands[GameModel.ActivePlayer].RemoveAt(CardIndex);

            if(GameModel.Fireworks[card.Color] + 1 == card.Number) {
                GameModel.Fireworks[card.Color]++;
            } else {
                GameModel.FuseTokens++;
            }

            DrawCard();
            EndTurn();
        }
    }
}