// GemSpark is a real, small editorial motif — only 3 posts in the whole
// corpus reference it. Legacy derived the subtitle at runtime with a regex
// against each post's raw markdown heading line (`## ...GemSpark... —
// <subtitle>`); Portable Text has no equivalent raw heading string to regex
// against post-migration, so these were extracted once, by hand, straight
// from the source heading line in client/src/data/blogData.json — this is
// real ported content, not invented copy. A post whose heading had no
// em-dash suffix (india-my-virtual-soul-home) legitimately has no subtitle
// in legacy either.
export const GEM_SPARK_SUBTITLES: Record<string, string> = {
  "five-cups": "BrewSoul Edition",
  "you-are-the-moat": "One city at a time, starting June",
};
