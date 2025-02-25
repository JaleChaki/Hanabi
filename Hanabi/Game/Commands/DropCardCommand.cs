namespace Hanabi.Game.Commands {
    public class DropCardCommand : Command {

        public DropCardCommand(GameModel gameModel, int cardIndex) : base(gameModel) {
            CardIndex = cardIndex;
        }

        private int CardIndex { get; }

        public override void Apply() {
            base.Apply();
            GameModel.PlayerHands[GameModel.ActivePlayer].RemoveAt(CardIndex);
            GameModel.InformationTokens++;

            DrawCard();
            EndTurn();
        }
    }
}