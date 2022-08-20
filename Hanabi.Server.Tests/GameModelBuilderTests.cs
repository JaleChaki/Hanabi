using Hanabi.Game;
using Xunit;

namespace Hanabi.Server.Tests {
    public class GameModelBuilderTests {

        [Fact]
        public void CreateNew() {
            var gameState = GameModelBuilder.CreateNew();

            Assert.Equal(50, gameState.Deck.Count);
            Assert.Equal(8, gameState.InformationTokens);
            Assert.Equal(0, gameState.FuseTokens);
        }

    }
}