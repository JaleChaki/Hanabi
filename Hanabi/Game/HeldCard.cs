namespace Hanabi.Game {
    public class HeldCard : Card {

        public HeldCard(int number, int color, bool colorIsKnown, bool numberIsKnown) : base(number, color) {
            ColorIsKnown = colorIsKnown;
            NumberIsKnown = numberIsKnown;
        }

        public bool ColorIsKnown { get; set; }

        public bool NumberIsKnown { get; set; }

    }
}