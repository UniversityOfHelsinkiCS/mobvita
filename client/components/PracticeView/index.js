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
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import PreviousSnippets from './PreviousSnippets'
import VirtualKeyboard from './VirtualKeyboard'
import ReferenceModal from './ReferenceModal'
import Footer from '../Footer'
import { keyboardLayouts } from './KeyboardLayouts'
import ScrollArrow from '../ScrollArrow'
import ProgressBar from './CurrentSnippet/ProgressBar'

const PracticeView = () => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()
  const { id } = useParams()
  const { width } = useWindowDimensions()
  const snippets = useSelector(({ snippets }) => snippets)
  const smallScreen = width < 700

  const currentSnippetId = () => {
    if (!snippets.focused) return -1
    const { snippetid } = snippets.focused
    return snippetid[snippetid.length - 1]
  }

  const currentSnippetNum = currentSnippetId() + 1
  const snippetsTotalNum = snippets?.focused?.total_num
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
    <div className="cont-tall pt-sm flex-col space-between">
      <div className="justify-center">
        <div className="cont">
          <Segment>
            <div
              className="progress-bar-cont"
              style={{
                top: smallScreen ? '1.25em' : '3.25em',
              }}
            >
              <ProgressBar
                snippetProgress={currentSnippetNum}
                snippetsTotal={snippetsTotalNum}
                progress={(currentSnippetNum / snippetsTotalNum).toFixed(2)}
              />
            </div>
            <h3
              style={{
                ...getTextStyle(learningLanguage, 'title'),
                width: '100%',
                paddingRight: '1em',
                marginBottom: 0,
              }}
            >
              {!pending && `${story.title}`}
            </h3>
            {story.url && !pending ? (
              <a target="blank" href={story.url}>
                <FormattedMessage id="Source" />
              </a>
            ) : null}
            <PreviousSnippets />
            <hr />
            <CurrentSnippet storyId={id} handleInputChange={handleAnswerChange} />
            <ScrollArrow />
          </Segment>
          {showVirtualKeyboard && (
            <div>
              <VirtualKeyboard />
            </div>
          )}
          <ReportButton extraClass="mb-sm" />
        </div>
        <DictionaryHelp />
        <ReferenceModal />
      </div>
      {showFooter && <Footer />}
    </div>
  )
}

export default PracticeView
