import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { List, Button, Segment, Icon, Popup } from 'semantic-ui-react'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { updateDictionaryLanguage } from 'Utilities/redux/userReducer'
import {
  getTranslationAction,
  setWords,
  changeTranslationStageAction,
} from 'Utilities/redux/translationReducer'
import WordNestModal from 'Components/WordNestModal'
import {
  useDictionaryLanguage,
  useLearningLanguage,
  translatableLanguages,
  speak,
  voiceLanguages,
  getTextStyle,
  images,
  flashcardColors,
  hiddenFeatures,
} from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import { setAnnotationvisibilityMobile } from 'Utilities/redux/annotationsReducer'
import { Spinner } from 'react-bootstrap'
import FocusedView from 'Components/AnnotationBox/FocusedView'
import { recordFlashcardAnswer } from 'Utilities/redux/flashcardReducer'

const Speaker = ({ word }) => {
  const learningLanguage = useLearningLanguage()
  const voice = voiceLanguages[learningLanguage]
  const { resource_usage } = useSelector(state => state.user.data.user)
  const [count, setCount] = useState(0)
  const [lastWord, setLastWord] = useState('')

  const handleSpeakerClick = () => {
    speak(word, voice, 'dictionary', resource_usage, count)
    if (lastWord === ''){
      setCount(count + 1)
      setLastWord(word)
    }
    else if (word === lastWord) setCount(count + 1)
    else{
      setCount(0)
      setLastWord(word)
    }
  }

  if (!voice) return null

  return (
    <Icon
      name="volume up"
      style={{ marginRight: '1rem' }}
      className="clickable"
      onClick={handleSpeakerClick}
    />
  )
}

const DictionaryButton = ({ setShow }) => {
  const dispatch = useDispatch()

  const handleDictionaryButtonClick = () => {
    setShow(true)
    dispatch(setAnnotationvisibilityMobile(false))
  }

  return (
    <div className="dictionary-button">
      <Button className="navigationbuttonopen" icon basic onClick={handleDictionaryButtonClick}>
        <Icon size="large" name="book" data-cy="dictionary-icon" />
      </Button>
    </div>
  )
}

const Clue = ({ clue }) => (
  <div style={{ fontWeight: 'bold', color: '#2185D0' }}>
    <FormattedMessage id="Your clue" />
    {`: ${clue.number} ${clue.direction}`}
  </div>
)

const Lemma = ({
  lemma,
  sourceWord,
  handleSourceWordClick,
  handleKnowningClick,
  handleNotKnowningClick,
  userUrl,
  inflectionRef,
  preferred,
}) => {
  const learningLanguage = useLearningLanguage()
  const { maskSymbol } = useSelector(({ translation }) => translation)

  return (
    <div className="flex space-between" style={getTextStyle(learningLanguage)}>
      <div className="flex">
        <Speaker word={lemma} />
        {maskSymbol || (
          <a href={userUrl} target="_blank" rel="noopener noreferrer">
            {lemma}
          </a>
        )}
        {inflectionRef && (
          <a href={inflectionRef.url} target="_blank" rel="noopener noreferrer" className="flex">
            <Icon name="external" style={{ marginLeft: '1rem' }} />
          </a>
        )}
      </div>
      {preferred && (
        <div className="flex-col" style={{ alignItems: 'center' }}>
          <Popup
            position="top center"
            content={<FormattedHTMLMessage id="i-know-tooltip" />}
            trigger={
              <Icon
                name="check"
                onClick={handleKnowningClick}
                style={{ cursor: 'pointer', marginLeft: '2em' }}
              />
            }
          />
          <Popup
            position="top center"
            content={<FormattedHTMLMessage id="i-dont-know-tooltip" />}
            trigger={
              <Icon
                name="question"
                onClick={handleNotKnowningClick}
                style={{ cursor: 'pointer', marginLeft: '2em', marginTop: '.75em' }}
              />
            }
          />
        </div>
      )}
    </div>
  )
}

