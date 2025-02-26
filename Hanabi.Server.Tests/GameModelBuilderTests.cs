using Hanabi.Game;
using Xunit;

namespace Hanabi.Server.Tests;
    public class GameModelBuilderTests {

        [Fact]
        public void CreateNew() {
            var gameState = GameModelBuilder.CreateNew();

            Assert.Equal(40, gameState.Deck.Count); // TODO: (50 by default) make it independent from players count 
            Assert.Equal(8, gameState.InformationTokens);
            Assert.Equal(0, gameState.FuseTokens);
        }

    }