using Hanabi.Game;
using Hanabi.Models;
using Xunit;

namespace Hanabi.Server.Tests {
    public class GameControllerTests {

        public GameControllerTests() {
            GameModel = GameModelBuilder.CreateNew();
            FirstPlayer = GameModel.PlayerOrder[0];
            SecondPlayer = GameModel.PlayerOrder[1];
            GameController = new GameController(GameModel);
        }

        private GameModel GameModel { get; }
        private GameController GameController { get; }
        private Guid FirstPlayer { get; }
        private Guid SecondPlayer { get; }

        [Fact]
        public void MakeHint_Color() {
            GameController.MakeHint(FirstPlayer, SecondPlayer, HintOptions.FromCardColor(0));

            Assert.Equal(SecondPlayer, GameModel.CurrentPlayer);
            Assert.True(GameModel.PlayerHands[SecondPlayer].All(card => (card.ColorIsKnown && card.Color == 0) || (!card.ColorIsKnown && card.Color != 0)));
            Assert.True(GameModel.PlayerHands[SecondPlayer].All(card => !card.NumberIsKnown));
        }

        [Fact]
        public void MakeHint_Number() {
            GameController.MakeHint(FirstPlayer, SecondPlayer, HintOptions.FromCardNumber(5));

            Assert.Equal(SecondPlayer, GameModel.CurrentPlayer);
            Assert.True(GameModel.PlayerHands[SecondPlayer].All(card => (card.NumberIsKnown && card.Number == 5) || (!card.NumberIsKnown && card.Number != 5)));
            Assert.True(GameModel.PlayerHands[SecondPlayer].All(card => !card.ColorIsKnown));
        }

        [Fact]
        public void MakeHint_Oneself() {
            AssertThrowsArgumentException(delegate {
                GameController.MakeHint(FirstPlayer, FirstPlayer, HintOptions.FromCardColor(0));
            });
        }

        [Theory]
        [InlineData(-1)]
        [InlineData(6)]
        public void MakeHint_WrongCardColor(int color) {
            AssertThrowsArgumentException(delegate {
                GameController.MakeHint(FirstPlayer, SecondPlayer, HintOptions.FromCardColor(color));
            });
        }

        [Fact]
        public void MakeHint_WrongCurrentPlayer() {
            AssertThrowsArgumentException(delegate {
                GameController.MakeHint(SecondPlayer, FirstPlayer, HintOptions.FromCardColor(4));
            });
        }

        [Fact]
        public void DropCard() {
            var prevHand = GameModel.PlayerHands[FirstPlayer].ToArray();

            GameController.DropCard(FirstPlayer, 0);

            var newHand = GameModel.PlayerHands[FirstPlayer];

            Assert.True(Enumerable.SequenceEqual(prevHand.Skip(1), newHand.SkipLast(1)));
            Assert.Equal(SecondPlayer, GameModel.CurrentPlayer);
        }

        [Fact]
        public void DropCard_WrongCurrentPlayer() {
            AssertThrowsArgumentException(delegate {
                GameController.DropCard(SecondPlayer, 0);
            });
        }

        [Theory]
        [InlineData(-1)]
        [InlineData(5)]
        public void DropCard_WrongIndex(int cardIndex) {
            AssertThrowsArgumentException(delegate {
                GameController.DropCard(FirstPlayer, cardIndex);
            });
        }

        [Fact]
        public void PlayCard_Ok() {
            var prevHand = GameModel.PlayerHands[FirstPlayer].ToArray();

            GameController.PlayCard(FirstPlayer, 4);

            var newHand = GameModel.PlayerHands[FirstPlayer];

            Assert.Equal(1, GameModel.Fireworks[1]);
            Assert.Equal(prevHand.SkipLast(1), newHand.SkipLast(1));
            Assert.Equal(SecondPlayer, GameModel.CurrentPlayer);
        }

        [Fact]
        public void PlayCard_Fall() {
            var prevHand = GameModel.PlayerHands[FirstPlayer].ToArray();

            GameController.PlayCard(FirstPlayer, 0);

            var newHand = GameModel.PlayerHands[FirstPlayer];

            Assert.Equal(1, GameModel.FuseTokens);
            Assert.True(Enumerable.SequenceEqual(prevHand.Skip(1), newHand.SkipLast(1)));
            Assert.Equal(SecondPlayer, GameModel.CurrentPlayer);
        }

        [Fact]
        public void PlayCard_WrongCurrentPlayer() {
            AssertThrowsArgumentException(delegate {
                GameController.PlayCard(SecondPlayer, 0);
            });
        }

        [Theory]
        [InlineData(-1)]
        [InlineData(5)]
        public void PlayCard_WrongIndex(int cardIndex) {
            AssertThrowsArgumentException(delegate {
                GameController.PlayCard(FirstPlayer, cardIndex);
            });
        }

        private static void AssertThrowsArgumentException(Action action) {
            var exception = Record.Exception(action);

            Assert.NotNull(exception);
            Assert.IsType<ArgumentException>(exception);
        }

    }
}