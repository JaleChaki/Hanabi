using Hanabi.Models;

namespace Hanabi.Game.Commands;
public class MakeHintCommand : Command {

    public MakeHintCommand(GameModel gameModel, Guid targetPlayerId, HintOptions options) : base(gameModel) {
        TargetPlayerId = targetPlayerId;
        Options = options;
    }

    private Guid TargetPlayerId { get; }
    private HintOptions Options { get; }

    public override void Apply() {
        base.Apply();
        GameModel.InformationTokens--;
        foreach(var card in GameModel.PlayerHands[TargetPlayerId]) {
            if(Options.CardColor == card.Color) {
                card.ColorIsKnown = true;
            }
            if(Options.CardNumber == card.Number) {
                card.NumberIsKnown = true;
            }
        }
        EndTurn();
    }
}