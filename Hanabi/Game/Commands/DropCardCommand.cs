namespace Hanabi.Game.Commands;
public class DropCardCommand : Command {

    public DropCardCommand(GameModel gameModel, int cardIndex) : base(gameModel) {
        CardIndex = cardIndex;
    }

    private int CardIndex { get; }

    public override void Apply() {
        base.Apply();
        var droppedCard = GameModel.PlayerHands[GameModel.ActivePlayer].ElementAt(CardIndex);
        GameModel.DiscardPile.Add(droppedCard);
        GameModel.InformationTokens++;

        GameModel.PlayerHands[GameModel.ActivePlayer].RemoveAt(CardIndex);
        DrawCard();
        EndTurn();
    }
}