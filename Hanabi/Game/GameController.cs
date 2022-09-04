using Hanabi.Game.Commands;
using Hanabi.Models;

namespace Hanabi.Game {
    public class GameController {
        public GameController(GameModel gameModel) {
            GameModel = gameModel;
        }

        private GameModel GameModel { get; }

        private readonly object _syncRoot = new object();

        public SerializedGameState CreateModel(Guid playerId) {
            EnsurePlayerExists(playerId);

            SerializedGameState result;
            lock(_syncRoot) {
                result = new SerializedGameState {
                    FuseTokens = GameModel.FuseTokens,
                    InformationTokens = GameModel.InformationTokens,
                    CardsInDeck = GameModel.Deck.Count,
                    Fireworks = GameModel.Fireworks.OrderBy(x => x.Key).Select(x => x.Value).ToArray(),
                    Players = GameModel.PlayerOrder.Select(id => new SerializedPlayer {
                        Nick = id.ToString().ToUpper() == "6478E542-4E96-421B-987F-767A3171B766" ? "staziz" : "jalechaki", // TODO
                        HeldCards = GameModel.PlayerHands[id].Select(card => new SerializedCard {
                            Color = (int) card.Color,
                            Number = card.Number,
                            ColorIsKnown = card.ColorIsKnown,
                            NumberIsKnown = card.NumberIsKnown
                        }).ToArray()
                    }).ToArray()
                };
            }
            return result;
        }

        public void MakeHint(Guid currentPlayerId, Guid targetPlayerId, HintOptions options) {
            EnsurePlayerExists(targetPlayerId);
            EnsurePlayerExists(currentPlayerId);
            if(currentPlayerId == targetPlayerId)
                throw new ArgumentException("current and target player can not be equal");
            if(options.CardColor.HasValue && !GameModel.Fireworks.ContainsKey(options.CardColor.Value))
                throw new ArgumentException("specified card color is not presented in game");

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
            if(cardIndex >= GameModel.PlayerHands[playerId].Count || cardIndex < 0)
                throw new ArgumentException("Invalid card index", nameof(cardIndex));
        }
    }
}