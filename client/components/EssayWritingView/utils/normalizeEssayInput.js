// Zero-width / invisible characters to strip.
const INVISIBLE_CODE_POINTS = [
  0x200b, // zero-width space
  0x200c, // zero-width non-joiner
  0x200d, // zero-width joiner
  0x2060, // word joiner
  0xfeff, // byte order mark / zero-width no-break space
  0x00ad, // soft hyphen
]

// Hyphen / minus look-alikes folded to an ASCII hyphen. En dash (0x2013) and em dash (0x2014)
// are intentionally kept as they are legitimate punctuation.
const HYPHEN_LOOKALIKE_CODE_POINTS = [
  0x2010, // hyphen
  0x2011, // non-breaking hyphen
  0x2012, // figure dash
  0x2015, // horizontal bar
  0x2212, // minus sign
]

// Build a global character-class regex from code points (kept as numbers so the source has no
// invisible/look-alike characters). None of these are regex-special, so no escaping is needed.
const buildCharClassRegex = codePoints =>
  new RegExp(`[${codePoints.map(codePoint => String.fromCodePoint(codePoint)).join('')}]`, 'g')

const INVISIBLE_CHARS_REGEX = buildCharClassRegex(INVISIBLE_CODE_POINTS)
const HYPHEN_LOOKALIKES_REGEX = buildCharClassRegex(HYPHEN_LOOKALIKE_CODE_POINTS)

// Normalize essay input on-site: compose diacritics (a + combining diaeresis -> ä, е + combining
// diaeresis -> ё), strip invisible characters, and fold hyphen look-alikes. Generic across
// languages — NFC covers the composition for every script; per-language maps can be layered here
// later if needed.
export const normalizeEssayInput = (value = '') =>
  value
    .normalize('NFC')
    .replace(INVISIBLE_CHARS_REGEX, '')
    .replace(HYPHEN_LOOKALIKES_REGEX, '-')
