import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import Box from '@mui/material/Box'
import AppMenu from 'Components/ui/AppMenu'
import AppButton from 'Components/AppButton'
import AppSwitch from 'Components/ui/AppSwitch'
import { colors, font } from 'Assets/mui_theme/designTokens'
import Spinner from 'Components/Spinner'
import { getStoryAction, answerStoryQuestionAction, getStoryReadingQuestionsAction } from 'Utilities/redux/storiesReducer'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import { getContextTranslation } from 'Utilities/redux/contextTranslationReducer'
import { setHelperSidebarOpen, setHelperSidebarTab } from 'Utilities/redux/helperSidebarReducer'
import {
  setFocusedSpan,
  setHighlightRange,
  resetAnnotationCandidates,
  addAnnotationCandidates,
  setAnnotationFormVisibility,
} from 'Utilities/redux/annotationsReducer'
import { clearNotes } from 'Utilities/redux/notesReducer'
import {
  learningLanguageSelector,
  dictionaryLanguageSelector,
  getTextStyle,
  useMTAvailableLanguage,
  learningLanguageLocaleCodes,
  images,
} from 'Utilities/common'
import HighlightedStoryText from 'Components/ReadingComprehension/HighlightedStoryText'
import HelperSidebar from 'Components/PracticeView/HelperSidebar'
import ReadingPracticeChatbot from 'Components/ChatBot/ReadingPracticeChatbot'
import WordTranslationPanel from 'Components/DictionaryHelp/WordTranslationPanel'

const pickQuestionsFromStory = story => {
  if (!story) return []
  if (Array.isArray(story.questions)) return story.questions
  if (Array.isArray(story.q_and_a)) return story.q_and_a
  if (Array.isArray(story.reading_questions)) return story.reading_questions
  return []
}

const normalizeQuestion = q => {
  if (!q) return null
  if (q.question && (q.choices || q.answer)) return q

  if (q.q) {
    const rawSentenceIds =
      q.sentence_ids ?? q.sentence_id ?? q.answer_sentence_ids ?? q.answer_sentence_id

    return {
      ...q,
      question: q.q,
      answer: q.a ?? q.answer,
      choices: Array.isArray(q.choices) ? q.choices : [],
      sentence_ids: Array.isArray(rawSentenceIds)
        ? rawSentenceIds
        : rawSentenceIds != null
        ? [rawSentenceIds]
        : [],
    }
  }

  return q
}

const paragraphToText = paragraph => {
  if (!Array.isArray(paragraph)) return ''
  return paragraph.map(token => token?.surface || '').join('')
}

const findAnswerParagraphIndex = (story, question) => {
  const paragraphs = Array.isArray(story?.paragraph) ? story.paragraph : []
  if (!paragraphs.length || !question) return -1

  const directParagraphIndex =
    question?.paragraph_index ??
    question?.paragraphIndex ??
    question?.answer_paragraph_index ??
    question?.answerParagraphIndex

  if (Number.isInteger(directParagraphIndex) && directParagraphIndex >= 0) {
    return Math.min(directParagraphIndex, paragraphs.length - 1)
  }

  const answer = String(question?.answer || '')
    .trim()
    .toLowerCase()
  if (!answer) return -1

  const paragraphTexts = paragraphs.map(paragraph => paragraphToText(paragraph).toLowerCase())
  return paragraphTexts.findIndex(text => text.includes(answer))
}

const getQuestionSentenceIds = (story, question) => {
  const rawSentenceIds =
    question?.sentence_ids ??
    question?.sentence_id ??
    question?.answer_sentence_ids ??
    question?.answer_sentence_id

  const directIds = (Array.isArray(rawSentenceIds) ? rawSentenceIds : [rawSentenceIds])
    .map(Number)
    .filter(Number.isFinite)

  if (directIds.length) return directIds

  const paragraphIdx = findAnswerParagraphIndex(story, question)
  if (paragraphIdx < 0) return []

  const tokens = story?.paragraph?.[paragraphIdx] || []
  return Array.from(new Set(tokens.map(token => Number(token.sentence_id)).filter(Number.isFinite)))
}

const getQuestionId = question => {
  if (!question) return ''
  return String(question.question_id || '')
}

