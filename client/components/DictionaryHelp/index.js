import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { colors, font } from 'Assets/mui_theme/designTokens'
import { FormattedMessage, useIntl } from 'react-intl';
import { updateDictionaryLanguage } from 'Utilities/redux/userReducer'
import {
  getTranslationAction,
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


const DictionaryHelp = ({ minimized, inWordNestModal, inCrossword }) => {
  const [showHelp, setShow] = useState(false)
  const { width: windowWidth } = useWindowDimensions()
  const translationLanguageCode = useSelector(({ user }) => user.data.user.last_trans_language)
  const learningLanguage = useLearningLanguage()
  const dictionaryLanguage = useDictionaryLanguage()

  const [storyWord, setStoryWord] = useState('')
  const [wordNestModalOpen, setWordNestModalOpen] = useState(false)
  const [wordNestChosenWord, setWordNestChosenWord] = useState('')

  const {
    pending,
    data: translation,
    surfaceWord,
    lemmas,
    clue,
    maskSymbol,
    showDictionaryBox,
  } = useSelector(({ translation }) => translation)

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

  const dictionaryOptions = translatableLanguages[learningLanguage]
    ? translatableLanguages[learningLanguage].map(element => ({
        key: element,
        value: element,
        text: intl.formatMessage({ id: element }),
      }))
    : []

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
          <div className="space-between" key={translated.URL || translated.lemma}>
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

  const handleDropdownChange = value => {
    if (translation) {
      const lemmas = translation?.map(t => t?.lemma).join('+')
      if (lemmas !== '')
        dispatch(
          getTranslationAction({ learningLanguage, dictionaryLanguage: value, wordLemmas: lemmas })
        )
    }
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
      }`}
    >
      <Box
        sx={{
          backgroundColor: colors.card,
          borderRadius: '20px',
          padding: '1em',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          color: colors.ink,
        }}
      >
        {!mobileDisplayAnnotations && (
          <div className="flex space-between">
            <div style={{ marginBottom: '.5em' }}>
              <div
                className="header-3"
                style={{ fontWeight: '500', color: colors.ink, display: 'flex', alignItems: 'center' }}
              >
                <CustomTooltip
                  keyId="click-on-words-near-the-exercises-to-explore-their-meaning"
                  permanent
                >
                  <InfoOutlinedIcon
                    data-cy="dictionary-info"
                    sx={{ fontSize: 18, color: colors.muted, cursor: 'pointer', mr: '0.5em' }}
                  />
                </CustomTooltip>
                <FormattedMessage id="dictionary-header" />
              </div>
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

        {!mobileDisplayAnnotations && showDictionaryBox && translationResults() && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.5em',
              marginBottom: '1em',
            }}
          >
            <span style={{ color: colors.muted }}>
              <FormattedMessage id="translation-target-language" />
            </span>
            {/* Kept as a native <select> (not AppSelect) so Cypress `.select()` in
                dictionary_spec.js keeps working; styled to the design system. */}
            <select
              disabled={dictionaryOptions.length <= 1}
              defaultValue={translationLanguageCode}
              data-cy="dictionary-dropdown"
              style={{
                fontSize: font.input,
                color: colors.ink,
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
                borderRadius: '999px',
                padding: '4px 12px',
                cursor: dictionaryOptions.length <= 1 ? 'default' : 'pointer',
              }}
              onChange={e => handleDropdownChange(e.target.value)}
            >
              {dictionaryOptions.map(option => (
                <option key={option.key} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
          </div>
        )}

        <div >
          {!mobileDisplayAnnotations ? (
           <>
           {showDictionaryBox && (
            <div>
              <div className="space-between pt-sm">
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

          {/* smallWindow && !inWordNestModal ? (
            <div className="flex align-self-end">
              {focusedSpan && (
                <Button
                  icon
                  basic
                  onClick={() => dispatch(setAnnotationvisibilityMobile(!mobileDisplayAnnotations))}
                  style={{ margin: '0em 1em' }}
                >
                  <Icon
                    name={mobileDisplayAnnotations ? 'translate' : 'sticky note outline'}
                    size="large"
                    color="blue"
                  />
                </Button>
              )}
              <Button icon basic onClick={() => setShow(false)}>
                <Icon name="angle down" size="large" color="blue" />
              </Button>
            </div>
          ) : null */}
        </div>
      </Box>
    </div>
  )
}

export default DictionaryHelp
