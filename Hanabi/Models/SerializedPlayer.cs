﻿namespace Hanabi.Models;
public class SerializedPlayer {
    public Guid Id { get; init; }
    public string Nick { get; init; }
    public IReadOnlyList<SerializedCard> HeldCards { get; init; }
    public bool IsActivePlayer { get; set; }
    public bool IsSessionOwner { get; set; }
}