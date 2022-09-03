namespace Hanabi.Models {
    public class SerializedPlayer {

        public string Nick { get; init; }

        public IReadOnlyList<SerializedCard> HeldCards { get; init; }

    }
}