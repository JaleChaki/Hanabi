using Xunit;
using Hanabi.Game;

namespace Hanabi.Server.Tests;
public class ExtensionTests {
    [Theory, CombinatorialData]
    public void ShuffledRagneMustContainAllNumbersOnlyOnce([CombinatorialRange(1, 15)] int seed) {
        var range = Enumerable.Range(1, 256);
        var shuffledRange = range.Shuffle(new Random(seed));

        Assert.Equal(256, shuffledRange.Count());
        Assert.NotEqual(range, shuffledRange);
        Assert.Equal(range, shuffledRange.OrderBy(i => i));
    }
}