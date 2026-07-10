// The backend marks a deleted/inserted slot with U+25AC (▬), the "black rectangle" placeholder.
export const CORRECTION_PLACEHOLDER = String.fromCodePoint(0x25ac)

const INSERTION_ORIGINAL_VALUES = new Set(['', CORRECTION_PLACEHOLDER])
const DELETION_CORRECTION_VALUES = new Set([CORRECTION_PLACEHOLDER])

export const getCorrectionText = value =>
  value === null || value === undefined ? '' : String(value)

const normalizeSearchText = value => getCorrectionText(value).normalize('NFC')

export const isCorrectionInsertion = word => {
  const originalText = normalizeSearchText(word.original).trim()
  const correctedText = normalizeSearchText(word.corrected).trim()

  return (
    Boolean(word.corrected) &&
    !DELETION_CORRECTION_VALUES.has(correctedText) &&
    (word.original === null || INSERTION_ORIGINAL_VALUES.has(originalText))
  )
}

export const isCorrectionDeletion = word => {
  const originalText = normalizeSearchText(word.original).trim()
  const correctedText = normalizeSearchText(word.corrected).trim()

  return (
    Boolean(word.corrected) &&
    DELETION_CORRECTION_VALUES.has(correctedText) &&
    !INSERTION_ORIGINAL_VALUES.has(originalText)
  )
}

const isCorrectionReplacement = word =>
  Boolean(word.original) &&
  Boolean(word.corrected) &&
  !isCorrectionInsertion(word) &&
  !isCorrectionDeletion(word)

// The overall type of a correction group (a bubble). A group may hold several words, so
// multi if a mix otherwise replacement, insertion or deletion.
export const getCorrectionGroupType = correctionGroup => {
  const words = correctionGroup?.words || []
  const hasReplacement = words.some(isCorrectionReplacement)
  const hasInsertion = words.some(isCorrectionInsertion)
  const hasDeletion = words.some(isCorrectionDeletion)

  if (
    (hasReplacement && hasInsertion) ||
    (hasReplacement && hasDeletion) ||
    (hasInsertion && hasDeletion)
  ) {
    return 'multi'
  }
  if (hasReplacement) return 'replacement'
  if (hasInsertion) return 'insertion'
  if (hasDeletion) return 'deletion'
  return null
}

export const getCorrectionFeedbackText = feedback => {
  if (!feedback) return ''
  if (typeof feedback === 'string') return feedback

  return [...(feedback.requested_hints || []), ...(feedback.hints || [])]
    .map(hint => hint.easy)
    .filter(Boolean)
    .join('\n')
}

const getComparableCorrectionText = value => normalizeSearchText(value).trim().toLocaleLowerCase()

const combiningMarkRegex = /[\u0300-\u036f]/

const getNextTextCluster = (value, startOffset) => {
  let endOffset = startOffset + 1

  while (endOffset < value.length && combiningMarkRegex.test(value[endOffset])) {
    endOffset += 1
  }

  return {
    endOffset,
    startOffset,
    text: value.slice(startOffset, endOffset),
  }
}

const createNormalizedSearchIndex = value => {
  const normalizedOffsetToSourceOffset = [0]
  let normalizedText = ''
  let sourceOffset = 0

  while (sourceOffset < value.length) {
    const cluster = getNextTextCluster(value, sourceOffset)
    const normalizedClusterStartOffset = normalizedText.length
    const normalizedClusterText = cluster.text.normalize('NFC')

    normalizedText += normalizedClusterText

    for (let index = 1; index <= normalizedClusterText.length; index += 1) {
      normalizedOffsetToSourceOffset[normalizedClusterStartOffset + index] = cluster.endOffset
    }

    normalizedOffsetToSourceOffset[normalizedClusterStartOffset] = cluster.startOffset
    sourceOffset = cluster.endOffset
  }

  return {
    normalizedOffsetToSourceOffset,
    normalizedText,
  }
}

const getWordOriginalText = word =>
  !isCorrectionInsertion(word) && word.original ? String(word.original) : ''

