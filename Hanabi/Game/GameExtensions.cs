namespace Hanabi.Game {
    public static class GameExtensions {
        public static IEnumerable<T> Shuffle<T>(this IEnumerable<T> source) {
            return source.Shuffle(new Random());
        }
        public static IEnumerable<T> Shuffle<T>(this IEnumerable<T> source, Random random) {
            return source.ShuffleIterator(random);
        }
        private static IEnumerable<T> ShuffleIterator<T>(this IEnumerable<T> source, Random random) {
            var sourceList = source.ToList();
            var sourceLength = sourceList.Count;
            for(var i = 0; i < sourceLength - 2; i++) {
                var rndIndex = random.Next(i, sourceLength);
                yield return sourceList[rndIndex];
                sourceList.Swap(i, rndIndex);
            }
            yield return sourceList[sourceLength - 2];
            yield return sourceList[sourceLength - 1];
        }
        private static void Swap<T>(this IList<T> source, int index1, int index2) {
            (source[index1], source[index2]) = (source[index2], source[index1]);
        }
    }
}