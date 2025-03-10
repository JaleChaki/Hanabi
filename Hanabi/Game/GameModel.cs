using Hanabi.Models;

namespace Hanabi.Game;
public class GameModel {
    public GameModel(IReadOnlyList<Guid> playerOrder) {
        Deck = new();
        Fireworks = new();
        PlayerOrder = playerOrder;
        GameStatus = GameStatus.Pending;
        IsMock = true;
    }
    public GameModel(Guid id,
                    IEnumerable<Card> deck,
                    int informationTokens,
                    int fuseTokens,
                    IReadOnlyCollection<CardColor> colors,
                    IReadOnlyList<Guid> playerOrder,
                    IReadOnlyDictionary<Guid, IEnumerable<HeldCard>> playerHands) {
        GameId = id;
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
    public Guid GameId { get; }
    public bool IsMock { get; }
}