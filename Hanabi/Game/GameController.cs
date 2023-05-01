using Hanabi.Game.Commands;
using Hanabi.Models;

namespace Hanabi.Game {
    public class GameController {
        public GameController(GameModel gameModel) {
            GameModel = gameModel;
            Players = new();
        }

        private GameModel GameModel { get; }
        private List<Player> Players { get; }

        private readonly object _syncRoot = new object();

        public void RegisterPlayer(string nickname, string connectionId) {
            bool alreadyRegistered = Players.Exists(p => p.NickName == nickname);
            if(!alreadyRegistered) {
                Players.Add(new Player() {
                    NickName = nickname,
                    Guid = GetPlayerGuid(nickname),
                    ConnectionId = connectionId
                });
            }
        }
        public string GetPlayerConnectionId(string nickname) {
            return Players.FirstOrDefault(p => p.NickName == nickname).ConnectionId;
        }
        private Guid GetPlayerGuid(string nickname) => nickname switch { // TODO
                "staziz" => Guid.Parse("6478E542-4E96-421B-987F-767A3171B766"),
                "jalechaki" => Guid.Parse("1744A9C2-C357-48BE-B955-50374801877A"),
                "test_player" => Guid.Parse("E05E5FA4-DA8C-4CBC-B9DB-231BAE63A970"),
                _ => throw new ArgumentOutOfRangeException(nameof(nickname), $"Player with nickname '{nickname}' does not exist in current game")
        };

        public SerializedGameState GetModelCurrentState(Guid playerId) {
            EnsurePlayerExists(playerId);

            SerializedGameState result;
            lock(_syncRoot) {
                result = new SerializedGameState {
                    FuseTokens = GameModel.FuseTokens,
                    InformationTokens = GameModel.InformationTokens,
                    CardsInDeck = GameModel.Deck.Count,
                    Fireworks = GameModel.Fireworks.OrderBy(x => x.Key).Select(x => x.Value).ToArray(),
                    Players = GameModel.PlayerOrder.Select(id => {
                        var isCurrenPlayer = playerId == id;
                        return new SerializedPlayer {
                            IsCurrentPalyer = isCurrenPlayer,
                            Nick = GetPlayerName(id.ToString().ToUpper()),
                            HeldCards = GameModel.PlayerHands[id].Select(card => new SerializedCard {
                                Color = !isCurrenPlayer || card.ColorIsKnown ? (int)card.Color : (int)default(CardColor),
                                Number = !isCurrenPlayer || card.NumberIsKnown ? card.Number : 0,
                                ColorIsKnown = card.ColorIsKnown,
                                NumberIsKnown = card.NumberIsKnown
                            }).ToArray()
                        };
                    }).ToArray()
                };
            }
            return result;
        }

        private string GetPlayerName(string guid) => guid switch { // TODO
                "6478E542-4E96-421B-987F-767A3171B766" => "staziz",
                "1744A9C2-C357-48BE-B955-50374801877A" => "jalechaki",
                "E05E5FA4-DA8C-4CBC-B9DB-231BAE63A970" => "test_player",
                _ => throw new ArgumentOutOfRangeException(nameof(guid), $"Player with GUID '{guid}' does not exist in current game")
        };

        #region PlayerActions
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
        #endregion

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
    public class Player : IEquatable<Player> {
        public string NickName { get; init; }
        public string ConnectionId { get; init; }
        public Guid Guid { get; init; }

        public bool Equals(Player other) {
            if(other == null) {
                return false;
            }
            return Guid.Equals(other.Guid);
        }
    }
}