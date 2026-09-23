/**
 * Chunk and pattern spans of a snippet, read from the markers the backend puts on each word:
 *
 *   chunk:   'chunk_start' / 'chunk_end', in pairs — the circled phrase ("a white dog")
 *   pattern: { <PATTERN_ID>: 'pattern_start' | 'pattern_end' } — the underlined government /
 *            construction context; a word can sit inside several patterns at once
 *
 * Shared by the text rendering (circles and underlines) and by the practice pronunciation, which
 * needs the same spans to decide what to read aloud.
 */

// Word id -> the ids of its whole chunk, and word id -> the pattern ids open at that word.
export const getIdxToStyleRange = snippet => {
  const idx2chunk = {}
  const idx2pattern = {}

  if (snippet) {
    const chunkStarts = []
    const chunkEnds = []
    const openPatterns = new Set()

    for (const word of snippet) {
      const chunkPosition = word.chunk && word.chunk.split('_')[1]
      const { pattern, ID } = word

      if (chunkPosition === 'start') chunkStarts.push(Number(ID))
      if (chunkPosition === 'end') chunkEnds.push(Number(ID))

      // A pattern covers the word that closes it, so the closing ids are dropped only afterwards.
      const closing = new Set()
      for (const [patternId, position] of Object.entries(pattern || {})) {
        if (position === 'pattern_start') openPatterns.add(patternId)
        if (position === 'pattern_end') closing.add(patternId)
      }

      if (openPatterns.size) {
        idx2pattern[ID] = [...(idx2pattern[ID] || []), ...openPatterns]
      }

      for (const patternId of closing) openPatterns.delete(patternId)
    }

    for (let i = 0; i < Math.min(chunkStarts.length, chunkEnds.length); i += 1) {
      for (let j = chunkStarts[i]; j <= chunkEnds[i]; j += 1) {
        idx2chunk[j] = Array.from(
          { length: chunkEnds[i] - chunkStarts[i] + 1 },
          (_, x) => x + chunkStarts[i],
        )
      }
    }
  }

  return { idx2chunk, idx2pattern }
}

// The words of a span, whitespace tokens included — they are words of their own in a snippet.
export const spanWords = (snippet, ids) => {
  const wanted = new Set(ids.map(String))
  return snippet.filter(word => wanted.has(String(word.ID)))
}

// Every pattern in the snippet, in the order the patterns open.
export const getPatternSpans = snippet => {
  const { idx2pattern } = getIdxToStyleRange(snippet)
  const wordsByPattern = new Map()

  snippet.forEach(word => {
    const openHere = idx2pattern[word.ID]
    if (!openHere) return
    openHere.forEach(patternId => {
      if (!wordsByPattern.has(patternId)) wordsByPattern.set(patternId, [])
      wordsByPattern.get(patternId).push(word)
    })
  })

  return [...wordsByPattern.entries()].map(([id, words]) => ({ id, words }))
}

// Every chunk in the snippet, in reading order. One id range is one chunk, however many of its
// words point at it.
export const getChunkSpans = snippet => {
  const { idx2chunk } = getIdxToStyleRange(snippet)
  const seen = new Set()

  return snippet.reduce((spans, word) => {
    const ids = idx2chunk[word.ID]
    if (!ids) return spans

    const key = ids.join(',')
    if (seen.has(key)) return spans
    seen.add(key)

    return [...spans, { ids, words: spanWords(snippet, ids) }]
  }, [])
}
