import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import CurrentSnippet from 'Components/PracticeView/CurrentSnippet'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import DictionaryHelp from 'Components/DictionaryHelp'
import { Segment, Icon } from 'semantic-ui-react'
import { resetCurrentSnippet, clearFocusedSnippet } from 'Utilities/redux/snippetsReducer'
import { clearPractice, setTouchedIds, setAnswers } from 'Utilities/redux/practiceReducer'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import {
  getTextStyle,
  capitalize,
  learningLanguageSelector,
  newCapitalize,
  dictionaryLanguageSelector,
  speak,
  respVoiceLanguages,
} from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import PreviousSnippets from './PreviousSnippets'
import VirtualKeyboard from './VirtualKeyboard'
import ReferenceModal from './ReferenceModal'
import Footer from '../Footer'
import { keyboardLayouts } from './KeyboardLayouts'

const PracticeView = () => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const dispatch = useDispatch()
  const { id } = useParams()
  const { width } = useWindowDimensions()

  const story = useSelector(({ stories }) => stories.focused)
  const autoSpeak = useSelector(({ user }) => user.data.user.auto_speak)

  const voice = respVoiceLanguages[learningLanguage]

  useEffect(() => {
    dispatch(getStoryAction(id))
  }, [learningLanguage])

  useEffect(() => {
    return () => {
      dispatch(clearFocusedSnippet())
    }
  }, [])

  if (!story) return null

  const handleRestart = () => {
    dispatch(clearPractice())
    dispatch(resetCurrentSnippet(id))
  }

  const handleAnswerChange = (value, word) => {
    const { surface, id, ID, concept } = word

    dispatch(setTouchedIds(ID))

    const newAnswer = {
      [ID]: {
        correct: surface,
        users_answer: value,
        id,
        concept,
      },
    }
    dispatch(setAnswers(newAnswer))
  }

  const handleWordClick = (surfaceWord, wordLemmas, wordId, maskSymbol) => {
    if (autoSpeak === 'always' && voice) speak(surfaceWord, voice)
    if (wordLemmas) {
      dispatch(setWords(surfaceWord, wordLemmas, undefined, maskSymbol))
      dispatch(
        getTranslationAction(
          newCapitalize(learningLanguage),
          wordLemmas,
          capitalize(dictionaryLanguage),
          id,
          wordId
        )
      )
    }
  }

  const showVirtualKeyboard = width > 500 && keyboardLayouts[learningLanguage]
  const showFooter = width > 640

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Segment style={{ paddingTop: '1em', width: '100%', maxWidth: '1024px' }}>
          <div className="component-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <h3
                style={{
                  ...getTextStyle(learningLanguage, 'title'),
                  width: '100%',
                  paddingRight: '1em',
                }}
              >
                {`${story.title}`}
              </h3>
              <Icon
                data-cy="restart-story"
                style={{ cursor: 'pointer' }}
                name="redo"
                onClick={handleRestart}
              />
            </div>
            {story.url ? (
              <p>
                <a href={story.url}>
                  <FormattedMessage id="Source" />
                </a>
              </p>
            ) : null}
            <PreviousSnippets handleWordClick={handleWordClick} />
            <hr />
            <CurrentSnippet
              storyId={id}
              handleWordClick={handleWordClick}
              handleInputChange={handleAnswerChange}
            />
            {showVirtualKeyboard && <VirtualKeyboard />}
          </div>
        </Segment>
        <DictionaryHelp />
        <ReferenceModal />
      </div>
      {showFooter && <Footer />}
    </div>
  )
}

export default PracticeView
