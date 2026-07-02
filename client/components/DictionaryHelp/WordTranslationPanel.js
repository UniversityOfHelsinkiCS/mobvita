import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Popup, Placeholder, PlaceholderLine, Icon } from 'semantic-ui-react'
import { lemmatizer } from 'lemmatizer'
import {
  flashcardColors,
  useLearningLanguage,
  useDictionaryLanguage,
  learningLanguageLocaleCodes,
} from 'Utilities/common'
import { getContextTranslation } from 'Utilities/redux/contextTranslationReducer'
import { changeTranslationStageAction } from 'Utilities/redux/translationReducer'
import { recordFlashcardAnswer } from 'Utilities/redux/flashcardReducer'
import { getWordNestAction } from 'Utilities/redux/wordNestReducer'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import Spinner from 'Components/Spinner'
import WordNestModal from 'Components/WordNestModal'
import { Speaker } from 'Components/DictionaryHelp/dictComponents'
import Lemma from 'Components/DictionaryHelp/Lemma'
import 'Components/PracticeView/CombinedChatbot.scss'

const glossCheckLanguage = ['English']

const WordTranslationPanel = () => {
  const dispatch = useDispatch()
  const learningLanguage = useLearningLanguage()
  const dictionaryLanguage = useDictionaryLanguage()

  const translationState = useSelector(({ translation }) => translation) || {}
  const { data, surfaceWord, pending, maskSymbol } = translationState
  const wordId = translationState.word_id ?? translationState.wordId

  const contextTranslationState = useSelector(({ contextTranslation }) => contextTranslation) || {}
  const paragraphs = useSelector(({ stories }) => stories.focused?.paragraph)
  const words = useSelector(({ wordNest }) => wordNest?.data)

  const [menuOpen, setMenuOpen] = useState(false)
  const [showContextTranslation, setShowContextTranslation] = useState(false)
  const [wordNestModalOpen, setWordNestModalOpen] = useState(false)
  const [wordNestChosenWord, setWordNestChosenWord] = useState('')
  const [wordNestRestoreWord, setWordNestRestoreWord] = useState('')
  const menuRef = useRef(null)

  useEffect(() => {
    setShowContextTranslation(false)
    setMenuOpen(false)
  }, [wordId, surfaceWord])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    const onEsc = e => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onOutside)
      document.removeEventListener('keydown', onEsc)
    }
  }, [menuOpen])

  const findSentenceText = () => {
    if (!Array.isArray(paragraphs) || wordId == null) return ''
    for (const para of paragraphs) {
      if (!Array.isArray(para)) continue
      const token = para.find(t => t.ID === wordId)
      if (token) {
        return para
          .filter(t => t.sentence_id === token.sentence_id)
          .map(t => t.surface)
          .join('')
          .replaceAll('\n', ' ')
          .trim()
      }
    }
    return ''
  }

  const handleSentenceTranslation = () => {
    setMenuOpen(false)
    const sentence = findSentenceText()
    if (!sentence) return
    setShowContextTranslation(true)
    dispatch(
      getContextTranslation(
        sentence,
        learningLanguageLocaleCodes[learningLanguage],
        learningLanguageLocaleCodes[dictionaryLanguage]
      )
    )
  }

  const handleKnowningClick = lemma => {
    dispatch(recordFlashcardAnswer(learningLanguage, dictionaryLanguage, {
      correct: true, answer: null, exercise: 'knowing', hints_shown: 0, mode: 'trans', lemma,
    }))
    dispatch(changeTranslationStageAction(lemma, learningLanguage, dictionaryLanguage, 4))
  }

  const handleNotKnowningClick = lemma => {
    dispatch(recordFlashcardAnswer(learningLanguage, dictionaryLanguage, {
      correct: false, answer: null, exercise: 'knowing', hints_shown: 0, mode: 'trans', lemma,
    }))
    dispatch(changeTranslationStageAction(lemma, learningLanguage, dictionaryLanguage, 0))
  }

  const getLemmaCandidates = lemmaOrLemmas => {
    if (!lemmaOrLemmas || typeof lemmaOrLemmas !== 'string') return []
    const raw = lemmaOrLemmas.trim()
    const split = raw.split('|').map(l => l.trim()).filter(Boolean)
    return [...new Set([raw, ...split])]
  }

  const getNestListForLemma = lemma => {
    if (!lemma) return []
    if (Array.isArray(words)) return words
    return words?.[lemma] || []
  }

  const isWordNestAvailableForLemma = lemmaOrLemmas => {
    if (!(learningLanguage === 'Russian' || learningLanguage === 'Finnish')) return false
    const candidates = getLemmaCandidates(lemmaOrLemmas)
    if (!candidates.length) return false
    return candidates.some(lemma => getNestListForLemma(lemma).length > 0)
  }

  const computeWordNestRestoreWord = () => {
    if (Array.isArray(data) && data.length > 0) {
      const joined = data.map(t => t?.lemma).filter(Boolean).join('+')
      if (joined) return joined
    }
    return translationState?.lemmas || surfaceWord || ''
  }

  const openWordNest = lemma => {
    setWordNestRestoreWord(computeWordNestRestoreWord())
    setWordNestChosenWord(lemma)
    setWordNestModalOpen(true)
  }

  useEffect(() => {
    if (wordNestModalOpen) return
    const lemmasForNest = Array.isArray(data) ? data.map(t => t?.lemma).filter(Boolean).join('+') : null
    if (lemmasForNest && learningLanguage) {
      dispatch(getWordNestAction({ words: lemmasForNest, language: learningLanguage }))
    }
  }, [data, dispatch, learningLanguage, wordNestModalOpen])

  const highlightTarget = translation => {
    if (!translation || !translation['source-segments'] || !translation['target-segments'] || !translation['alignment']) return ''
    const surface = surfaceWord || ''

    const translated_glosses = (data || []).map(t => t.glosses || []).flat().map(g => g.toLowerCase())
    const glosses = glossCheckLanguage.includes(dictionaryLanguage) ? [
      ...translated_glosses,
      ...translated_glosses.map(gloss => gloss.includes(' ') && [gloss, ...gloss.split(' '), ...gloss.split(' ').map(g => lemmatizer(g))] || [lemmatizer(gloss)]).flat(),
    ] : [
      ...translated_glosses,
      ...translated_glosses.filter(gloss => gloss.includes(' ')).map(gloss => gloss.split(' ')).flat(),
    ]

    const glossCheck = p => (
      !glossCheckLanguage.includes(dictionaryLanguage) ||
      glosses.includes(p.trim().toLowerCase()) || glosses.includes(lemmatizer(p.trim().toLowerCase()))
    )

    const targetSents = []
    const targetSentIds = new Set()

    for (let sentId in translation['source-segments']) {
      const sourceIds = []
      let target = ''
      let p = ''
      let q = []

      const srcSegments = translation['source-segments'][sentId]
      for (let s in srcSegments) {
        const segment = srcSegments[s]
        if (!segment) continue
        const first = segment[0]
        if (first === '▁' || (typeof first === 'string' && first.toLowerCase() === first.toUpperCase())) {
          if (p.length && p === surface) sourceIds.push(...q)
          p = segment.replace('▁', '')
          q = [s]
        } else {
          p += segment
          q.push(s)
        }
      }
      if (p.length && p === surface) sourceIds.push(...q)

      let targetIds = []
      try {
        targetIds = sourceIds.map(s => translation['alignment'][sentId] && translation['alignment'][sentId][s]).flat().filter(x => typeof x !== 'undefined')
      } catch (e) {
        targetIds = []
      }

      p = ''
      q = []
      const tgtSegments = translation['target-segments'][sentId]
      for (let s in tgtSegments) {
        const segment = tgtSegments[s]
        if (!segment) continue
        const first = segment[0]
        if (first === '▁' || (typeof first === 'string' && first.toLowerCase() === first.toUpperCase())) {
          if (p.trim().length && targetIds.filter(x => q.includes(x)).length && glossCheck(p)) {
            target += '<b>' + p + '</b>'
            targetSentIds.add(sentId)
          } else
            target += p
          p = segment.replace('▁', ' ')
          q = [s]
        } else {
          p += segment
          q.push(s)
        }
      }

      if (p.length && targetIds.filter(x => q.includes(x)).length && glossCheck(p)) {
        target += '<b>' + p + '</b>'
        targetSentIds.add(sentId)
      } else target += p

      targetSents.push(target.trim())
    }

    if (targetSentIds.size) {
      return [...targetSentIds].sort().map(sentId => targetSents[sentId]).join(' ')
    }
    return targetSents.join(' ')
  }

  const renderContextTranslationContent = () => {
    const d = contextTranslationState.data
    if (!d) return null
    if (typeof d === 'string') return <div className="context-translation-content" dangerouslySetInnerHTML={{ __html: d }} />
    if (d['alignment'] && d['source-segments'] && d['target-segments']) {
      const html = highlightTarget(d)
      return <div className="context-translation-content" dangerouslySetInnerHTML={{ __html: html }} />
    }
    if (d.translation) return <div className="context-translation-content" dangerouslySetInnerHTML={{ __html: d.translation }} />
    if (d['target-sentences']) return (
      <div className="context-translation-content">
        {d['target-sentences'].map((s, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: s }} />
        ))}
      </div>
    )
    return (
      <div className="context-translation-content">
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(d, null, 2)}</pre>
      </div>
    )
  }

  return (
    <div className="dictionary-content" data-cy="dictionary-help" style={{ padding: '0.5em' }}>
      {(learningLanguage === 'Russian' || learningLanguage === 'Finnish') && (
        <WordNestModal
          wordToCheck={wordNestChosenWord}
          setWordToCheck={setWordNestChosenWord}
          open={wordNestModalOpen}
          setOpen={setWordNestModalOpen}
          storyWord={wordNestRestoreWord || translationState.lemmas || surfaceWord}
        />
      )}
      {pending ? (
        <div style={{ padding: '1em' }}>
          {[1, 2, 3].map(line => (
            <div key={line} style={{ marginBottom: '1em' }}>
              <Placeholder>
                <PlaceholderLine />
                <PlaceholderLine width="50%" />
              </Placeholder>
            </div>
          ))}
        </div>
      ) : !surfaceWord ? (
        <div style={{ padding: '1em', opacity: 0.75 }}>
          <FormattedMessage
            id="reading-practice-tap-word-hint"
            defaultMessage="Tap a word in the text to see its translation."
          />
        </div>
      ) : (
        <>
          <div className="chatbot-header" style={{ marginBottom: '1em' }}>
            <div className="bulbs-container" style={{ opacity: 0, pointerEvents: 'none' }} />
            <h4 className="current-word">
              {surfaceWord && surfaceWord !== data?.[0]?.lemma && (
                <Popup
                  content={<FormattedHTMLMessage id="explain-speaker-surface" />}
                  trigger={<Speaker word={surfaceWord} />}
                />
              )}{' '}
              {maskSymbol || surfaceWord}
            </h4>

            <div className="chat-action-menu" ref={menuRef}>
              <button
                type="button"
                className="chat-action-trigger"
                onClick={() => setMenuOpen(prev => !prev)}
                data-cy="chat-action-menu-popup"
              >
                <Icon name={menuOpen ? 'close' : 'ellipsis vertical'} />
              </button>

              {menuOpen && (
                <div className="chat-action-options">
                  <button type="button" className="chat-action-item" onClick={handleSentenceTranslation}>
                    <div className="chat-action-icon" style={{ color: '#17a2b8' }}>
                      <Icon name="book" />
                    </div>
                    <span className="chat-action-text">
                      <FormattedMessage id="dictionaryhelp-show-context-translation" defaultMessage="Translate Sentence" />
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="inline-translation" data-cy="translations">
            {data && data.length > 0 ? (
              data.map((translated, idx) => (
                <Lemma
                  key={translated.URL || translated.lemma || idx}
                  lemma={translated.lemma}
                  userUrl={translated.user_URL}
                  inflectionRef={translated.ref}
                  translations={translated.glosses}
                  preferred={translated.preferred}
                  handleKnowningClick={() => handleKnowningClick(translated.lemma)}
                  handleNotKnowningClick={() => handleNotKnowningClick(translated.lemma)}
                  handleWordNestClick={
                    isWordNestAvailableForLemma(translated.lemma)
                      ? () => openWordNest(translated.lemma)
                      : undefined
                  }
                  showInflactionLink={data.length > 2 && idx > 0}
                  style={{
                    marginBottom: '8px',
                    padding: '15px',
                    borderRadius: '8px',
                    backgroundColor:
                      translated.stage !== undefined
                        ? `${flashcardColors.background[translated.stage]}4D`
                        : '#f9f9f9',
                  }}
                />
              ))
            ) : (
              <p className="no-translation-text">
                <FormattedMessage id="no-translation-found" defaultMessage="No translation found." />
              </p>
            )}
          </div>

          {showContextTranslation && (
            <div className="context-translation-box">
              {contextTranslationState.pending ? (
                <Spinner inline />
              ) : contextTranslationState.data ? (
                renderContextTranslationContent()
              ) : window?.location?.hostname === 'localhost' || window?.location?.hostname === '127.0.0.1' ? (
                // Local dev fallback: the MT backend isn't reachable, so show the original sentence.
                <div className="context-translation-content">
                  <p>{contextTranslationState.lastTrans || surfaceWord || ''}</p>
                </div>
              ) : null}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default WordTranslationPanel
