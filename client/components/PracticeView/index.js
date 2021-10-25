import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import { Segment } from 'semantic-ui-react'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { clearFocusedSnippet } from 'Utilities/redux/snippetsReducer'
import { setTouchedIds, setAnswers } from 'Utilities/redux/practiceReducer'
import { resetAnnotations } from 'Utilities/redux/annotationsReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import { getTextStyle, learningLanguageSelector, getMode } from 'Utilities/common'
import CurrentSnippet from 'Components/PracticeView/CurrentSnippet'
import DictionaryHelp from 'Components/DictionaryHelp'
import ReportButton from 'Components/ReportButton'
import AnnotationBox from 'Components/AnnotationBox'
import PreviousSnippets from './PreviousSnippets'
import VirtualKeyboard from './VirtualKeyboard'
import FeedbackInfoModal from './FeedbackInfoModal'
import { keyboardLayouts } from './KeyboardLayouts'
import ProgressBar from './CurrentSnippet/ProgressBar'
import Footer from '../Footer'
import ScrollArrow from '../ScrollArrow'

const PracticeView = () => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()
  const { id } = useParams()
  const { width } = useWindowDimensions()
  const snippets = useSelector(({ snippets }) => snippets)
  const smallScreen = width < 700
  const mode = getMode()

  const currentSnippetId = () => {
    if (!snippets.focused) return -1
    const { snippetid } = snippets.focused
    return snippetid[snippetid.length - 1]
  }

  const currentSnippetNum = currentSnippetId() + 1
  const snippetsTotalNum = snippets?.focused?.total_num
  const { focused: story, pending } = useSelector(({ stories }) => stories)
  const showAnnotationBox = width >= 1024

  useEffect(() => {
    dispatch(getStoryAction(id, mode))
  }, [learningLanguage])

  useEffect(() => {
    dispatch(resetAnnotations())

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
            <div className="progress-bar-cont" style={{ top: smallScreen ? '.25em' : '3.25em' }}>
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
          {width >= 500 ? (
            <div className="flex-col align-end" style={{ marginTop: '0.5em' }}>
              <ReportButton />
            </div>
          ) : (
            <div style={{ marginBottom: '0.5em' }}>
              <ReportButton />
            </div>
          )}
        </div>
        <div className="dictionary-and-annotations-cont">
          <DictionaryHelp />
          {showAnnotationBox && <AnnotationBox />}
        </div>
        <FeedbackInfoModal />
      </div>
      {showFooter && <Footer />}
    </div>
  )
}

export default PracticeView
