import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Divider, Segment } from 'semantic-ui-react'
import { getOpponent, competitionStartNow } from 'Utilities/redux/competitionReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import { resetCurrentSnippet, getCurrentSnippet } from 'Utilities/redux/snippetsReducer'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import ReportButton from 'Components/ReportButton'
import useWindowDimensions from 'Utilities/windowDimensions'
import { keyboardLayouts } from 'Components/CompeteView/KeyboardLayouts'
import Footer from 'Components/Footer'
import VirtualKeyboard from 'Components/CompeteView/VirtualKeyboard'
import { setTouchedIds, setAnswers } from 'Utilities/redux/practiceReducer'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import PreviousSnippets from 'Components/CompeteView/PreviousSnippets'
import CurrentSnippet from 'Components/CompeteView/CurrentSnippet'
import ScrollArrow from 'Components/ScrollArrow'
import DictionaryHelp from 'Components/DictionaryHelp'
import { FormattedMessage } from 'react-intl'
import { Spinner } from 'react-bootstrap'
import ReferenceModal from 'Components/CompeteView/ReferenceModal'
import CompetitionProgress from 'Components/CompeteView/CompetitionProgress'

const CompeteView = ({ match }) => {
  const dispatch = useDispatch()
  const { id } = match.params
  const learningLanguage = useSelector(learningLanguageSelector)
  const { width } = useWindowDimensions()
  const { story, startTime, snippets, pending } = useSelector(({ stories, compete, snippets }) => ({
    snippets,
    story: stories.focused,
    startTime: compete.startTime,
    snippetCompleteTime: compete.snippetCompleteTime,
    botCorrectPercent: compete.botCorrectPercent,
  }))

  const [playerFinished, setPlayerFinished] = useState(null)
  const [playerDone, setPlayerDone] = useState(false)

  const showFooter = width > 640
  const showVirtualKeyboard = width > 500 && keyboardLayouts[learningLanguage]

  const initializeCompetition = async () => {
    await Promise.all([
      dispatch(getStoryAction(id)),
      dispatch(resetCurrentSnippet(id)),
      dispatch(clearTranslationAction()),
      dispatch(getOpponent(id)),
    ])
    await dispatch(competitionStartNow())
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

  useEffect(() => {
    initializeCompetition()
  }, [])
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
            <h3
              style={{
                ...getTextStyle(learningLanguage, 'title'),
                width: '100%',
                paddingRight: '1em',
                marginBottom: 0,
              }}
            >
              {!pending && story && `${story.title}`}
            </h3>
            {story?.url && !pending ? (
              <a href={story.url}>
                <FormattedMessage id="Source" />
              </a>
            ) : null}
            <Divider />
            {!startTime ? (
              <div>
                <Spinner animation="border" variant="info" size="sm" />
              </div>
            ) : (
              <CompetitionProgress
                storyId={id}
                playerDone={playerDone}
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
              playerFinished={playerFinished}
              setPlayerDone={setPlayerDone}
            />
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
        <DictionaryHelp />
        <ReferenceModal />
      </div>
      {showFooter && <Footer />}
    </div>
  )
}

export default CompeteView