const DictionaryHelp = ({ minimized, inWordNestModal }) => {
  const [showHelp, setShow] = useState(false)
  const { width: windowWidth } = useWindowDimensions()
  const [wordNestModalOpen, setWordNestModalOpen] = useState(false)
  const [wordNestChosenWord, setWordNestChosenWord] = useState('')
  const translationLanguageCode = useSelector(({ user }) => user.data.user.last_trans_language)
  const learningLanguage = useLearningLanguage()
  const dictionaryLanguage = useDictionaryLanguage()
  const {
    pending,
    data: translation,
    surfaceWord,
    lemmas,
    clue,
    maskSymbol,
  } = useSelector(({ translation }) => translation)

  const { focusedSpan, mobileDisplayAnnotations } = useSelector(({ annotations }) => annotations)

  const { data: words } = useSelector(({ wordNest }) => wordNest)

  const { background } = flashcardColors

  const dispatch = useDispatch()
  const intl = useIntl()

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
    if (translation) setWordNestChosenWord(translation[0]?.lemma)
  }, [translation])

  const dictionaryOptions = translatableLanguages[learningLanguage]
    ? translatableLanguages[learningLanguage].map(element => ({
        key: element,
        value: element,
        text: intl.formatMessage({ id: element }),
      }))
    : []

  const translations =
    translation &&
    translation !== 'no-clue-translation' &&
    translation
      ?.sort((a, b) => b.preferred - a.preferred)
      .map(translated => (
        <div
          key={translated.URL}
          data-cy="translations"
          style={{
            color: '#555555',
            marginBottom: '1em',
            padding: '1em',
            borderRadius: '15px',
            backgroundColor: `${
              (translated.preferred && background[translated.stage || 0]) || '#FFFFFF'
            }4D`,
          }}
        >
          {clue ? (
            <Clue clue={clue} />
          ) : (
            <Lemma
              lemma={translated.lemma}
              sourceWord={translated.source_word}
              handleSourceWordClick={handleSourceWordClick}
              handleKnowningClick={handleKnowningClick(translated.lemma)}
              handleNotKnowningClick={handleNotKnowningClick(translated.lemma)}
              inflectionRef={translated.ref}
              userUrl={translated.user_URL}
              preferred={translated.preferred}
            />
          )}
          <List bulleted style={{ color: 'slateGrey', fontStyle: 'italic', marginTop: '.5rem' }}>
            {translated.glosses.map(word => (
              <List.Item key={word}>{word}</List.Item>
            ))}
          </List>
        </div>
      ))

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

  const smallWindow = minimized || windowWidth < 1024

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

  const handleNestButtonClick = () => {
    setWordNestModalOpen(true)
  }

  const translationResults = () => {
    if (pending)
      return (
        <div>
          <span>
            <FormattedMessage id="dictionaryhelp-loading-please-wait" />
            ...{' '}
          </span>
          <Spinner animation="border" />
        </div>
      )
    if (translation === 'no-clue-translation') {
      return (
        <>
          <div style={{ marginBottom: '1em', width: '100%', ...getTextStyle(learningLanguage) }}>
            <Speaker word={parsedLemmas()[0]} />
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
            smallWindow ? !inWordNestModal && ' dictionary-translations-overlay' : ''
          }`}
        >
          <div style={{ display: 'flex' }}>
            <div>{translations}</div>
            <div style={{ alignSelf: 'flex-start', marginLeft: '1em' }}>
              {!inWordNestModal &&
                words?.length > 0 &&
                (learningLanguage === 'Russian' || learningLanguage === 'Finnish') &&
                !clue && (
                  <Button basic size="mini" onClick={handleNestButtonClick} data-cy="nest-button">
                    <img src={images.nestIcon} alt="nest icon" width="22" />
                  </Button>
                )}
            </div>
          </div>
        </div>
      )
    if (!translation) {
      return (
        <List.Item style={{ color: '#555555' }}>
          {!clue && !inWordNestModal && (
            <div style={{ width: '100%', ...getTextStyle(learningLanguage) }}>
              <Speaker word={parsedLemmas()[0]} />
              {maskSymbol || parsedLemmas()[0]}
            </div>
          )}
          <List bulleted style={{ color: 'slateGrey', fontStyle: 'italic' }}>
            <span>
              <FormattedMessage id="dictionaryhelp-no-translation-available" />
            </span>
          </List>
        </List.Item>
      )
    }
    return (
      <div className="notes-info-text" style={{ marginBottom: '1em',  }}>
        <FormattedMessage id="click-on-words-near-the-exercises-to-explore-their-meaning" />
      </div>
    )
  }

  return (
    <div
      className={`dictionary-help${
        smallWindow && !inWordNestModal ? ' dictionary-help-overlay' : ''
      }`}
    >
      <Segment>
        {!mobileDisplayAnnotations && (
          <div className="align-right" style={{ color: 'slateGrey' }}>
            <FormattedMessage id="translation-target-language" />
            <select
              disabled={dictionaryOptions.length <= 1}
              defaultValue={translationLanguageCode}
              data-cy="dictionary-dropdown"
              style={{
                marginLeft: '0.5em',
                border: 'none',
                color: 'slateGrey',
                backgroundColor: 'white',
                marginBottom: '1em',
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

        <div className="space-between">
          {!mobileDisplayAnnotations ? (
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
                      <Speaker word={surfaceWord} />
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
                    />
                  )}
              </div>
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <div className="header-3" style={{ fontWeight: '500' }}>
                <FormattedMessage id="notes" />
              </div>
              <FocusedView focusedSpan={focusedSpan} />
            </div>
          )}

          {smallWindow && !inWordNestModal ? (
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
          ) : null}
        </div>
      </Segment>
    </div>
  )
}

export default DictionaryHelp
