﻿using Hanabi.Models;

namespace Hanabi.Game;
public class GameModel {
    public GameModel(IReadOnlyList<Guid> playerOrder) {
        Deck = new();
        Fireworks = new();
        PlayerOrder = playerOrder;
        GameStatus = GameStatus.Pending;
        _isMock = true;
    }
    public GameModel(IEnumerable<Card> deck,
                    int informationTokens,
                    int fuseTokens,
                    IReadOnlyCollection<CardColor> colors,
                    IReadOnlyList<Guid> playerOrder,
                    IReadOnlyDictionary<Guid, IEnumerable<HeldCard>> playerHands) {
        Deck = deck.ToList();
        InformationTokens = informationTokens;
        FuseTokens = fuseTokens;
        Fireworks = colors.ToDictionary(c => c, _ => 0);
        PlayerOrder = playerOrder;
        ActivePlayerIndex = 0;
        PlayerHands = playerHands.ToDictionary(kv => kv.Key, kv => kv.Value.ToList());
        GameStatus = GameStatus.Pending;
    }

    public List<Card> Deck { get; }
    public int InformationTokens { get; set; }
    public int FuseTokens { get; set; }
    public Dictionary<CardColor, int> Fireworks { get; }
    public Dictionary<Guid, List<HeldCard>> PlayerHands { get; }
    public Guid ActivePlayer => PlayerOrder[ActivePlayerIndex];
    public IReadOnlyList<Guid> PlayerOrder { get; }
    public int ActivePlayerIndex { get; set; }
    public int TotalTurnsCount { get; set; }
    public GameStatus GameStatus { get; set; }
    public int LastThreeTurns { get; set; } = -1;
    bool _isMock;
    public bool IsMock() => _isMock;
}