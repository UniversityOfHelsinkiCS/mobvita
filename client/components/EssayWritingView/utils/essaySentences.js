const sentenceMatchRegex = /[^.!?]+[.!?]+/g
const sentenceEndingRegex = /[.!?]/

const getCompletedSentenceMatches = text => Array.from(text.matchAll(sentenceMatchRegex))

export const getCompletedSentences = text => {
  const matches = getCompletedSentenceMatches(text)

  return matches.map((match, index) => {
    const rawSentenceText = match[0]
    const sentenceText = rawSentenceText.trim()
    const leadingWhitespaceLength = rawSentenceText.length - rawSentenceText.trimStart().length
    const startIndex = match.index + leadingWhitespaceLength

    return {
      text: sentenceText,
      startIndex,
      endIndex: startIndex + sentenceText.length,
      context: matches
        .slice(Math.max(index - 3, 0), index)
        .map(contextMatch => contextMatch[0].trim())
        .join(' '),
    }
  })
}

export const cursorIsInsideSentence = (sentence, cursorIndex) =>
  cursorIndex >= sentence.startIndex && cursorIndex < sentence.endIndex

const getCompletedSentenceAtIndex = (sentences, cursorIndex) =>
  sentences.find(sentence => cursorIsInsideSentence(sentence, cursorIndex)) || null

export const getCompletedSentenceNearIndex = (sentences, cursorIndex) =>
  getCompletedSentenceAtIndex(sentences, cursorIndex) ||
  getCompletedSentenceAtIndex(sentences, Math.max(cursorIndex - 1, 0))

