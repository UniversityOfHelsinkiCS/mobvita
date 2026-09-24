/**
 * What to pronounce after a check on the practice page (issue #1368).
 *
 * One utterance per check, the largest unit the learner has earned — a ready sentence, else a
 * pattern, else a chunk. A unit is "ready" when the check touched at least one word inside it and
 * marked none of them wrong, so a right answer inside a botched sentence still gets its chunk read
 * out.
 *
 * Across the checks of one snippet, each ready unit is read once: the caller passes the keys of
 * what has already been spoken, and the next check takes the next unit instead of repeating the
 * first. Reading a unit counts for everything inside it — a sentence covers its own chunks and
 * patterns. So every correct answer is pronounced at least once, and none twice.
 *
 * The last check always speaks a sentence, whatever the answers were.
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

// A snippet can hold several sentences; one without sentence ids counts as a single sentence.
const getSentenceSpans = snippet => {
  const wordsBySentence = new Map()

  snippet.forEach(word => {
    const id = word.sentence_id ?? 'all'
    if (!wordsBySentence.has(id)) wordsBySentence.set(id, [])
    wordsBySentence.get(id).push(word)
  })

  return [...wordsBySentence.entries()].map(([id, words]) => ({ id, words }))
}

const unitKey = unit => `${unit.kind}:${unit.id}`

// Everything the learner has earned, largest first: ready sentences, then patterns, then chunks,
// each group in reading order.
const readyUnitsInOrder = snippet => {
  const spans = [
    ...getSentenceSpans(snippet).map(span => ({ ...span, kind: 'sentence' })),
    ...getPatternSpans(snippet).map(span => ({ ...span, kind: 'pattern' })),
    ...getChunkSpans(snippet).map(span => ({
      ...span,
      kind: 'chunk',
      id: `${span.ids[0]}-${span.ids[span.ids.length - 1]}`,
    })),
  ]

  return spans.filter(isFullyCorrect).map(unit => ({ ...unit, key: unitKey(unit) }))
}

// The sentence a word belongs to, not the whole snippet — for the last check, when no sentence is
// ready and there is still something to read out.
const sentenceAround = (snippet, word) => {
  const sentenceId = word?.sentence_id

  if (sentenceId === undefined || sentenceId === null) return snippet
  return snippet.filter(other => other.sentence_id === sentenceId)
}

// Reading a unit aloud also reads everything nested inside it, so those count as spoken too.
const keysCoveredBy = (unit, units) => {
  const spokenIds = new Set(unit.words.map(word => String(word.ID)))

  return units
    .filter(other => other.words.every(word => spokenIds.has(String(word.ID))))
    .map(other => other.key)
}

// The answers as the learner just left them, so the context can be spoken on the click rather than
// a request later: `tested` / `isWrong` only arrive with the check response. A word answered this
// round wins over what the backend last said about it; anything else keeps its existing flags.
export const withLocalAnswers = (snippet, { currentAnswers = {}, correctAnswerIDs = [] } = {}) => {
  const normalise = value =>
    String(value ?? '')
      .trim()
      .toLowerCase()
  const alreadyCorrect = new Set(correctAnswerIDs.map(String))
  const wrongByWord = new Map()

  // Keys are `<word ID>-<candidate id>`, and an untouched exercise still carries its cue as the
  // answer, so it reads as wrong — which is what the check would say about it too.
  Object.entries(currentAnswers).forEach(([key, answer]) => {
    const [wordId] = key.split('-')
    wrongByWord.set(wordId, normalise(answer?.users_answer) !== normalise(answer?.correct))
  })

  return snippet.map(word => {
    const wordId = String(word.ID)

    if (alreadyCorrect.has(wordId)) return { ...word, tested: true, isWrong: false }
    if (wrongByWord.has(wordId)) return { ...word, tested: true, isWrong: wrongByWord.get(wordId) }
    return word
  })
}

// Returns { text, keys } — the utterance and the unit keys it covers, which the caller adds to the
// set it passes back on the next check. Null when there is nothing new to say.
export const pickContextToSpeak = (snippet, { lastCheck = false, spoken = new Set() } = {}) => {
  if (!snippet?.length) {
    log('nothing · no snippet')
    return null
  }

  const ready = readyUnitsInOrder(snippet)
  const unspoken = ready.filter(unit => !spoken.has(unit.key))

  if (lastCheck) {
    // A sentence either way: the one still unspoken, else the sentence the exercises sit in.
    const unit = unspoken.find(candidate => candidate.kind === 'sentence')
    const fallbackWord = ready[0]?.words[0] ?? snippet.find(wasTested)
    const words = unit?.words ?? sentenceAround(snippet, fallbackWord)
    const text = textOf(words)

    log(`sentence · last check · "${text}"`)
    return { text, keys: unit ? keysCoveredBy(unit, ready) : [] }
  }

  const unit = unspoken[0]
  if (!unit) {
    log(ready.length ? 'nothing · every ready unit already pronounced' : 'nothing · no ready unit')
    return null
  }

  const keys = keysCoveredBy(unit, ready)
  const text = textOf(unit.words)
  const left = unspoken.filter(candidate => !keys.includes(candidate.key)).length

  log(`${unit.kind} ${unit.id}${left ? ` · ${left} more ready` : ''} · "${text}"`)
  return { text, keys }
}

// Kept per browser: there is no backend field for it, and it is a listening preference rather than
// something the learner's account needs to carry around.
const SPEECH_SETTING_KEY = 'practice-context-speech'

// On unless it has been switched off, so a fresh browser hears the context.
export const contextSpeechEnabled = () => {
  try {
    return window.localStorage.getItem(SPEECH_SETTING_KEY) !== 'off'
  } catch {
    return true
  }
}

export const setContextSpeechEnabled = enabled => {
  try {
    window.localStorage.setItem(SPEECH_SETTING_KEY, enabled ? 'on' : 'off')
  } catch {
    // A browser with site data blocked just keeps the default for the session.
  }
}

export const logSpeechSwitchedOff = () => log('not spoken · switched off in practice settings')

// The feature is limited to high-access users while it is being trialled.
export const logNoSpeechAccess = () => log('not spoken · needs high access')

// Logged rather than silent: a missing voice for the language looks exactly like a logic failure.
export const logMissingVoice = learningLanguage =>
  log(`not spoken · no voice configured for ${learningLanguage}`)
