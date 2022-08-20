using Hanabi.Game.Commands;
using Hanabi.Models;

namespace Hanabi.Game {
    public class GameController {

        public GameController(GameModel gameModel) {
            GameModel = gameModel;
        }

        private GameModel GameModel { get; }

        private readonly object _syncRoot = new object();

        public SerializedGameState CreateModel() {
            //EnsurePlayerExists(playerId);

            return new SerializedGameState {
                FuseTokens = GameModel.FuseTokens,
                InformationTokens = GameModel.InformationTokens,
                CardsInDeck = GameModel.Deck.Count,
                Fireworks = GameModel.Fireworks
            };
        }

        public void MakeHint(Guid currentPlayerId, Guid targetPlayerId, HintOptions options) {
            EnsurePlayerExists(targetPlayerId);
            EnsurePlayerExists(currentPlayerId);

            lock(_syncRoot) {
                EnsureCurrentPlayer(currentPlayerId);

                var command = new MakeHintCommand(GameModel, targetPlayerId, options);
                command.Apply();
            }
        }

        public void DropCard(Guid currentPlayerId, int cardIndex) {
            EnsurePlayerExists(currentPlayerId);

            lock(_syncRoot) {
                EnsureCurrentPlayer(currentPlayerId);
                EnsureCardIndex(currentPlayerId, cardIndex);

                var command = new DropCardCommand(GameModel, cardIndex);
                command.Apply();
            }
        }

        public void PlayCard(Guid currentPlayerId, int cardIndex) {
            EnsurePlayerExists(currentPlayerId);

            lock(_syncRoot) {
                EnsureCurrentPlayer(currentPlayerId);
                EnsureCardIndex(currentPlayerId, cardIndex);

                var command = new PlayCardCommand(GameModel, cardIndex);
                command.Apply();
            }
        }

        private void EnsurePlayerExists(Guid playerId) {
            if(!GameModel.PlayerOrder.Contains(playerId))
                throw new ArgumentException("Invalid player id", nameof(playerId));
        }

        private void EnsureCurrentPlayer(Guid playerId) {
            if(playerId != GameModel.CurrentPlayer)
                throw new ArgumentException("Invalid current player", nameof(playerId));
        }

        private void EnsureCardIndex(Guid playerId, int cardIndex) {
            if(GameModel.PlayerHands[playerId].Count <= cardIndex)
                throw new ArgumentException("Invalid card index", nameof(cardIndex));
        }
    }
}