const AnswerLocationSettings = ({ checked, onChange }) => (
  <AppMenu
    minWidth={260}
    borderRadius="16px"
    disableScrollLock
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    trigger={
      <span
        data-cy="rp-settings-popup"
        role="button"
        tabIndex={0}
        style={{ display: 'inline-flex', cursor: 'pointer' }}
      >
        <img
          src={images.circleSettings}
          alt=""
          style={{ width: 26, height: 26, display: 'block' }}
        />
      </span>
    }
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        minWidth: 220,
      }}
    >
      <span style={{ fontFamily: font.family, fontSize: 14, color: colors.ink }}>
        <FormattedMessage
          id="rp-show-answer-button-setting"
          defaultMessage="Show button “Show answer in text”"
        />
      </span>
      <AppSwitch
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        slotProps={{ input: { 'data-cy': 'rp-show-answer-button-toggle' } }}
      />
    </div>
  </AppMenu>
)

const ReadingPracticeView = () => {
  const dispatch = useDispatch()
  const { id: storyId } = useParams()
    const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const mtLanguages = useMTAvailableLanguage()
  const intl = useIntl()

  const { story, pending } = useSelector(({ stories }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
  }), shallowEqual)

  const { readingQuestions, readingQuestionsPending } = useSelector(({ stories }) => ({
    readingQuestions: stories.readingQuestions,
    readingQuestionsPending: stories.readingQuestionsPending,
  }), shallowEqual)

  const isSidebarOpen = useSelector(state => state.helperSidebar?.isOpen ?? false)

  const questions = useMemo(() => {
    const raw = pickQuestionsFromStory(readingQuestions || {})
    return raw.map(normalizeQuestion).filter(Boolean)
  }, [readingQuestions])

  const readingSessionId = readingQuestions?.session_id

  const [idx, setIdx] = useState(0)
  const current = questions[idx] || null

  const [attemptedWrongChoices, setAttemptedWrongChoices] = useState(new Set())
  const [isCorrectAnswered, setIsCorrectAnswered] = useState(false)
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)
  const [highlightedSentenceIds, setHighlightedSentenceIds] = useState([])
  const [showAnswerLocation, setShowAnswerLocation] = useState(false)
  const [lastAttemptAnswer, setLastAttemptAnswer] = useState('')
  const [showAnswerLocationButtonEnabled, setShowAnswerLocationButtonEnabled] = useState(false)

  useEffect(() => {
    if (!storyId) return
    dispatch(getStoryAction(storyId, 'preview'))          
    dispatch(getStoryReadingQuestionsAction(storyId))     
  }, [dispatch, storyId])

  useEffect(() => {
    setIdx(0)
    setAttemptedWrongChoices(new Set())
    setIsCorrectAnswered(false)
    setShowCorrectAnswer(false)
    setShowAnswerLocation(false)
    setHighlightedSentenceIds([])
    setLastAttemptAnswer('')
  }, [storyId, questions.length])

  const total = questions.length

  const wrongAttemptLimit = Math.max((current?.choices || []).length - 1, 1)

  const attemptsAndFeedbacks = useMemo(() => {
    const wrong = Array.from(attemptedWrongChoices).map(a => ({ attempt: a, feedback: [] }))
    return isCorrectAnswered
      ? [...wrong, { attempt: String(current?.answer ?? ''), feedback: [] }]
      : wrong
  }, [attemptedWrongChoices, isCorrectAnswered, current])

  const handleChoiceClick = choice => {
    if (!current || showCorrectAnswer) return

    const normalizedChoice = String(choice)
    const normalizedAnswer = String(current.answer)

    const questionId = getQuestionId(current)
    if (storyId && questionId) {
      dispatch(
        answerStoryQuestionAction({
          storyId,
          questionId,
          answer: normalizedChoice,
          showRef: false,
        })
      )
    }
    setLastAttemptAnswer(normalizedChoice)

    if (normalizedChoice === normalizedAnswer) {
      setIsCorrectAnswered(true)
      setShowCorrectAnswer(true)
      return
    }

    setAttemptedWrongChoices(prev => {
      const next = new Set(prev)
      next.add(normalizedChoice)

      if (next.size >= wrongAttemptLimit) {
        setShowCorrectAnswer(true)
      }

      return next
    })
  }

  const goNext = () => {
    if (!showCorrectAnswer) return
    setAttemptedWrongChoices(new Set())
    setIsCorrectAnswered(false)
    setShowCorrectAnswer(false)
    setShowAnswerLocation(false)
    setHighlightedSentenceIds([])
    setLastAttemptAnswer('')
    setIdx(prev => Math.min(prev + 1, Math.max(total - 1, 0)))
  }

  const handleShowAnswerLocation = () => {
    if (!current) return
    if (showAnswerLocation) return

    const sentenceIds = getQuestionSentenceIds(story, current)
    const questionId = getQuestionId(current)
    const answerForReference =
      lastAttemptAnswer || (isCorrectAnswered ? String(current.answer || '') : '')

    if (storyId && questionId && answerForReference) {
      dispatch(
        answerStoryQuestionAction({
          storyId,
          questionId,
          answer: answerForReference,
          showRef: true,
        })
      )
    }

    setShowAnswerLocation(true)
    setHighlightedSentenceIds(sentenceIds)
  }

  useEffect(() => {
    if (showCorrectAnswer && !showAnswerLocationButtonEnabled) {
      handleShowAnswerLocation()
    }    
  }, [showCorrectAnswer, showAnswerLocationButtonEnabled])

  const handleWordTranslate = (token, paragraph) => {
    const {
      lemmas,
      translation_lemmas,
      bases,
      ID: wordId,
      surface,
      inflection_ref: inflectionRef,
      pref_lemma: prefLemma,
      sentence_id,
      snippet_id,
    } = token || {}
    if (!lemmas) return

    dispatch(setFocusedSpan(null))
    dispatch(setHighlightRange(wordId, wordId))

    dispatch(
      setWords({
        surface,
        lemmas,
        snippet_id,
        sentence_id,
        word_id: wordId,
        session_id: readingSessionId,
        storyid: storyId,
      })
    )
    dispatch(
      getTranslationAction({
        learningLanguage,
        wordLemmas: translation_lemmas || lemmas,
        bases,
        dictionaryLanguage,
        storyId,
        wordId,
        inflectionRef,
        prefLemma,
      })
    )
    dispatch(setHelperSidebarTab('translation'))
    dispatch(setHelperSidebarOpen(true))

        // If MT is available for this language pair, request a context translation
    if (mtLanguages.includes([learningLanguage, dictionaryLanguage].join('-'))) {
      const safeParagraph = Array.isArray(paragraph) ? paragraph : []
      const sentence = safeParagraph
        .filter(s => sentence_id - 1 <= s.sentence_id && s.sentence_id <= sentence_id + 1)
        .map(t => t.surface)
        .join('')
        .replaceAll('\n', ' ')
        .trim()

      if (sentence) {
        dispatch(
          getContextTranslation(
            sentence,
            learningLanguageLocaleCodes[learningLanguage],
            learningLanguageLocaleCodes[dictionaryLanguage]
          )
        )
      }
    }
  }

  if (pending) return <Spinner fullHeight size={60} text={intl.formatMessage({ id: 'loading' })} />
  if (!story) return null

  return (
    <main
      className={`reading-comp auto ${isSidebarOpen ? 'sidebar-pushed' : ''}`}
      style={{
        maxWidth: 1108,
        // 1.5em top aligns the card with the assistant panel (HelperSidebar top: 4.5em, 1.5em below
        // the 3em navbar).
        margin: '1.5em auto',
        width: '100%',
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      <Box
        sx={{
          backgroundColor: colors.card,
          color: colors.ink,
          fontFamily: font.family,
          border: `1px solid ${colors.border}`,
          borderRadius: '20px',
          padding: '1.25em',
        }}
        style={{
          ...getTextStyle(learningLanguage),
          flex: '3 1 440px',
          minWidth: 300,
        }}
      >
        <div style={{ fontFamily: font.family, fontWeight: 700, fontSize: 22, marginBottom: 12 }}>
          {story.title}
        </div>
        <HighlightedStoryText
          paragraphs={story.paragraph || []}
          highlightedSentenceIds={highlightedSentenceIds}
          onWordClick={handleWordTranslate}
        />
      </Box>
      <section
        style={{
          flex: '2 1 300px',
          minWidth: 300,
          width: '100%',
          alignSelf: 'flex-start',
        }}
      >
        <div style={{ position: 'sticky', top: 16 }}>
          <Box
            sx={{
              backgroundColor: colors.card,
              color: colors.ink,
              fontFamily: font.family,
              border: `1px solid ${colors.border}`,
              borderRadius: '20px',
              padding: '1.25em',
            }}
          >
            <div style={{ maxHeight: 'calc(100vh - 32px)', overflowY: 'auto' }}>
              {readingQuestionsPending && total === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                  <Spinner inline size={40} />
                </div>
              ) : total === 0 ? (
                <div data-cy="rp-no-questions" style={{ opacity: 0.85 }}>
                  <FormattedMessage id="no-questions" />
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <div data-cy="rp-question-text" style={{ fontSize: 18 }}>
                      {idx + 1}/{total} {current?.question}
                    </div>
                    {/* Settings (circle gear) to the right of the question. */}
                    <AnswerLocationSettings
                      checked={showAnswerLocationButtonEnabled}
                      onChange={setShowAnswerLocationButtonEnabled}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(current?.choices || []).map((c, i) => {
                      const isAnswer = c === current?.answer
                      const isWrongTried = attemptedWrongChoices.has(String(c))
                      const isCorrect = showCorrectAnswer && isAnswer

                      // Design-system answer states: white by default, green when correct, blue
                      // when a wrong choice was tried.
                      let border = `1px solid ${colors.border}`
                      let bg = '#ffffff'
                      let color = colors.ink

                      if (isCorrect) {
                        border = `1px solid ${colors.greenHover}`
                        bg = colors.green
                        color = colors.ink
                      }

                      if (isWrongTried) {
                        border = '1px solid #8FBBD0'
                        bg = colors.panel
                        color = colors.ink
                      }

                      return (
                        <AppButton
                          key={i}
                          data-cy={`rp-choice-btn-${i}`}
                          block
                          onClick={() => handleChoiceClick(c)}
                          style={{
                            textAlign: 'left',
                            justifyContent: 'flex-start',
                            borderRadius: 10,
                            padding: '12px 14px',
                            border,
                            backgroundColor: bg,
                            color,
                            boxShadow: 'none',
                            fontWeight: 500,
                            whiteSpace: 'normal',
                          }}
                        >
                          {c}
                        </AppButton>
                      )
                    })}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: 14,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {showAnswerLocationButtonEnabled && showCorrectAnswer && (
                        <AppButton
                          data-cy="rp-show-answer-location-btn"
                          variant="secondary"
                          onClick={handleShowAnswerLocation}
                        >
                          <FormattedMessage id="show-where-answer-is" />
                        </AppButton>
                      )}
                    </div>

                    <div style={{ display: 'flex' }}>
                      {idx === total - 1 && showCorrectAnswer ? (
                        <AppButton
                          style={{ minWidth: 100 }}
                          data-cy="rp-start-over-btn"
                          variant="primary"
                          onClick={() => {
                            setIdx(0)
                            setAttemptedWrongChoices(new Set())
                            setIsCorrectAnswered(false)
                            setShowCorrectAnswer(false)
                            setShowAnswerLocation(false)
                            setHighlightedSentenceIds([])
                            setLastAttemptAnswer('')
                          }}
                        >
                          <FormattedMessage id="start-over" />
                        </AppButton>
                      ) : (
                        <AppButton
                          style={{ minWidth: 100 }}
                          data-cy="rp-next-btn"
                          onClick={goNext}
                          disabled={!showCorrectAnswer || idx >= total - 1}
                        >
                          <FormattedMessage id="next" />
                        </AppButton>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Box>
        </div>
      </section>

      <HelperSidebar>
        <ReadingPracticeChatbot
          questionDone={showCorrectAnswer}
          sessionId={readingSessionId || storyId}
          questionId={getQuestionId(current)}
          attemptsAndFeedbacks={attemptsAndFeedbacks}
          translationSlot={<WordTranslationPanel />}
        />
      </HelperSidebar>
    </main>
  )
}

export default ReadingPracticeView
