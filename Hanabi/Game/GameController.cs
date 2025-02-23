using Hanabi.Game.Commands;
using Hanabi.Hubs;
using Hanabi.Models;
using Microsoft.AspNetCore.SignalR;

namespace Hanabi.Game {
    public class GameController {
        private readonly object _syncRoot = new object();
        private GameModel _gameModel;

		public GameController(GameModel gameModel) {
            _gameModel = gameModel;
            Players = new();
        }

        private List<Player> Players { get; }

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
                    FuseTokens = _gameModel.FuseTokens,
                    InformationTokens = _gameModel.InformationTokens,
                    CardsInDeck = _gameModel.Deck.Count,
                    Fireworks = _gameModel.Fireworks.OrderBy(x => x.Key).Select(x => x.Value).ToArray(),
                    Players = _gameModel.PlayerOrder.Select(id => {
                        var isSessionOwner = playerId == id;
                        return new SerializedPlayer {
                            IsActivePlayer = _gameModel.ActivePlayer == playerId,
                            IsSessionOwner = isSessionOwner,
                            Nick = GetPlayerName(id.ToString().ToUpper()),
                            HeldCards = _gameModel.PlayerHands[id].Select(card => new SerializedCard {
                                Color = !isSessionOwner || card.ColorIsKnown ? (int)card.Color : (int)default(CardColor),
                                Number = !isSessionOwner || card.NumberIsKnown ? card.Number : 0,
                                ColorIsKnown = card.ColorIsKnown,
                                NumberIsKnown = card.NumberIsKnown
                            }).ToArray()
                        };
                    }).ToArray(),
                    TurnIndex = _gameModel.TotalTurnsCount
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
            if(options.CardColor.HasValue && !_gameModel.Fireworks.ContainsKey(options.CardColor.Value))
                throw new ArgumentException("specified card color is not presented in game");

            lock(_syncRoot) {
                EnsureActivePlayer(currentPlayerId);

                var command = new MakeHintCommand(_gameModel, targetPlayerId, options);
                command.Apply();
            }
        }

        public void DropCard(Guid currentPlayerId, int cardIndex) {
            EnsurePlayerExists(currentPlayerId);

            lock(_syncRoot) {
                EnsureActivePlayer(currentPlayerId);
                EnsureCardIndex(currentPlayerId, cardIndex);

                var command = new DropCardCommand(_gameModel, cardIndex);
                command.Apply();
            }
        }

        public void PlayCard(Guid currentPlayerId, int cardIndex) {
            EnsurePlayerExists(currentPlayerId);

            lock(_syncRoot) {
                EnsureActivePlayer(currentPlayerId);
                EnsureCardIndex(currentPlayerId, cardIndex);

                var command = new PlayCardCommand(_gameModel, cardIndex);
                command.Apply();
            }
        }
        #endregion

        private void EnsurePlayerExists(Guid playerId) {
            if(!_gameModel.PlayerOrder.Contains(playerId))
                throw new ArgumentException("Invalid player id", nameof(playerId));
        }

        private void EnsureActivePlayer(Guid playerId) {
            if(playerId != _gameModel.ActivePlayer)
                throw new ArgumentException("Invalid active player", nameof(playerId));
        }

        private void EnsureCardIndex(Guid playerId, int cardIndex) {
            if(cardIndex >= _gameModel.PlayerHands[playerId].Count || cardIndex < 0)
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