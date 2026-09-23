/**
 * What to pronounce after a check on the practice page (issue #1368).
 *
 * One utterance per check, the largest unit the learner has earned:
 *
 *   last check          -> the sentence, whatever the answers were
 *   everything correct  -> the sentence
 *   otherwise           -> the first fully correct pattern, else the first fully correct chunk
 *   nothing qualifies   -> silence
 *
 * A unit is "fully correct" when the check touched at least one word inside it and marked none of
 * them wrong — so a right answer inside a botched sentence still gets its chunk read out.
 *
 * "The sentence" is the one holding the first fully correct chunk or pattern, not simply the first
 * sentence of the snippet: that is where the learner just got something right.
 */
import { hiddenFeatures } from 'Utilities/common'
import { getChunkSpans, getPatternSpans } from 'Utilities/snippetRanges'

// Audio is only available on the staging server, so dev and staging print the decision instead —
// including the silent case, which is otherwise indistinguishable from the code never running.
const log = message => {
  if (hiddenFeatures) console.log(`[practice-tts] ${message}`)
}

// Whitespace is a word of its own in a snippet, so the surfaces join with no separator.
const textOf = words =>
  words
    .map(word => word.surface)
    .join('')
    .replaceAll('\n', ' ')
    .trim()

const wasTested = word => Boolean(word.tested)
const wasCorrect = word => Boolean(word.tested) && !word.isWrong

const isFullyCorrect = ({ words }) => {
  const tested = words.filter(wasTested)
  return tested.length > 0 && tested.every(wasCorrect)
}

// Every fully correct unit, in reading order. Ties keep patterns ahead of chunks, matching the
// order the units themselves are offered in.
const correctUnitsInOrder = snippet => {
  const units = [
    ...getPatternSpans(snippet)
      .filter(isFullyCorrect)
      .map(span => ({ ...span, kind: 'pattern' })),
    ...getChunkSpans(snippet)
      .filter(isFullyCorrect)
      .map(span => ({ ...span, kind: 'chunk' })),
  ]

  return units.sort((a, b) => snippet.indexOf(a.words[0]) - snippet.indexOf(b.words[0]))
}

// The sentence a word belongs to, not the whole snippet — a snippet can hold several.
const sentenceAround = (snippet, word) => {
  const sentenceId = word?.sentence_id

  if (sentenceId === undefined || sentenceId === null) return snippet
  return snippet.filter(other => other.sentence_id === sentenceId)
}

const describeUnit = unit => {
  if (!unit) return 'via first exercise'
  return `via ${unit.kind}${unit.kind === 'pattern' ? ` ${unit.id}` : ''} "${textOf(unit.words)}"`
}

export const pickContextToSpeak = (snippet, { lastCheck = false } = {}) => {
  if (!snippet?.length) {
    log('nothing · no snippet')
    return null
  }

  const correctUnits = correctUnitsInOrder(snippet)
  // Nothing was answered correctly (the last check speaks up anyway), so fall back to the sentence
  // the exercises are in.
  const anchor = correctUnits[0]
  const sentence = textOf(sentenceAround(snippet, anchor?.words[0] ?? snippet.find(wasTested)))

  const tested = snippet.filter(wasTested)

  if (lastCheck) {
    log(`sentence · last check · ${describeUnit(anchor)} · "${sentence}"`)
    return sentence
  }

  if (tested.length > 0 && tested.every(wasCorrect)) {
    log(`sentence · all correct · ${describeUnit(anchor)} · "${sentence}"`)
    return sentence
  }

  const pattern = correctUnits.find(unit => unit.kind === 'pattern')
  if (pattern) {
    const text = textOf(pattern.words)
    log(`pattern ${pattern.id} · first correct pattern · "${text}"`)
    return text
  }

  const chunk = correctUnits.find(unit => unit.kind === 'chunk')
  if (chunk) {
    const text = textOf(chunk.words)
    log(`chunk · first correct chunk · "${text}"`)
    return text
  }

  log('nothing · no fully-correct unit')
  return null
}

// Logged rather than silent: a missing voice for the language looks exactly like a logic failure.
export const logMissingVoice = learningLanguage =>
  log(`not spoken · no voice configured for ${learningLanguage}`)
