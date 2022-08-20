namespace Hanabi.Models {
    public class HintOptions {

        private HintOptions(int? cardNumber, int? cardColor) {
            CardNumber = cardNumber;
            CardColor = cardColor;
        }

        public int? CardNumber { get; }

        public int? CardColor { get; }

        public static HintOptions FromCardNumber(int cardNumber) {
            return new HintOptions(cardNumber, null);
        }

        public static HintOptions FromCardColor(int cardColor) {
            return new HintOptions(null, cardColor);
        }

    }
}