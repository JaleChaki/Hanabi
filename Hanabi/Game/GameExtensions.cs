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
            for(var i = 0; i < sourceLength; i++) {
                var rndIndex = random.Next(sourceLength);
                yield return sourceList[rndIndex];
                sourceList.Swap(i, rndIndex);
            }
        }
        private static void Swap<T>(this IList<T> source, int index1, int index2) {
            (source[index1], source[index2]) = (source[index2], source[index1]);
        }
    }
}