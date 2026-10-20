import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { colors, font } from 'Assets/mui_theme/designTokens'
import { FormattedMessage, useIntl } from 'react-intl';
import { updateDictionaryLanguage } from 'Utilities/redux/userReducer'
import {
  getTranslationAction,
  getNestTranslationAction,
  setWords,
  changeTranslationStageAction,
} from 'Utilities/redux/translationReducer'
import {
  useDictionaryLanguage,
  useLearningLanguage,
  translatableLanguages,
  getTextStyle,
  flashcardColors,
} from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import FocusedView from 'Components/AnnotationBox/FocusedView'
import { recordFlashcardAnswer } from 'Utilities/redux/flashcardReducer'
import { Speaker, DictionaryButton } from './dictComponents'
import AppLemma from 'Components/ui/AppLemma'
import ContextTranslation from './ContextTranslation'
import WordNestModal from 'Components/WordNestModal'
import CustomTooltip from 'Components/CustomTooltip'
import SettingButton from 'Components/SettingsButton'
import './DictionaryHelp.scss'

// Dictionary card: gear language picker, lemma translations and (outside the nest) its nest modal.
const DictionaryHelp = ({ minimized, inWordNestModal, inCrossword }) => {
  const [showHelp, setShow] = useState(false)
  const { width: windowWidth } = useWindowDimensions()
  const translationLanguageCode = useSelector(({ user }) => user.data.user.last_trans_language)
  const learningLanguage = useLearningLanguage()
  const dictionaryLanguage = useDictionaryLanguage()

  const [storyWord, setStoryWord] = useState('')
  const [wordNestModalOpen, setWordNestModalOpen] = useState(false)
  const [wordNestChosenWord, setWordNestChosenWord] = useState('')

  const translationState = useSelector(({ translation }) => translation)
  const { surfaceWord, lemmas, clue, maskSymbol, showDictionaryBox } = translationState
  // Inside the nest, lemma cards come from the nest's own slot, never the story word's.
  const { pending, data: translation } =
    (inWordNestModal && translationState.nest) || translationState

  const { focusedSpan, mobileDisplayAnnotations } = useSelector(({ annotations }) => annotations)

  const { data: words } = useSelector(({ wordNest }) => wordNest)

  const { background } = flashcardColors

  const dispatch = useDispatch()
  const intl = useIntl()

  const smallWindow = minimized || windowWidth < 1024

  const handleDictionaryBoxClick = () => {
    if (showDictionaryBox) {
      if (smallWindow && !inWordNestModal) {
        setShow(false)
      } else {
        dispatch({ type: 'CLOSE_DICTIONARY_BOX' })
      }
    } else {
      dispatch({ type: 'SHOW_DICTIONARY_BOX' })
    }
  }

  useEffect(() => {
    if (wordNestModalOpen) return
    if (!lemmas) return
  
    setStoryWord(lemmas)
  }, [lemmas, wordNestModalOpen])

  useEffect(() => {
    if (
      translatableLanguages[learningLanguage].length &&
      !translatableLanguages[learningLanguage].includes(translationLanguageCode)
    ) {
      dispatch(updateDictionaryLanguage(translatableLanguages[learningLanguage][0]))
    }
  }, [learningLanguage])

  useEffect(() => {
    if (pending) setShow(true)
  }, [pending])

  const handleSourceWordClick = lemma => {
    dispatch(setWords({ lemmas: lemma }))
    dispatch(
      getTranslationAction({
        learningLanguage,
        wordLemmas: lemma,
        dictionaryLanguage,
      })
    )
  }

  const handleKnowningClick = lemma => () => {
    const answerDetails = {
      correct: true,
      answer: null,
      exercise: 'knowing',
      hints_shown: 0,
      mode: 'trans',
      lemma,
    }
    dispatch(recordFlashcardAnswer(learningLanguage, dictionaryLanguage, answerDetails))
    dispatch(changeTranslationStageAction(lemma, learningLanguage, dictionaryLanguage, 4))
  }

  const handleNotKnowningClick = lemma => () => {
    const answerDetails = {
      correct: false,
      answer: null,
      exercise: 'knowing',
      hints_shown: 0,
      mode: 'trans',
      lemma,
    }
    dispatch(recordFlashcardAnswer(learningLanguage, dictionaryLanguage, answerDetails))
    dispatch(changeTranslationStageAction(lemma, learningLanguage, dictionaryLanguage, 0))
  }

  useEffect(() => {
    if (!inCrossword && translation && !wordNestModalOpen)
      setWordNestChosenWord(
        translation
          ?.filter(t => t.lemma)
          .map(t => t.lemma)
          .join('+')
      )
  }, [translation, wordNestModalOpen])

  const translationEntries = useMemo(() => {
    return Array.isArray(translation) && translation !== 'no-clue-translation' ? translation : []
  }, [translation])

  const sortedTranslation = useMemo(() => {
    return translationEntries
      .slice()
      .sort((wordA, wordB) => (wordB?.preferred || 0) - (wordA?.preferred || 0))
  }, [translationEntries])

  const translations =
    translation !== 'no-clue-translation' &&
    sortedTranslation.map(translated => {
        return (
          <div key={translated.URL || translated.lemma}>
            {clue ? (
              <div
                data-cy="translations"
                style={{
                  color: colors.ink,
                  marginBottom: '1em',
                  padding: '1em',
                  borderRadius: '15px',
                  backgroundColor: `${
                    (translated.preferred && background[translated.stage || 0]) || '#FFFFFF'
                  }4D`,
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#2185D0' }}>
                  <FormattedMessage id="Your clue" />
                  {`: ${clue.number} ${clue.direction}`}
                </div>
              </div>
            ) : (
              // AppLemma is its own card — wrapper just carries the data-cy + spacing (no nested card).
              <div data-cy="translations" style={{ width: '100%', marginBottom: '1em' }}>
                <AppLemma
                  lemma={translated.lemma}
                  lemmaHref={translated.user_URL}
                  translations={pending ? [] : translated.glosses}
                  speaker={<Speaker word={translated.lemma} />}
                  onKnow={translated.preferred ? handleKnowningClick(translated.lemma) : undefined}
                  onDontKnow={
                    translated.preferred ? handleNotKnowningClick(translated.lemma) : undefined
                  }
                  dictionaryHref={translated.ref?.url || translated.user_URL}
                  onWordNest={
                    words &&
                    words[translated.lemma]?.length > 0 &&
                    !inWordNestModal &&
                    (learningLanguage === 'Russian' || learningLanguage === 'Finnish')
                      ? () => {
                          setWordNestChosenWord(translated.lemma)
                          setWordNestModalOpen(true)
                        }
                      : undefined
                  }
                  background={
                    translated.stage !== undefined
                      ? `${background[translated.stage]}4D`
                      : undefined
                  }
                />
              </div>
            )}
          </div>
        )
      })

  // Switches the dictionary language and re-translates the shown lemmas (in the nest, both panes).
  const handleDropdownChange = value => {
    const joinLemmas = data => (Array.isArray(data) ? data.map(t => t?.lemma).join('+') : '')
    const query = { learningLanguage, dictionaryLanguage: value }
    const storyLemmas = joinLemmas(translationState.data)
    const nestLemmas = inWordNestModal ? joinLemmas(translation) : ''
    if (storyLemmas) dispatch(getTranslationAction({ ...query, wordLemmas: storyLemmas }))
    if (nestLemmas) dispatch(getNestTranslationAction({ ...query, wordLemmas: nestLemmas }))
    dispatch(updateDictionaryLanguage(value))
  }

  if (!showHelp && smallWindow && !inWordNestModal) {
    return (
      <DictionaryButton setShow={setShow} translation={translation} translations={translations} />
    )
  }

  const parsedLemmas = () => lemmas.split('+').join(',').split('|').join(',').split(',')

  const showSurfaceWord = () => {
    if (!surfaceWord || clue || surfaceWord?.includes(' + ')) return false
    if (translation && translation !== 'no-clue-translation') {
      return !translation.some(
        translated => translated.lemma.toLowerCase() === surfaceWord.toLowerCase()
      )
    }
    return surfaceWord.toLowerCase() !== parsedLemmas()[0].toLowerCase()
  }

  // Which way the collapse chevron points. On narrow windows the box sits at the bottom, so the
  // arrow inverts relative to the desktop layout.
  const cornerArrowUp = windowWidth < 1024 ? !showDictionaryBox : showDictionaryBox

  const translationResults = () => {
    if (translation === 'no-clue-translation') {
      return (
        <>
          <div style={{ marginBottom: '1em', width: '100%',
                        ...getTextStyle(learningLanguage) }}>
              <CustomTooltip title={intl.formatMessage({ id: 'explain-speaker-lemma' })}>
                <span style={{ display: 'inline-flex' }}>
                  <Speaker word={parsedLemmas()[0]} />
                </span>
              </CustomTooltip>
            {maskSymbol || parsedLemmas()[0]}
          </div>
          <div className="additional-info">
            <FormattedMessage id="apologies-no-translation" />
          </div>
        </>
      )
    }
    if (translations && translations.length > 0)
      return (
        <div
          className={`dictionary-translations${
            smallWindow && !inWordNestModal ? ' dictionary-translations-overlay' : ''
          }`}
        >
          <div>
            {translations}
          </div>
        </div>
      )
    if (!translation) {
      return (
        <div style={{ color: colors.ink, fontFamily: font.content }}>
          {!clue && !inWordNestModal && (
            <div style={{ width: '100%', ...getTextStyle(learningLanguage) }}>
                <CustomTooltip title={intl.formatMessage({ id: 'explain-speaker-lemma' })}>
                  <span style={{ display: 'inline-flex' }}>
                    <Speaker word={parsedLemmas()[0]} />
                  </span>
                </CustomTooltip>
              {maskSymbol || parsedLemmas()[0]}
            </div>
          )}
          <ul style={{ color: colors.muted, fontStyle: 'italic', margin: '0.3em 0 0', paddingLeft: '1.1em' }}>
            <li>
              <FormattedMessage id="dictionaryhelp-no-translation-available" />
            </li>
          </ul>
        </div>
      )
    }
    return null
  }

  return (
    <div
      className={`dictionary-help${
        smallWindow && !inWordNestModal ? ' dictionary-help-overlay' : ''
      }${inWordNestModal ? ' dictionary-help-in-nest' : ''}`}
    >
      <div className="dictionary-help-card">
        {!mobileDisplayAnnotations && (
          <div className="dictionary-help-header">
            <div className="dictionary-help-title header-3">
              <SettingButton
                className="dictionary-help-settings"
                dataCy="dictionary-language"
                onSelect={handleDropdownChange}
              />
              <FormattedMessage id="dictionary-header" />
              <CustomTooltip
                keyId="click-on-words-near-the-exercises-to-explore-their-meaning"
                permanent
              >
                <InfoOutlinedIcon
                  data-cy="dictionary-info"
                  sx={{ fontSize: 18, color: colors.muted, cursor: 'pointer' }}
                />
              </CustomTooltip>
            </div>
            {!inWordNestModal && translationResults() && (
              <div
                onClick={() => {
                  handleDictionaryBoxClick()
                }}
                onKeyDown={() => {
                  handleDictionaryBoxClick()
                }}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer', color: colors.ink }}
              >
                {cornerArrowUp ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </div>
            )}
          </div>
        )}

        {/* Lemmas and context translation; the word nest makes this the scrolling part. */}
        <div className="dictionary-help-content">
          {!mobileDisplayAnnotations ? (
           <>
           {showDictionaryBox && (
            <div>
              <div className="dictionary-help-body">
                <div>
                  {showSurfaceWord() && !inWordNestModal && (
                    <div
                      style={{
                        paddingBottom: '0.5em',
                        display: 'flex',
                        ...getTextStyle(learningLanguage),
                      }}
                    >
                        <CustomTooltip title={intl.formatMessage({ id: 'explain-speaker-surface' })}>
                          <span style={{ display: 'inline-flex' }}>
                            <Speaker word={surfaceWord} />
                          </span>
                        </CustomTooltip>
                      <span style={{ color: '#2185D0' }}>{maskSymbol || surfaceWord}</span>
                    </div>
                  )}
                  {translationResults()}
                </div>
                {!inWordNestModal &&
                  (learningLanguage === 'Russian' || learningLanguage === 'Finnish') && (
                    <WordNestModal
                      wordToCheck={wordNestChosenWord}
                      setWordToCheck={setWordNestChosenWord}
                      open={wordNestModalOpen}
                      setOpen={setWordNestModalOpen}
                      storyWord={storyWord}
                    />
                  )}
              </div>

              {!inWordNestModal && !inCrossword && !pending &&
                <ContextTranslation surfaceWord={surfaceWord} wordTranslated={translation} />}
            </div>
          )}
           </>
          ) : (
            <div style={{ width: '100%' }}>
              <div className="header-3" style={{ fontWeight: '500' }}>
                <FormattedMessage id="notes-header" />
              </div>
              <FocusedView focusedSpan={focusedSpan} />
            </div>
          ) /* ??? WHAT IS THIS? why NOTES ??? */}

        </div>
      </div>
    </div>
  )
}

export default DictionaryHelp