const getWordPositionsById = (sentence, words) => {
  const { normalizedOffsetToSourceOffset, normalizedText } = createNormalizedSearchIndex(sentence)
  const positionsById = {}
  let currentNormalizedOffset = 0

  words.forEach(word => {
    if (isCorrectionInsertion(word)) {
      const sourceOffset =
        normalizedOffsetToSourceOffset[currentNormalizedOffset] ?? sentence.length

      positionsById[word.ID] = {
        startOffset: sourceOffset,
        endOffset: sourceOffset,
        isInsertion: true,
      }
      return
    }

    const originalText = getWordOriginalText(word)

    if (!originalText) return

    const normalizedOriginalText = normalizeSearchText(originalText)
    const normalizedStartIndex = normalizedText.startsWith(
      normalizedOriginalText,
      currentNormalizedOffset,
    )
      ? currentNormalizedOffset
      : normalizedText.indexOf(normalizedOriginalText, currentNormalizedOffset)

    if (normalizedStartIndex === -1) return

    const normalizedEndIndex = normalizedStartIndex + normalizedOriginalText.length
    const startOffset = normalizedOffsetToSourceOffset[normalizedStartIndex]
    const endOffset = normalizedOffsetToSourceOffset[normalizedEndIndex]

    if (!Number.isInteger(startOffset) || !Number.isInteger(endOffset)) return

    positionsById[word.ID] = {
      startOffset,
      endOffset,
      isDeletion: isCorrectionDeletion(word),
    }
    currentNormalizedOffset = normalizedEndIndex
  })

  return positionsById
}

const wordHasCorrection = word => Boolean(word.corrected)

const getCorrectionWordIds = word =>
  Array.isArray(word.error_span) && word.error_span.length ? word.error_span : [word.ID]

const getPositionedWords = positionsById =>
  Object.entries(positionsById)
    .map(([id, range]) => ({ id: Number(id), range }))
    .sort((firstWord, secondWord) => firstWord.id - secondWord.id)

const getNearestWordRange = (word, positionsById) => {
  const wordId = Number(word.ID)
  const positionedWords = getPositionedWords(positionsById)
  const previousWord = positionedWords
    .slice()
    .reverse()
    .find(positionedWord => positionedWord.id <= wordId)
  const nextWord = positionedWords.find(positionedWord => positionedWord.id >= wordId)

  return previousWord?.range || nextWord?.range || null
}

const getInsertionRange = (word, positionsById) => {
  const wordId = Number(word.ID)
  const positionedWords = getPositionedWords(positionsById)
  const previousWord = positionedWords
    .slice()
    .reverse()
    .find(positionedWord => positionedWord.id < wordId)
  const nextWord = positionedWords.find(positionedWord => positionedWord.id > wordId)
  const offset = previousWord?.range.endOffset ?? nextWord?.range.startOffset ?? 0

  return {
    startOffset: offset,
    endOffset: offset,
    isInsertion: true,
  }
}

const getCorrectionRange = (word, positionsById) => {
  if (isCorrectionInsertion(word)) {
    return positionsById[word.ID] || getInsertionRange(word, positionsById)
  }

  const wordRanges = getCorrectionWordIds(word)
    .map(wordId => positionsById[wordId])
    .filter(Boolean)

  if (!wordRanges.length) {
    return positionsById[word.ID] || getNearestWordRange(word, positionsById)
  }

  return {
    startOffset: Math.min(...wordRanges.map(range => range.startOffset)),
    endOffset: Math.max(...wordRanges.map(range => range.endOffset)),
    isDeletion: isCorrectionDeletion(word),
  }
}

const rangesAreAdjacent = (sentence, firstRange, secondRange) => {
  if (!firstRange || !secondRange) return false

  const textBetweenRanges = sentence.slice(firstRange.endOffset, secondRange.startOffset)

  return /^\s*$/.test(textBetweenRanges)
}

const mergeRanges = (firstRange, secondRange) => {
  if (!firstRange) return secondRange
  if (!secondRange) return firstRange

  const mergedRange = {
    startOffset: Math.min(firstRange.startOffset, secondRange.startOffset),
    endOffset: Math.max(firstRange.endOffset, secondRange.endOffset),
  }

  mergedRange.isDeletion = firstRange.isDeletion || secondRange.isDeletion
  mergedRange.isInsertion = firstRange.isInsertion || secondRange.isInsertion

  return mergedRange
}

