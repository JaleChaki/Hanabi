﻿using Hanabi.Models;

namespace Hanabi.Game.Commands;
public class PlayCardCommand : Command {

    public PlayCardCommand(GameModel gameModel, int cardIndex) : base(gameModel) {
        CardIndex = cardIndex;
    }

    private int CardIndex { get; }

    public override void Apply() {
        base.Apply();
        var card = GameModel.PlayerHands[GameModel.ActivePlayer][CardIndex];

        if(GameModel.Fireworks[card.Color] + 1 == card.Number) {
            GameModel.Fireworks[card.Color]++;
            // TODO: move somwhere else
            if(card.Number == 5 && GameModel.InformationTokens < 8)
                GameModel.InformationTokens++;
            if(GameModel.Fireworks.All(f => f.Value == 5))
                GameModel.Status = GameStatus.FlawlessVictory;
        } else {
            var discardedCard = GameModel.PlayerHands[GameModel.ActivePlayer].ElementAt(CardIndex);
            GameModel.DiscardPile.Add(discardedCard);
            GameModel.FuseTokens++;
            if(GameModel.FuseTokens == 3)
                GameModel.Status = GameStatus.Failure;
        }

        GameModel.PlayerHands[GameModel.ActivePlayer].RemoveAt(CardIndex);
        DrawCard();
        EndTurn();
    }
}