using Hanabi.Game;

namespace Hanabi.Models;
public class HintOptions {

    private HintOptions(int? cardNumber, CardColor? cardColor) {
        CardNumber = cardNumber;
        CardColor = cardColor;
    }

    public int? CardNumber { get; }

    public CardColor? CardColor { get; }

    public static HintOptions FromCardNumber(int cardNumber) {
        return new HintOptions(cardNumber, null);
    }

    public static HintOptions FromCardColor(int cardColor) {
        if(cardColor > 5 || cardColor < 1)
            throw new ArgumentException("wrong card color", nameof(cardColor));
        return new HintOptions(null, (CardColor) cardColor);
    }

}