const getMovedCorrectionGroups = (corrections, positionsById) => {
  const usedCorrectionIndexes = new Set()
  const groups = []

  corrections.forEach((word, insertionIndex) => {
    if (!isCorrectionInsertion(word) || usedCorrectionIndexes.has(insertionIndex)) return

    const insertedText = getComparableCorrectionText(word.corrected)

    if (!insertedText) return

    const matchingDeletion = corrections
      .map((candidate, index) => ({ candidate, index }))
      .filter(
        ({ candidate, index }) =>
          !usedCorrectionIndexes.has(index) &&
          isCorrectionDeletion(candidate) &&
          getComparableCorrectionText(candidate.original) === insertedText,
      )
      .sort(
        (firstMatch, secondMatch) =>
          Math.abs(firstMatch.index - insertionIndex) -
          Math.abs(secondMatch.index - insertionIndex),
      )[0]

    if (!matchingDeletion) return

    const startIndex = Math.min(insertionIndex, matchingDeletion.index)
    const endIndex = Math.max(insertionIndex, matchingDeletion.index)
    const range = mergeRanges(positionsById[word.ID], positionsById[matchingDeletion.candidate.ID])

    usedCorrectionIndexes.add(insertionIndex)
    usedCorrectionIndexes.add(matchingDeletion.index)
    groups.push({ endIndex, range, startIndex })
  })

  const mergedGroups = groups
    .sort((firstGroup, secondGroup) => firstGroup.startIndex - secondGroup.startIndex)
    .reduce((merged, group) => {
      const previousGroup = merged[merged.length - 1]

      if (!previousGroup || group.startIndex > previousGroup.endIndex) {
        return merged.concat(group)
      }

      previousGroup.endIndex = Math.max(previousGroup.endIndex, group.endIndex)
      previousGroup.range = mergeRanges(previousGroup.range, group.range)
      return merged
    }, [])
    .map(group => ({
      range: group.range,
      words: corrections.slice(group.startIndex, group.endIndex + 1),
    }))

  const movedWordIds = new Set()

  mergedGroups.forEach(group => {
    group.words.forEach(word => movedWordIds.add(word.ID))
  })

  return { groups: mergedGroups, movedWordIds }
}

// A chunk marker on a token: the backend sends it as `token.feedback.chunk` = "chunk_start" or
// "chunk_end".
const getChunkMarker = word => {
  const marker = word?.feedback?.chunk

  if (marker === 'chunk_start') return 'start'
  if (marker === 'chunk_end') return 'end'
  return null
}

const hasChunkMarkers = corrections => corrections.some(getChunkMarker)

// Token index ranges delimited by chunk-start / chunk-end markers. Missing markers are inferred so
// partial backend data still yields sensible chunks: a stray end starts its chunk after the
// previous one, and an unclosed start runs to the last token.
const getChunkTokenRanges = corrections => {
  const chunks = []
  let openStart = null
  let lastEnd = -1

  corrections.forEach((word, index) => {
    const marker = getChunkMarker(word)

    if (marker === 'start') {
      // Keep the earliest start of a nested/repeated run so the chunk isn't truncated.
      if (openStart === null) openStart = index
    } else if (marker === 'end') {
      chunks.push({ startIndex: openStart != null ? openStart : lastEnd + 1, endIndex: index })
      openStart = null
      lastEnd = index
    }
  })

  if (openStart != null) {
    chunks.push({ startIndex: openStart, endIndex: corrections.length - 1 })
  }

  return chunks
}

// Group tokens by chunk: each chunk becomes one bubble holding all its tokens (correct ones too, so
// they can be shown with a neutral background). A chunk's textarea range spans its errors. Any
// corrected token outside every chunk falls back to its own single-error group so nothing is lost.
const getChunkCorrectionGroups = (sentence, corrections) => {
  const positionsById = getWordPositionsById(sentence, corrections)

  const buildChunkRange = words => {
    const errorRanges = words
      .filter(wordHasCorrection)
      .map(word => getCorrectionRange(word, positionsById))
      .filter(Boolean)

    // An all-correct chunk has no error ranges, so fall back to the positions of its tokens so it
    // still gets a (non-error) range and renders as a bubble.
    const ranges = errorRanges.length
      ? errorRanges
      : words.map(word => positionsById[word.ID]).filter(Boolean)

    if (!ranges.length) return null

    const startOffset = Math.min(...ranges.map(range => range.startOffset))
    const endOffset = Math.max(...ranges.map(range => range.endOffset))

    return {
      startOffset,
      endOffset,
      isDeletion: errorRanges.some(range => range.isDeletion),
      // Only a genuinely zero-width range is an insertion point; a multi-error span is not.
      isInsertion: startOffset === endOffset && errorRanges.every(range => range.isInsertion),
    }
  }

  const chunkedIndexes = new Set()
  const chunkGroups = getChunkTokenRanges(corrections)
    .map(({ startIndex, endIndex }) => {
      for (let index = startIndex; index <= endIndex; index += 1) chunkedIndexes.add(index)

      const words = corrections.slice(startIndex, endIndex + 1)
      const range = buildChunkRange(words)

      return range ? { range, words } : null
    })
    .filter(Boolean)

  const leftoverGroups = corrections
    .map((word, index) => ({ word, index }))
    .filter(({ word, index }) => wordHasCorrection(word) && !chunkedIndexes.has(index))
    .map(({ word }) => {
      const range = getCorrectionRange(word, positionsById)

      return range ? { range, words: [word] } : null
    })
    .filter(Boolean)

  return chunkGroups
    .concat(leftoverGroups)
    .sort(
      (firstGroup, secondGroup) =>
        (firstGroup.range?.startOffset ?? 0) - (secondGroup.range?.startOffset ?? 0),
    )
}

