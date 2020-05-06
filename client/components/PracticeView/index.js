import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import CurrentPractice from 'Components/PracticeView/CurrentPractice'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import DictionaryHelp from 'Components/DictionaryHelp'
import { Segment, Icon } from 'semantic-ui-react'
import { resetCurrentSnippet } from 'Utilities/redux/snippetsReducer'
import { clearPractice, setTouchedIds, setAnswers } from 'Utilities/redux/practiceReducer'
import { getTranslationAction } from 'Utilities/redux/translationReducer'
import {
  getTextStyle,
  capitalize,
  learningLanguageSelector,
  translatableLanguages,
  newCapitalize,
  dictionaryLanguageSelector,
} from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import PreviousSnippets from './PreviousSnippets'
import VirtualKeyboard from './VirtualKeyboard'
import Footer from '../Footer'
import { keyboardLayouts } from './KeyboardLayouts'

const PracticeView = ({ match }) => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const dispatch = useDispatch()
  const smallWindow = useWindowDimensions().width < 500

  const story = useSelector(({ stories }) => stories.focused)

  useEffect(() => {
    dispatch(getStoryAction(match.params.id))
  }, [learningLanguage])

  if (!story) return null

  const handleRestart = () => {
    dispatch(clearPractice())
    dispatch(resetCurrentSnippet(match.params.id))
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

  const textToSpeech = (surfaceWord, wordLemmas, wordId) => {
    // const selectedLocale = localeOptions.find(localeOption => localeOption.code === locale)
    try {
      window.responsiveVoice.speak(surfaceWord, `${learningLanguage === 'german' ? 'Deutsch' : capitalize(learningLanguage)} Female`)
    } catch (e) {
      console.log(`Failed to speak ${surfaceWord} in ${capitalize(learningLanguage)}`)
    }
    if (wordLemmas) {
      dispatch(
        getTranslationAction(
          newCapitalize(learningLanguage),
          wordLemmas,
          capitalize(dictionaryLanguage) || translatableLanguages[learningLanguage][0],
          match.params.id,
          wordId,
        ),
      )
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Segment style={{ paddingTop: '1em', width: '100%', maxWidth: '1024px' }}>
          <div className="component-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <h3 style={{ ...getTextStyle(learningLanguage), width: '100%', paddingRight: '1em' }}>{`${story.title}`}</h3>
              <Icon
                data-cy="restart-story"
                style={{ cursor: 'pointer' }}
                name="redo"
                onClick={handleRestart}
              />
            </div>
            {story.url ? <p><a href={story.url}><FormattedMessage id="Source" /></a></p> : null}

            <PreviousSnippets textToSpeech={textToSpeech} />
            <hr />
            <CurrentPractice storyId={match.params.id} textToSpeech={textToSpeech} handleInputChange={handleAnswerChange} />
            {keyboardLayouts[learningLanguage] && !smallWindow
              && <VirtualKeyboard />
            }
          </div>
        </Segment>
        <DictionaryHelp />
      </div>
      <Footer />
    </div>
  )
}


export default PracticeView
