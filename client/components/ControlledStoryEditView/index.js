import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { Divider, Segment, Header, Checkbox, Icon, Popup } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import { getStoryAction, getAllStories } from 'Utilities/redux/storiesReducer'
import { getStoryTokensAction } from 'Utilities/redux/controlledStoryReducer'
import { clearFocusedSnippet } from 'Utilities/redux/snippetsReducer'
import {
  freezeControlledStory,
  initControlledExerciseSnippets,
} from 'Utilities/redux/controlledPracticeReducer'
import { finishSnippet } from 'Utilities/redux/practiceReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import { resetAnnotations, setAnnotations } from 'Utilities/redux/annotationsReducer'
import { learningLanguageSelector, getTextStyle, getMode } from 'Utilities/common'
import DictionaryHelp from 'Components/DictionaryHelp'
import ReportButton from 'Components/ReportButton'
import AnnotationBox from 'Components/AnnotationBox'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import PreviousSnippets from './PreviousSnippets'
import ProgressBar from './CurrentSnippet/ProgressBar'
import Footer from '../Footer'
import ScrollArrow from '../ScrollArrow'

const ControlledStoryEditView = () => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()
  const { id } = useParams()
  const { width } = useWindowDimensions()
  const controlledPractice = useSelector(({ controlledPractice }) => controlledPractice)
  const smallScreen = width < 700
  const mode = getMode()

  const controlledPracticeTotalNum = controlledPractice?.focused?.total_num

  const currentSnippetId = () => {
    if (!controlledPractice.focused) return -1
    const { snippetid } = controlledPractice.focused
    return snippetid[snippetid.length - 1] ?? controlledPracticeTotalNum - 1
  }

  const currentControlledPracticeNum = currentSnippetId() + 1

  const { story, pending } = useSelector(({ stories, locale }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
    locale,
  }))
  const acceptedTokens = useSelector(({ acceptedTokens }) => acceptedTokens)

  const user = useSelector(state => state.user.data)

  const { progress, storyId } = useSelector(({ uploadProgress }) => uploadProgress)

  const learningLanguage = useSelector(learningLanguageSelector)
  const { id } = match.params

  const initAcceptedTokens = () => {
    const initialAcceptedTokensList = {}
    for (let i = 0; i < story?.paragraph.length; i++) {
      if (!initialAcceptedTokensList[i]) {
        initialAcceptedTokensList[i] = []
      }
    }
    return initialAcceptedTokensList
  }

  useEffect(() => {
    if (user?.user.is_teacher) {
      setHideFeedback(false)
    }
    dispatch(getStoryAction(id, 'preview'))
    dispatch(getStoryTokensAction(id, mode))
    dispatch(clearTranslationAction())
    dispatch(resetAnnotations())
  }, [])

  useEffect(() => {
    dispatch(resetAnnotations())

    return () => {
      dispatch(clearFocusedSnippet())
    }
  }, [progress])

  if (!story || pending || !user || acceptedTokens.pending) return <Spinner fullHeight />

  const showFooter = width > 640
  const url = history.location.pathname
  const processingCurrentStory = id === storyId

  if (!story) return null

  const handleAnswerChange = (value, word) => {
    const { surface, id, ID, concept } = word

  const refreshPage = () => {
    dispatch(getStoryAction(id, 'preview'))
    dispatch(getStoryTokensAction(id, mode))
    setShowRefreshButton(false)
  }

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

  const showFooter = width > 640

  const emptySnippets = () => {
    const snippets = Object.entries(controlledPractice.snippets)

    for (const [snippet, array] of snippets) {
      if (array.length < 1) {
        return true
      }
    }
    return false
  }

  console.log('contr ', controlledPractice)
  console.log('story ', story.paragraph)
  // console.log('tokens ', acceptedTokens)

  return (
    <div className="cont-tall pt-sm flex-col space-between">
      <div className="justify-center">
        <div className="cont">
          <Segment>
            <div className="progress-bar-cont" style={{ top: smallScreen ? '.25em' : '3.25em' }}>
              <ProgressBar
                snippetProgress={currentControlledPracticeNum}
                snippetsTotal={controlledPracticeTotalNum}
                progress={(currentControlledPracticeNum / controlledPracticeTotalNum).toFixed(2)}
              />
            </div>
            {progress !== 0 && processingCurrentStory && (
              <div className="bold">
                <span style={{ color: 'red' }}>
                  <FormattedMessage id="story-not-yet-processed" />
                </span>
              </div>
            )}
            {showRefreshButton && (
              <div className="flex gap-col-sm align-center">
                <div className="bold">
                  <span style={{ color: 'red' }}>
                    <FormattedMessage id="story-processing-now-finished" />
                  </span>
                </div>
                <Button onClick={refreshPage}>
                  <FormattedMessage id="refresh" />
                </Button>
              </div>
            )}
            <Divider />
            {story.paragraph.map((paragraph, index) => (
              <>
                <TextWithFeedback
                  exercise
                  hideFeedback={hideFeedback}
                  mode="practice"
                  snippet={paragraph}
                  snippetForTokens={acceptedTokens.data[index]}
                  answers={null}
                />
                <hr />
              </>
            ))}
            <div>
              {emptySnippets() && (
                <span style={{ color: '#ff0000', marginBottom: '0.5em' }}>
                  <FormattedMessage id="empty-snippets-warning" />
                </span>
              )}
              <Button
                variant="primary"
                onClick={saveControlledStory}
                type="button"
                style={{ width: '100%', marginBottom: '.5em', marginTop: '.5em' }}
              >
                <FormattedMessage id="save-controlled-story" />
              </Button>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleEditorReset}
              style={{ marginBottom: '0.5em' }}
            >
              {!pending && `${story.title}`}
            </div>
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
          <AnnotationBox />
        </div>
      </div>
      {showFooter && <Footer />}
    </div>
  )
}

export default ControlledStoryEditView
