﻿using Hanabi.Game;
using Hanabi.Models;
using Xunit;

namespace Hanabi.Server.Tests;
public class GameSessionManagerTests {

    public GameSessionManagerTests() {
        GameModel = GameModelBuilder.CreateNew(1337);
        FirstPlayer = GameModel.PlayerOrder[0];
        SecondPlayer = GameModel.PlayerOrder[1];
        GameSessionManager = new GameSessionManager(GameModel);
    }

    private GameModel GameModel { get; }
    private GameSessionManager GameSessionManager { get; }
    private Guid FirstPlayer { get; }
    private Guid SecondPlayer { get; }

    [Fact]
    public void MakeHint_Color() {
        GameSessionManager.MakeHint(FirstPlayer, SecondPlayer, HintOptions.FromCardColor(1));

        Assert.Equal(SecondPlayer, GameModel.ActivePlayer);
        Assert.True(GameModel.PlayerHands[SecondPlayer].All(card => (card.ColorIsKnown && card.Color == CardColor.Red) || (!card.ColorIsKnown && card.Color != CardColor.Red)));
        Assert.True(GameModel.PlayerHands[SecondPlayer].All(card => !card.NumberIsKnown));
    }

    [Fact]
    public void MakeHint_Number() {
        GameSessionManager.MakeHint(FirstPlayer, SecondPlayer, HintOptions.FromCardNumber(5));

        Assert.Equal(SecondPlayer, GameModel.ActivePlayer);
        Assert.True(GameModel.PlayerHands[SecondPlayer].All(card => (card.NumberIsKnown && card.Number == 5) || (!card.NumberIsKnown && card.Number != 5)));
        Assert.True(GameModel.PlayerHands[SecondPlayer].All(card => !card.ColorIsKnown));
    }

    [Fact]
    public void MakeHint_Oneself() {
        AssertThrowsArgumentException(delegate {
            GameSessionManager.MakeHint(FirstPlayer, FirstPlayer, HintOptions.FromCardColor(0));
        });
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(6)]
    public void MakeHint_WrongCardColor(int color) {
        AssertThrowsArgumentException(delegate {
            GameSessionManager.MakeHint(FirstPlayer, SecondPlayer, HintOptions.FromCardColor(color));
        });
    }

    [Fact]
    public void MakeHint_WrongCurrentPlayer() {
        AssertThrowsArgumentException(delegate {
            GameSessionManager.MakeHint(SecondPlayer, FirstPlayer, HintOptions.FromCardColor(4));
        });
    }

    [Fact]
    public void DropCard() {
        var prevHand = GameModel.PlayerHands[FirstPlayer].ToArray();

        GameSessionManager.DropCard(FirstPlayer, 0);

        var newHand = GameModel.PlayerHands[FirstPlayer];

        Assert.True(Enumerable.SequenceEqual(prevHand.Skip(1), newHand.SkipLast(1)));
        Assert.Equal(SecondPlayer, GameModel.ActivePlayer);
    }

    [Fact]
    public void DropCard_WrongCurrentPlayer() {
        AssertThrowsArgumentException(delegate {
            GameSessionManager.DropCard(SecondPlayer, 0);
        });
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(5)]
    public void DropCard_WrongIndex(int cardIndex) {
        AssertThrowsArgumentException(delegate {
            GameSessionManager.DropCard(FirstPlayer, cardIndex);
        });
    }

    [Fact]
    public void PlayCard_Ok() {
        var prevHand = GameModel.PlayerHands[FirstPlayer].ToArray();

        GameSessionManager.PlayCard(FirstPlayer, 0);

        var newHand = GameModel.PlayerHands[FirstPlayer];

        Assert.Equal(0, GameModel.Fireworks[CardColor.Red]);
        Assert.Equal(prevHand.Skip(1), newHand.SkipLast(1));
        Assert.Equal(SecondPlayer, GameModel.ActivePlayer);
    }

    [Fact]
    public void PlayCard_Fall() {
        var prevHand = GameModel.PlayerHands[FirstPlayer].ToArray();

        GameSessionManager.PlayCard(FirstPlayer, 2);

        var newHand = GameModel.PlayerHands[FirstPlayer];

        Assert.Equal(1, GameModel.FuseTokens);
        Assert.Equal(prevHand.Except(new [] { prevHand[2] }), newHand.SkipLast(1));
        Assert.Equal(SecondPlayer, GameModel.ActivePlayer);
    }

    [Fact]
    public void PlayCard_WrongCurrentPlayer() {
        AssertThrowsArgumentException(delegate {
            GameSessionManager.PlayCard(SecondPlayer, 0);
        });
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(5)]
    public void PlayCard_WrongIndex(int cardIndex) {
        AssertThrowsArgumentException(delegate {
            GameSessionManager.PlayCard(FirstPlayer, cardIndex);
        });
    }

    private static void AssertThrowsArgumentException(Action action) {
        var exception = Record.Exception(action);

        Assert.NotNull(exception);
        Assert.IsType<ArgumentException>(exception);
    }

}