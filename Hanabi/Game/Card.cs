namespace Hanabi.Game;
public class Card {

    public Card(int number, CardColor color) {
        Number = number;
        Color = color;
    }

    public int Number { get; }

    public CardColor Color { get; }

}