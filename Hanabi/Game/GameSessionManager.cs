﻿using Hanabi.Exceptions;
using Hanabi.Game.Commands;
using Hanabi.Hubs;
using Hanabi.Models;
using Microsoft.AspNetCore.SignalR;

namespace Hanabi.Game;
public class GameSessionManager {
    private readonly Guid _gameId;
    private readonly object _syncRoot = new object();
    private GameModel _gameModel;
    private List<Player> Players { get; }

    public GameSessionManager(Guid gameId) {
        Players = new();
        _gameModel = GameModelBuilder.CreateMock(gameId, Players.Select(p => p.Guid).ToArray());
        _gameId = gameId;
    }

    public GameStatus GameStatus => _gameModel.Status;
    public Guid GameId => _gameId;

    public void RegisterPlayer(Guid gameId, Guid playerId, string nickName, string connectionId) {
        bool alreadyRegistered = Players.Exists(p => p.Guid == playerId);
        if(!alreadyRegistered) {
            Players.Add(new Player() {
                NickName = nickName,
                Guid = playerId,
                ConnectionId = connectionId
            });
            _gameModel = GameModelBuilder.CreateMock(gameId, Players.Select(p => p.Guid).ToArray());
        }
    }

    public void RemovePlayer(Guid playerId) {
        lock (_syncRoot) {
            EnsurePlayerExists(playerId);
            var index = Players.FindIndex(p => p.Guid == playerId);
            if (index == -1) {
                throw new PlayerNotFoundException(playerId, "Player not found in the session (how?)");
            }
            if(_gameModel.Status != GameStatus.Pending) {
                _gameModel.Status = GameStatus.Paused;
                throw new InvalidPlayerStateException($"Player {Players[index].NickName} exit the game, let's wait for him to rejoin");
            }
            if(!_gameModel.IsMock) {
                throw new GameAlreadyStartedException();
            }
            Players.RemoveAt(index);
            if(GetCurrentPlayersCount() != 0) {
                _gameModel = GameModelBuilder.CreateMock(_gameId, Players.Select(p => p.Guid).ToArray());
            }
        }
    }

    public string GetPlayerConnectionId(string nickname) {
        return Players.FirstOrDefault(p => p.NickName == nickname).ConnectionId;
    }

    public void Start() {
        _gameModel = GameModelBuilder.CreateNew(_gameId, Players.Select(p => p.Guid).ToArray());
        _gameModel.Status = GameStatus.InProgress;
    }

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
                        Id = id,
                        Nick = GetPlayerName(id),
                        HeldCards = _gameModel.IsMock ? null : _gameModel.PlayerHands[id].Select(card => new SerializedCard {
                            Color = !isSessionOwner || card.ColorIsKnown ? (int)card.Color : (int)default(CardColor),
                            Number = !isSessionOwner || card.NumberIsKnown ? card.Number : 0,
                            ColorIsKnown = card.ColorIsKnown,
                            NumberIsKnown = card.NumberIsKnown
                        }).ToArray()
                    };
                }).ToArray(),
                DiscardPile = _gameModel.DiscardPile.Select(card => new SerializedCard {
                    Color = (int) card.Color,
                    Number = card.Number
                }).ToArray(),
                TurnIndex = _gameModel.TotalTurnsCount,
                GameStatus = _gameModel.Status,
                GameLink = _gameModel.ToUrlSafeShortString() // TODO: ???
            };
        }
        return result;
    }

    private string GetPlayerName(Guid playerId) => 
        Players.Find(p => p.Guid.Equals(playerId))?.NickName 
        ?? throw new PlayerNotFoundException(playerId);

    #region PlayerActions
    public void MakeHint(Guid currentPlayerId, Guid targetPlayerId, HintOptions options) {
        if(_gameModel.InformationTokens < 1) {
            throw new InvalidGameActionException("You cannot give hints when there's no information tokens left");
        }
        EnsurePlayerExists(targetPlayerId);
        EnsurePlayerExists(currentPlayerId);
        if(currentPlayerId == targetPlayerId)
            throw new InvalidGameActionException("current and target player can not be equal");
        if(options.CardColor.HasValue && !_gameModel.Fireworks.ContainsKey(options.CardColor.Value))
            throw new InvalidGameActionException("specified card color is not presented in game");

        lock(_syncRoot) {
            EnsureActivePlayer(currentPlayerId);

            var command = new MakeHintCommand(_gameModel, targetPlayerId, options);
            command.Apply();
        }
    }

    public void DropCard(Guid currentPlayerId, int cardIndex) {
        if(_gameModel.InformationTokens == 8) {
            throw new InvalidGameActionException("You cannot drop cards when there's all 8 information tokens available");
        }
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
            throw new PlayerNotFoundException(playerId, "Invalid player id");
    }

    private void EnsureActivePlayer(Guid playerId) {
        if(playerId != _gameModel.ActivePlayer)
            throw new PlayerNotFoundException(playerId, "Invalid active player");
    }

    private void EnsureCardIndex(Guid playerId, int cardIndex) {
        if(cardIndex >= _gameModel.PlayerHands[playerId].Count || cardIndex < 0)
            throw new CardNotFoundException(cardIndex);
    }

    internal int GetCurrentPlayersCount() {
        return Players.Count;
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