export const getCorrectionGroups = (sentence, corrections) => {
  // When the backend marks chunks, each chunk gets its own bubble instead of the default adjacency
  // grouping.
  if (hasChunkMarkers(corrections)) {
    return getChunkCorrectionGroups(sentence, corrections)
  }

  const positionsById = getWordPositionsById(sentence, corrections)
  const { groups: movedCorrectionGroups, movedWordIds } = getMovedCorrectionGroups(
    corrections,
    positionsById,
  )
  const adjacentCorrectionGroups = corrections
    .filter(word => wordHasCorrection(word) && !movedWordIds.has(word.ID))
    .map(word => ({
      range: getCorrectionRange(word, positionsById),
      words: [word],
    }))
    .reduce((groups, correction) => {
      const previousGroup = groups[groups.length - 1]

      if (previousGroup && rangesAreAdjacent(sentence, previousGroup.range, correction.range)) {
        previousGroup.words = previousGroup.words.concat(correction.words)
        previousGroup.range = mergeRanges(previousGroup.range, correction.range)
        return groups
      }

      return groups.concat(correction)
    }, [])

  return movedCorrectionGroups
    .concat(adjacentCorrectionGroups)
    .sort(
      (firstGroup, secondGroup) =>
        (firstGroup.range?.startOffset ?? 0) - (secondGroup.range?.startOffset ?? 0),
    )
}

// The full corrected sentence text for a correction entry (falls back to rebuilding it from the
// individual word corrections).
export const getCorrectedTextFromCorrectionEntry = correctionEntry => {
  if (!correctionEntry) return ''
  if (correctionEntry.correctedText) return correctionEntry.correctedText

  return (correctionEntry.corrections || [])
    .map(word =>
      isCorrectionDeletion(word) ? '' : getCorrectionText(word.corrected ?? word.original),
    )
    .join('')
}

const getCorrectionWordFocusText = word => {
  const displayedText = isCorrectionDeletion(word)
    ? getCorrectionText(word.original)
    : getCorrectionText(word.corrected || word.original)

  return displayedText.trim()
}

// The focus payload (focusedWord text + word ids) for a correction group. Shared so that a bubble
// click and a text-area click on the same correction produce identical focus.
export const getCorrectionGroupFocus = correctionGroup => {
  const words = correctionGroup?.words || []
  // Only the tokens that actually carry a correction — a chunk group also holds correct tokens that
  // must not leak into the focused word/ids sent to the chatbot.
  const correctedWords = words.filter(
    word =>
      isCorrectionDeletion(word) ||
      isCorrectionInsertion(word) ||
      (word.original && word.corrected),
  )
  const focusedWordIds = correctedWords
    .map(word => word.ID)
    .filter(wordId => wordId !== null && wordId !== undefined)

  return {
    focusedWord: correctedWords.map(getCorrectionWordFocusText).filter(Boolean).join(' '),
    focusedWordId: focusedWordIds[0] ?? null,
    focusedWordIds,
  }
}

// Find the correction group whose range covers a sentence-relative offset (e.g. a caret click).
// Zero-width insertion ranges are ignored because an inserted word has no clickable original text.
// Returns null when the offset is not on a correction.
export const findCorrectionGroupAtOffset = (sentence, corrections, offset) => {
  if (!sentence || !Array.isArray(corrections) || !corrections.length) return null
  if (!Number.isInteger(offset)) return null

  const groups = getCorrectionGroups(sentence, corrections)

  const groupCoversOffset = (group, targetOffset) => {
    const range = group?.range
    if (!range || range.endOffset <= range.startOffset) return false
    return range.startOffset <= targetOffset && targetOffset < range.endOffset
  }

  return (
    groups.find(group => groupCoversOffset(group, offset)) ||
    groups.find(group => groupCoversOffset(group, offset - 1)) ||
    null
  )
}

// Find the insertion (zero-width) correction group nearest to a sentence-relative offset, within
// `tolerance` characters. This lets a caret click in the gap where a word should be inserted select
// that insertion, since insertions have no character span of their own to click on.
export const findInsertionGroupNearOffset = (sentence, corrections, offset, tolerance = 1) => {
  if (!sentence || !Array.isArray(corrections) || !corrections.length) return null
  if (!Number.isInteger(offset)) return null

  const groups = getCorrectionGroups(sentence, corrections)
  let nearest = null
  let nearestDistance = tolerance + 1

  groups.forEach(group => {
    const range = group?.range

    if (!range || range.endOffset !== range.startOffset) return

    const distance = Math.abs(range.startOffset - offset)

    if (distance <= tolerance && distance < nearestDistance) {
      nearest = group
      nearestDistance = distance
    }
  })

  return nearest
}
