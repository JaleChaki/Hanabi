using Hanabi.Game;

namespace Hanabi.Exceptions;

// TODO: Localize all exceptions

#region GameRelatexdExceptions
public class GameNotFoundException : Exception {
    public GameNotFoundException() : base("Game not found") { }
}
// TODO
public class GameAlreadyStartedException : Exception {
    public GameAlreadyStartedException(string message) : base(message) { }
}
public class GameAlreadyFullException : Exception {
    public GameAlreadyFullException() : base("Game is already at full capacity.") { }
}
// TODO
public class GameNotStartedException : Exception {
    public GameNotStartedException(string message) : base(message) { }
}
// TODO
public class GameNotInProgressException : Exception {
    public GameNotInProgressException(string message) : base(message) { }
}
public class GameAlreadyFinishedException : Exception {
    public GameAlreadyFinishedException() : base("You cannot continue already finished game") { }
}
public class InvalidGameStateException : Exception {
    public InvalidGameStateException(string message) : base(message) { }
}
public class InvalidGameActionException : Exception {
    public InvalidGameActionException(string message) : base(message) { }
}
// TODO
public class InvalidGameLinkException : Exception {
    public InvalidGameLinkException(string message) : base(message) { }
}
#endregion
#region PlayerRelatedExceptions
public class PlayerNotFoundException : Exception {
    public PlayerNotFoundException(Guid playerId) : this(playerId.ToString()) { }
    public PlayerNotFoundException(string playerId) : base($"Player with GUID '{playerId}' not found") { }
    public PlayerNotFoundException(Guid playerId, string additionalMessage) : this(playerId.ToString(), additionalMessage) { }
    public PlayerNotFoundException(string playerId, string additionalMessage) : base($"Player with GUID '{playerId}' not found: {additionalMessage}") { }
}
// TODO
public class PlayerAlreadyInGameException : Exception {
    public PlayerAlreadyInGameException(string message) : base(message) { }
}
// public class InvalidPlayerStateException : Exception {
//     public InvalidPlayerStateException(string message) : base(message) { }
// }
#endregion
#region CardRelatedExceptions
public class CardNotFoundException : Exception {
    public CardNotFoundException(int cardIndex) : this(cardIndex.ToString()) { }
    public CardNotFoundException(CardColor cardColor) : this(cardColor.ToString()) { }
    public CardNotFoundException(string cardId) : base($"Invalid card {cardId}") { }
}
// TODO
public class CardAlreadyHintedException : Exception {
    public CardAlreadyHintedException(string message) : base(message) { }
}
#endregion