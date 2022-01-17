import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Divider, Segment } from 'semantic-ui-react'
import {
  getOpponent,
  competitionStartNow,
  resetCachedSnippets,
  setWillPause,
  setIsPaused,
} from 'Utilities/redux/competitionReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import { resetCurrentSnippet } from 'Utilities/redux/snippetsReducer'
import { getTextStyle, learningLanguageSelector, getMode } from 'Utilities/common'
import ReportButton from 'Components/ReportButton'
import useWindowDimensions from 'Utilities/windowDimensions'
import { keyboardLayouts } from 'Components/PracticeView/KeyboardLayouts'
import Footer from 'Components/Footer'
import VirtualKeyboard from 'Components/PracticeView/VirtualKeyboard'
import { setTouchedIds, setAnswers, clearPractice } from 'Utilities/redux/practiceReducer'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import PreviousSnippets from 'Components/CompeteView/PreviousSnippets'
import CurrentSnippet from 'Components/CompeteView/CurrentSnippet'
import ScrollArrow from 'Components/ScrollArrow'
import DictionaryHelp from 'Components/DictionaryHelp'
import { FormattedMessage } from 'react-intl'
import { Spinner } from 'react-bootstrap'
import FeedbackInfoModal from 'Components/CommonStoryTextComponents/FeedbackInfoModal'
import CompetitionProgress from 'Components/CompeteView/CompetitionProgress'
import StartModal from 'Components/TimedActivityStartModal'
import { useHistory } from 'react-router-dom'
import CompetitionPause from './CompetitionPause'

const CompeteView = ({ match }) => {
  const dispatch = useDispatch()
  const { id } = match.params
  const learningLanguage = useSelector(learningLanguageSelector)
  const { width } = useWindowDimensions()
  const history = useHistory()
  const [startModalOpen, setStartModalOpen] = useState(true)
  const { timerControls } = useSelector(({ compete }) => compete)

  const { story, startTime, snippets, pending } = useSelector(({ stories, compete, snippets }) => ({
    snippets,
    story: stories.focused,
    startTime: compete.startTime,
    snippetCompleteTime: compete.snippetCompleteTime,
    botCorrectPercent: compete.botCorrectPercent,
  }))

  const [playerFinished, setPlayerFinished] = useState(null)
  const [youWon, setYouWon] = useState(false)
  const mode = getMode()

  const { isPaused, willPause } = useSelector(({ compete }) => compete)

  const showFooter = width > 640
  const showVirtualKeyboard = width > 500 && keyboardLayouts[learningLanguage]

  const initializeCompetition = async () => {
    await Promise.all([
      dispatch(getStoryAction(id, mode)),
      dispatch(clearPractice()),
      dispatch(resetCurrentSnippet(id)),
      dispatch(clearTranslationAction()),
      dispatch(resetCachedSnippets()),
      dispatch(getOpponent(id)),
    ])
    await dispatch(competitionStartNow())
  }

  useEffect(() => {
    initializeCompetition()
  }, [])

  useEffect(() => {
    if (!startModalOpen) {
      timerControls.start()
    }
  }, [startModalOpen])

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

  const handlePauseOrResumeClick = () => {
    if (isPaused) {
      dispatch(setIsPaused(false))
      timerControls.start()
    } else {
      dispatch(setWillPause(true))
    }
  }

  if (!story || !startTime || !snippets.focused) {
    return (
      <div className="cont-tall pt-sm flex-col space-between">
        <div className="justify-center">
          <div className="cont">
            <Segment>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner animation="border" variant="info" size="lg" />
              </div>
            </Segment>
          </div>
          <DictionaryHelp />
        </div>
      </div>
    )
  }

  return (
    <div className="cont-tall pt-sm flex-col space-between">
      <div className="justify-center">
        <div className="cont">
          <Segment>
            <div className="flex space-between">
              <div>
                <div
                  className="story-title"
                  style={{
                    ...getTextStyle(learningLanguage, 'title'),
                    width: '100%',
                  }}
                >
                  {!pending && story && `${story.title}`}
                </div>
                {story?.url && !pending ? (
                  <a href={story.url}>
                    <FormattedMessage id="Source" />
                  </a>
                ) : null}
              </div>
              <CompetitionPause handlePauseOrResumeClick={handlePauseOrResumeClick} />
            </div>
            <Divider />
            {!startTime ? (
              <div>
                <Spinner animation="border" variant="info" size="sm" />
              </div>
            ) : (
              <CompetitionProgress
                storyId={id}
                youWon={youWon}
                playerFinished={playerFinished}
                setPlayerFinished={setPlayerFinished}
              />
            )}
            <PreviousSnippets />
            <hr />
            <CurrentSnippet
              storyId={id}
              handleInputChange={handleAnswerChange}
              setPlayerFinished={setPlayerFinished}
              setYouWon={setYouWon}
              finished={playerFinished}
            />
            <ScrollArrow />
            {willPause && !isPaused && (
              <div
                className="justify-center"
                style={{ color: 'rgb(81, 138, 248)', fontWeight: '500' }}
              >
                <FormattedMessage id="pausing-after-this-snippet" />
              </div>
            )}
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
        <StartModal
          open={startModalOpen}
          setOpen={setStartModalOpen}
          activity="competition-mode"
          onBackClick={() => history.push('/library')}
        />
        <DictionaryHelp />
        <FeedbackInfoModal />
      </div>
      {showFooter && <Footer />}
    </div>
  )
}

export default CompeteView
