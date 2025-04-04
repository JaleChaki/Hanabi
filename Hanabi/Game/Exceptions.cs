using Hanabi.Game;

namespace Hanabi.Exceptions;

// TODO: Localize all exceptions

#region GameRelatexdExceptions
public class GameExceptionBase : Exception {
    public GameExceptionBase(string message) : base(message) { }
}
public class GameNotFoundException : GameExceptionBase {
    public GameNotFoundException() : base("Game not found") { }
}
public class GameAlreadyStartedException : GameExceptionBase {
    public GameAlreadyStartedException() : base("Game already started.") { }
}
public class GameAlreadyFullException : GameExceptionBase {
    public GameAlreadyFullException() : base("Game is already at full capacity.") { }
}
// TODO
public class GameNotStartedException : GameExceptionBase {
    public GameNotStartedException(string message) : base(message) { }
}
// TODO
public class GameNotInProgressException : GameExceptionBase {
    public GameNotInProgressException(string message) : base(message) { }
}
public class GameAlreadyFinishedException : GameExceptionBase {
    public GameAlreadyFinishedException() : base("You cannot continue already finished game") { }
}
public class InvalidGameStateException : GameExceptionBase {
    public InvalidGameStateException(string message) : base(message) { }
}
public class InvalidGameActionException : GameExceptionBase {
    public InvalidGameActionException(string message) : base(message) { }
}
// TODO
public class InvalidGameLinkException : GameExceptionBase {
    public InvalidGameLinkException(string message) : base(message) { }
}
#endregion
#region PlayerRelatedExceptions
public class PlayerExceptionBase : Exception {
    public PlayerExceptionBase(string message) : base(message) { }
}
public class PlayerNotFoundException : PlayerExceptionBase {
    public PlayerNotFoundException(Guid playerId) : this(playerId.ToString()) { }
    public PlayerNotFoundException(string playerId) : base($"Player with GUID '{playerId}' not found") { }
    public PlayerNotFoundException(Guid playerId, string additionalMessage) : this(playerId.ToString(), additionalMessage) { }
    public PlayerNotFoundException(string playerId, string additionalMessage) : base($"Player with GUID '{playerId}' not found: {additionalMessage}") { }
}
// TODO
public class PlayerAlreadyInGameException : PlayerExceptionBase {
    public PlayerAlreadyInGameException(string message) : base(message) { }
}
// public class InvalidPlayerStateException : PlayerExceptionBase {
//     public InvalidPlayerStateException(string message) : base(message) { }
// }
#endregion
#region CardRelatedExceptions
public class CardExceptionBase : Exception {
    public CardExceptionBase(string message) : base(message) { }
}
public class CardNotFoundException : CardExceptionBase {
    public CardNotFoundException(int cardIndex) : this(cardIndex.ToString()) { }
    public CardNotFoundException(CardColor cardColor) : this(cardColor.ToString()) { }
    public CardNotFoundException(string cardId) : base($"Invalid card {cardId}") { }
}
// TODO
public class CardAlreadyHintedException : CardExceptionBase {
    public CardAlreadyHintedException(string message) : base(message) { }
}
#endregion