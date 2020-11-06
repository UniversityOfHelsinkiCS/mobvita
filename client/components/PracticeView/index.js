import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import CurrentSnippet from 'Components/PracticeView/CurrentSnippet'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import DictionaryHelp from 'Components/DictionaryHelp'
import ReportButton from 'Components/ReportButton'
import { Segment } from 'semantic-ui-react'
import { clearFocusedSnippet } from 'Utilities/redux/snippetsReducer'
import { setTouchedIds, setAnswers } from 'Utilities/redux/practiceReducer'
import { getTextStyle, learningLanguageSelector, hiddenFeatures } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import PreviousSnippets from './PreviousSnippets'
import VirtualKeyboard from './VirtualKeyboard'
import ReferenceModal from './ReferenceModal'
import Footer from '../Footer'
import { keyboardLayouts } from './KeyboardLayouts'

const PracticeView = () => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()
  const { id } = useParams()
  const { width } = useWindowDimensions()

  const { focused: story, pending } = useSelector(({ stories }) => stories)

  useEffect(() => {
    dispatch(getStoryAction(id))
  }, [learningLanguage])

  useEffect(() => {
    return () => {
      dispatch(clearFocusedSnippet())
    }
  }, [])

  if (!story) return null

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

  const showVirtualKeyboard = width > 500 && keyboardLayouts[learningLanguage]
  const showFooter = width > 640

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1024px' }}>
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
                  {!pending && `${story.title}`}
                </h3>
              </div>
              {story.url && !pending ? (
                <p>
                  <a href={story.url}>
                    <FormattedMessage id="Source" />
                  </a>
                </p>
              ) : null}
              <PreviousSnippets />
              <hr />
              <CurrentSnippet storyId={id} handleInputChange={handleAnswerChange} />
              {showVirtualKeyboard && <VirtualKeyboard />}
            </div>
          </Segment>
          <ReportButton />
        </div>
        <DictionaryHelp />
        <ReferenceModal />
      </div>
      {showFooter && <Footer />}
    </div>
  )
}

export default PracticeView