const wordCharacterRegex = /[\p{L}\p{N}'\u2019-]/u

const isWordCharacterAt = (text, position) =>
  position >= 0 && position < text.length && wordCharacterRegex.test(text[position])

// The word the character at `index` belongs to, as absolute [start, end) offsets; null on a space.
const getWordSpanContaining = (text, index) => {
  if (!isWordCharacterAt(text, index)) return null

  let start = index
  while (isWordCharacterAt(text, start - 1)) start -= 1

  let end = index + 1
  while (isWordCharacterAt(text, end)) end += 1

  return { start, end }
}

// The word a caret sits strictly inside (a word character on both sides); a caret at a word's edge
// is next to it, not in it.
const getWordSpanInside = (text, caretIndex) =>
  isWordCharacterAt(text, caretIndex - 1) ? getWordSpanContaining(text, caretIndex) : null

const whitespaceRegex = /\s/

// The essay focus for a dragged passage of any length: the trimmed selection as a text selection,
// with every sentence it touches as context. Keyed to the first, or to its position past the last.
export const getEssayFocusFromTextRange = (sentences, text, selectionStart, selectionEnd) => {
  let start = Math.min(selectionStart, selectionEnd)
  let end = Math.max(selectionStart, selectionEnd)

  while (start < end && whitespaceRegex.test(text[start])) start += 1
  while (end > start && whitespaceRegex.test(text[end - 1])) end -= 1

  if (start === end) return null

  const touchedSentences = sentences.filter(
    sentence => sentence.startIndex < end && sentence.endIndex > start,
  )
  const firstSentence = touchedSentences[0] || null
  const lastSentence = touchedSentences[touchedSentences.length - 1] || null
  const contextText = text
    .slice(
      Math.min(start, firstSentence ? firstSentence.startIndex : start),
      Math.max(end, lastSentence ? lastSentence.endIndex : end),
    )
    .trim()
  const anchorIndex = firstSentence ? firstSentence.startIndex : 0
  const selectedText = text.slice(start, end)
  const sentenceId = firstSentence?.sentenceId ?? null

  return {
    correctedText: null,
    feedbackText: '',
    focusedSentence: contextText,
    focusedWord: selectedText,
    focusedWordId: null,
    focusedWordIds: [],
    originalText: contextText,
    sentenceId,
    selection: {
      end,
      endOffset: end - anchorIndex,
      isTextSelection: true,
      selectedText,
      sentenceId,
      start,
      startOffset: start - anchorIndex,
    },
  }
}

// The essay focus for a word of the user's own: `isTextSelection` has the chatbot pin the word
// itself. Null off a word, or outside a completed sentence (nothing has been said about it yet).
const getEssayFocusFromWordSpan = (sentences, text, wordSpan) => {
  if (!wordSpan) return null

  const sentence = getCompletedSentenceNearIndex(sentences, wordSpan.start)

  if (!sentence) return null
  if (sentence.startIndex > wordSpan.start || sentence.endIndex < wordSpan.end) return null

  const startOffset = wordSpan.start - sentence.startIndex
  const endOffset = wordSpan.end - sentence.startIndex
  const selectedText = text.slice(wordSpan.start, wordSpan.end)

  return {
    correctedText: null,
    feedbackText: '',
    focusedSentence: sentence.text,
    focusedWord: selectedText,
    focusedWordId: null,
    focusedWordIds: [],
    originalText: sentence.text,
    sentenceId: sentence.sentenceId,
    selection: {
      endOffset,
      isTextSelection: true,
      selectedText,
      sentenceId: sentence.sentenceId,
      startOffset,
    },
  }
}

// A click: the word whose letter is under the pointer.
export const getEssayFocusFromGlyph = (sentences, text, glyphIndex) =>
  getEssayFocusFromWordSpan(sentences, text, getWordSpanContaining(text, glyphIndex))

// A caret with no pointer to go by: the word it sits strictly inside.
export const getEssayFocusFromCaretWord = (sentences, text, caretIndex) =>
  getEssayFocusFromWordSpan(sentences, text, getWordSpanInside(text, caretIndex))

export const getFirstChangedIndex = (previousText, nextText) => {
  const maxSharedLength = Math.min(previousText.length, nextText.length)

  for (let index = 0; index < maxSharedLength; index += 1) {
    if (previousText[index] !== nextText[index]) {
      return index
    }
  }

  return maxSharedLength
}

// The stretch an edit replaced: old [start, previousEnd) became new [start, nextEnd). Repeated
// letters make it ambiguous ("o" before "olen" = "o" after its first letter); the caret settles it.
export const getEditSpan = (previousText, nextText, caretIndex = nextText.length) => {
  let start = getFirstChangedIndex(previousText, nextText)
  const maxSuffixLength = Math.min(previousText.length, nextText.length) - start
  let suffixLength = 0

  while (
    suffixLength < maxSuffixLength &&
    previousText[previousText.length - 1 - suffixLength] ===
      nextText[nextText.length - 1 - suffixLength]
  ) {
    suffixLength += 1
  }

  let previousEnd = previousText.length - suffixLength
  let nextEnd = nextText.length - suffixLength

  while (
    nextEnd > caretIndex &&
    start > 0 &&
    previousText[previousEnd - 1] === nextText[nextEnd - 1]
  ) {
    start -= 1
    previousEnd -= 1
    nextEnd -= 1
  }

  return { start, previousEnd, nextEnd }
}

export const getCompletedSentenceFromIndexes = (sentences, indexes, textLength) => {
  for (const index of indexes) {
    const sentence = getCompletedSentenceNearIndex(
      sentences,
      Math.max(Math.min(index, textLength), 0),
    )

    if (sentence) return sentence
  }

  return null
}

export const getUpdatedPendingSentence = (sentences, pendingSentence) => {
  if (!pendingSentence) return null

  return (
    sentences.find(sentence => sentence.sentenceId === pendingSentence.sentenceId) ||
    getCompletedSentenceAtIndex(sentences, pendingSentence.startIndex) ||
    getCompletedSentenceAtIndex(sentences, Math.max(pendingSentence.endIndex - 1, 0))
  )
}

const getSentenceIndexAtTextIndex = (sentences, cursorIndex) =>
  sentences.findIndex(sentence => cursorIsInsideSentence(sentence, cursorIndex))

export const sentenceWasCompletedByCurrentInput = ({
  completedSentence,
  cursorIndex,
  nextCompletedSentences,
  nextText,
  previousCompletedSentences,
}) =>
  nextCompletedSentences.length > previousCompletedSentences.length &&
  completedSentence?.endIndex === cursorIndex &&
  sentenceEndingRegex.test(nextText[cursorIndex - 1] || '')

export const completedSentencesChanged = (previousSentences, nextSentences) => (
  previousSentences.length !== nextSentences.length ||
  previousSentences.some((sentence, index) => {
    const nextSentence = nextSentences[index]

    return (
      !nextSentence ||
      sentence.text !== nextSentence.text ||
      sentence.startIndex !== nextSentence.startIndex ||
      sentence.endIndex !== nextSentence.endIndex
    )
  })
)

// The number of leading sentences whose text is unchanged between the two lists.
const getUnchangedPrefixLength = (previousSentences, nextSentences) => {
  const maxLength = Math.min(previousSentences.length, nextSentences.length)
  let length = 0

  while (length < maxLength && previousSentences[length].text === nextSentences[length].text) {
    length += 1
  }

  return length
}

// The number of trailing sentences whose text is unchanged between the two lists, ignoring the ones
// already covered by the unchanged prefix.
const getUnchangedSuffixLength = (previousSentences, nextSentences, prefixLength) => {
  const maxLength = Math.min(
    previousSentences.length - prefixLength,
    nextSentences.length - prefixLength,
  )
  let length = 0

  while (
    length < maxLength &&
    previousSentences[previousSentences.length - 1 - length].text ===
      nextSentences[nextSentences.length - 1 - length].text
  ) {
    length += 1
  }

  return length
}

// Narrow an edit down to the sentences it actually touched: the window between the unchanged
// prefix and suffix, with the sentences inside it that never changed paired off (two edits far
// apart put untouched sentences between them). What is left on each side is what went in and what
// came out.
const getSentenceEditWindow = (previousSentences, nextSentences) => {
  const prefixLength = getUnchangedPrefixLength(previousSentences, nextSentences)
  const suffixLength = getUnchangedSuffixLength(previousSentences, nextSentences, prefixLength)
  const previousWindow = previousSentences.slice(
    prefixLength,
    previousSentences.length - suffixLength,
  )
  const nextWindow = nextSentences.slice(prefixLength, nextSentences.length - suffixLength)
  const unchanged = previousWindow.reduce(
    (counts, sentence) => counts.set(sentence.text, (counts.get(sentence.text) ?? 0) + 1),
    new Map(),
  )
  const changedNext = nextWindow.filter(sentence => {
    const remaining = unchanged.get(sentence.text) ?? 0
    if (!remaining) return true
    unchanged.set(sentence.text, remaining - 1)
    return false
  })
  // How many of the sentences that went in were actually replaced: the window's own count, less the
  // ones that came back out untouched.
  const changedPreviousCount = previousWindow.length - (nextWindow.length - changedNext.length)

  return { prefixLength, previousWindow, changedPreviousCount, changedNext }
}

// What an edit that moved a sentence boundary did: which sentences came out of it, and which of
// the ones that went in have no successor. One in / many out is a split, many in / one out a merge,
// many in / many out a rewrite across boundaries. Everything that comes out descends from the first
// sentence that went in, so it carries that sentence's history and the essay's original keeps it.
// The remaining sentences that went in are gone from the current version but were still written, so
// they are handed back as removed, anchored after the block that replaced them.
export const getSentenceRestructure = (previousSentences, nextSentences) => {
  const { prefixLength, previousWindow, changedPreviousCount, changedNext } = getSentenceEditWindow(
    previousSentences,
    nextSentences,
  )
  const none = { inheritedFromSentenceId: null, sentenceIds: [], removedSentences: [] }

  if (changedPreviousCount < 1 || changedNext.length < 1) return none
  if (changedPreviousCount === 1 && changedNext.length === 1) return none

  // Whatever follows the sentences that replaced this block — where the parents that no longer
  // exist are put back, so they sit after their replacement rather than in front of it.
  const anchor = nextSentences[prefixLength + changedNext.length] ?? null

  return {
    inheritedFromSentenceId: previousWindow[0]?.sentenceId ?? null,
    sentenceIds: changedNext.map(sentence => sentence.sentenceId),
    removedSentences: previousWindow
      .slice(1)
      .map(sentence => ({ sentence, anchorSentenceId: anchor?.sentenceId ?? null })),
  }
}

// The sentences this edit deleted outright, each anchored to the sentence that now stands after
// it — the place the save payload puts it back. A deletion at the very end of the essay has no
// following sentence, so its anchor is null and it is appended.
export const getDeletedSentences = (previousSentences, nextSentences) => {
  const { prefixLength, previousWindow, changedPreviousCount, changedNext } = getSentenceEditWindow(
    previousSentences,
    nextSentences,
  )

  if (changedNext.length || changedPreviousCount < 1) return []

  const anchorSentenceId = nextSentences[prefixLength]?.sentenceId ?? null

  return previousWindow.map(sentence => ({ sentence, anchorSentenceId }))
}

export const getSentencesWithNewCorrectionKeys = (
  previousSentences,
  nextSentences,
  getCorrectionKey,
) => {
  const previousCorrectionKeys = new Set(previousSentences.map(getCorrectionKey))
  const queuedCorrectionKeys = new Set()

  return nextSentences.filter(sentence => {
    const correctionKey = getCorrectionKey(sentence)

    if (previousCorrectionKeys.has(correctionKey) || queuedCorrectionKeys.has(correctionKey)) {
      return false
    }

    queuedCorrectionKeys.add(correctionKey)
    return true
  })
}

export const addStableSentenceIds = ({
  createSentenceId,
  editIndex,
  previousSentences,
  sentences,
}) => {
  if (!previousSentences.length) {
    return sentences.map(sentence => ({
      ...sentence,
      sentenceId: createSentenceId(),
    }))
  }

  if (previousSentences.length === sentences.length) {
    return sentences.map((sentence, index) => ({
      ...sentence,
      sentenceId: previousSentences[index].sentenceId,
    }))
  }

  const usedSentenceIds = new Set()
  const sentenceIdsByIndex = {}
  const previousIndexAtEdit = getSentenceIndexAtTextIndex(previousSentences, editIndex)
  const currentIndexAtEdit = getSentenceIndexAtTextIndex(sentences, editIndex)
  const previousTargetIndex =
    previousIndexAtEdit !== -1
      ? previousIndexAtEdit
      : getSentenceIndexAtTextIndex(previousSentences, Math.max(editIndex - 1, 0))
  const currentTargetIndex =
    currentIndexAtEdit !== -1
      ? currentIndexAtEdit
      : getSentenceIndexAtTextIndex(sentences, Math.max(editIndex - 1, 0))

  const assignReusableSentenceId = (sentenceIndex, previousIndex) => {
    const previousSentenceId = previousSentences[previousIndex]?.sentenceId

    if (!previousSentenceId || usedSentenceIds.has(previousSentenceId)) {
      return false
    }

    usedSentenceIds.add(previousSentenceId)
    sentenceIdsByIndex[sentenceIndex] = previousSentenceId
    return true
  }

  sentences.forEach((sentence, index) => {
    const reusablePreviousIndex = previousSentences.reduce(
      (bestMatch, previousSentence, previousIndex) => {
        if (
          previousSentence.text !== sentence.text ||
          usedSentenceIds.has(previousSentence.sentenceId)
        ) {
          return bestMatch
        }

        if (bestMatch === -1 || Math.abs(previousIndex - index) < Math.abs(bestMatch - index)) {
          return previousIndex
        }

        return bestMatch
      },
      -1,
    )

    if (reusablePreviousIndex !== -1) {
      assignReusableSentenceId(index, reusablePreviousIndex)
    }
  })

  return sentences.map((sentence, index) => {
    if (sentenceIdsByIndex[index]) {
      return {
        ...sentence,
        sentenceId: sentenceIdsByIndex[index],
      }
    }

    if (currentTargetIndex === -1 || previousTargetIndex === -1) {
      assignReusableSentenceId(index, index)

      return {
        ...sentence,
        sentenceId: sentenceIdsByIndex[index] || createSentenceId(),
      }
    }

    if (index < currentTargetIndex) {
      assignReusableSentenceId(index, index)

      return {
        ...sentence,
        sentenceId: sentenceIdsByIndex[index] || createSentenceId(),
      }
    }

    if (index === currentTargetIndex) {
      assignReusableSentenceId(index, previousTargetIndex)

      return {
        ...sentence,
        sentenceId: sentenceIdsByIndex[index] || createSentenceId(),
      }
    }

    const previousIndex = previousTargetIndex + (index - currentTargetIndex)

    assignReusableSentenceId(index, previousIndex)

    return {
      ...sentence,
      sentenceId: sentenceIdsByIndex[index] || createSentenceId(),
    }
  })
}
