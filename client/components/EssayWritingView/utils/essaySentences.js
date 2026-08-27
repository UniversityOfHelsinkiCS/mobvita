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

// Build the essay focus for a text selection: the sentence it lands in and the selected word/range
// inside it. Null for a collapsed caret or a selection outside a completed sentence.
export const getEssayFocusFromSelection = (sentences, text, selectionStart, selectionEnd) => {
  const startIndex = Math.min(selectionStart, selectionEnd)
  const endIndex = Math.max(selectionStart, selectionEnd)
  const focusedSentence = getCompletedSentenceNearIndex(sentences, startIndex)

  if (!focusedSentence) return null

  if (startIndex !== endIndex) {
    const selectionOverlapsSentence =
      focusedSentence.startIndex < endIndex && focusedSentence.endIndex > startIndex

    if (!selectionOverlapsSentence) return null

    const startOffset =
      Math.max(startIndex, focusedSentence.startIndex) - focusedSentence.startIndex
    const endOffset = Math.min(endIndex, focusedSentence.endIndex) - focusedSentence.startIndex
    const selectedText = text.slice(
      focusedSentence.startIndex + startOffset,
      focusedSentence.startIndex + endOffset,
    )

    return {
      correctedText: null,
      focusedSentence: focusedSentence.text,
      focusedWord: selectedText.trim() || null,
      focusedWordId: null,
      originalText: focusedSentence.text,
      sentenceId: focusedSentence.sentenceId,
      selection: {
        endOffset,
        sentenceId: focusedSentence.sentenceId,
        selectedText,
        startOffset,
      },
    }
  }

  return null
}

export const getFirstChangedIndex = (previousText, nextText) => {
  const maxSharedLength = Math.min(previousText.length, nextText.length)

  for (let index = 0; index < maxSharedLength; index += 1) {
    if (previousText[index] !== nextText[index]) {
      return index
    }
  }

  return maxSharedLength
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

// The ids of the sentences this edit produced by splitting or merging. One in / many out is a
// split, many in / one out a merge, many in / many out a rewrite across boundaries. Per the agreed
// contract the sentences that come out of any of those are not versions of what they replaced, so
// they stop being original. An insertion, a deletion and a plain in-place edit leave history alone.
export const getSplitOrMergedSentenceIds = (previousSentences, nextSentences) => {
  const { changedPreviousCount, changedNext } = getSentenceEditWindow(
    previousSentences,
    nextSentences,
  )

  if (changedPreviousCount < 1 || changedNext.length < 1) return []
  if (changedPreviousCount === 1 && changedNext.length === 1) return []

  return changedNext.map(sentence => sentence.sentenceId)
}

// The sentences this edit deleted outright, each with the sentence that now stands after it — the
// anchor the save payload uses to put it back in its place. A deletion at the very end of the essay
// has no following sentence, so its anchor is null and it is appended.
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
