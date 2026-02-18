import React, { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { confettiRain, finalConfettiRain } from 'Utilities/common'
import { 
  postAnswers, 
  resetCurrentSnippet, 
  getNextSnippetFromCache,
  dropCachedSnippet,
  resetCachedSnippets, 
  postLessonSnippetAnswers } from 'Utilities/redux/snippetsReducer'
import { resetAnnotations } from 'Utilities/redux/annotationsReducer'
import {
  finishSnippet,
  clearTouchedIds,
  clearPractice,
  setAnswers,
  addToCorrectAnswerIDs,
} from 'Utilities/redux/practiceReducer'
import { setIrtDummyScore } from 'Utilities/redux/userReducer'
import Spinner from 'Components/Spinner'


const CheckAnswersButton = ({ handleClick, checkAnswersButtonTempDisable }) => {
  const { attempt, isNewSnippet } = useSelector(({ practice }) => practice)
  const {
    focused: focusedSnippet,
    pending: snippetPending,
    answersPending,
  } = useSelector(({ snippets }) => snippets)
  const [barColor, setBarColor] = useState('rgb(50, 170, 248)')
  const [attemptRatioPercentage, setAttemptRatioPercentage] = useState(100)

  const getFontStyle = () => {
    if (attemptRatioPercentage > 60) return { color: 'white' }
    return { color: 'black', textShadow: '0px 0px 4px #FFF' }
  }

  useEffect(() => {
    if (!snippetPending) {
      // const isFreshAttempt = !focusedSnippet?.max_attempt || attempt === 0
      const newAttemptRatioPercentage = 100 - 100 * ((attempt + 1) / focusedSnippet?.max_attempt)

      if (typeof newAttemptRatioPercentage !== 'number') setBarColor('rgb(50, 170, 248)')
      else {
        if (newAttemptRatioPercentage <= 60) setBarColor('#67b5ed')
        if (newAttemptRatioPercentage <= 40) setBarColor('#8ebfe2')
        if (newAttemptRatioPercentage <= 20) setBarColor('#b0c8d8')
      }

      if (focusedSnippet?.max_attempt - attempt === 1) {
        setAttemptRatioPercentage(1)
      } else if (newAttemptRatioPercentage <= 100) {
        setAttemptRatioPercentage(newAttemptRatioPercentage)
      } else {
        setAttemptRatioPercentage(100)
        setBarColor('rgb(50, 170, 248)')
      }
    }
  }, [attempt, isNewSnippet])

  return (
    <button
      data-cy="check-answer"
      type="button"
      onClick={() => handleClick()}
      className="check-answers-button"
      disabled={
        answersPending || snippetPending || !focusedSnippet || checkAnswersButtonTempDisable
      }
    >
      <div
        className="attempt-bar"
        style={{
          width: `${attemptRatioPercentage}%`,
          borderRadius: '13px',
        }}
      />
      <span style={{ ...getFontStyle() }}>
      {
        answersPending && <Spinner inline variant={attemptRatioPercentage > 60 && "white" || "dark"} /> ||
        <FormattedMessage id="check-answer" />
      }
      </span>
    </button>
  )
}

const SnippetActions = ({ storyId, exerciseCount, isControlledStory, exerciseMode, timerValue, numSnippets, lessonId, groupId, lessonStartOver }) => {
  const [checkAnswersButtonTempDisable, setcheckAnswersButtonTempDisable] = useState(false)

  const dispatch = useDispatch()
  const { id } = useParams()

  const { snippets } = useSelector(({ snippets }) => ({ snippets }))
  const { currentAnswers, correctAnswerIDs, touchedIds, attempt, options, audio, audio_wids, voice } = useSelector(
    ({ practice }) => practice
  )
  const { irt_dummy_score } = useSelector(({ user }) => user)


  const rightAnswerAmount = useMemo(
    () =>
      snippets.focused &&
      snippets.focused?.practice_snippet?.reduce(
        (sum, word) => (word.tested && !word.isWrong ? sum + 1 : sum),
        0
      ),
    [snippets]
  )

  useEffect(() => {
    const testedAndCorrectIDs = snippets?.focused?.practice_snippet?.filter(w => w.tested && !w.isWrong).map(w => `${w.ID}`)
    dispatch(addToCorrectAnswerIDs(testedAndCorrectIDs))

    let practice_snippet = snippets?.focused?.practice_snippet ? snippets?.focused?.practice_snippet : []
    let update_answers = {}
    for (const [key, answerObject] of Object.entries(currentAnswers)) {
      let word_ID = key.split("-")[0]
      answerObject['requestedHintsList'] = practice_snippet.find(w => w.ID == word_ID)?.requested_hints
      update_answers[key] = answerObject
    }
    dispatch(setAnswers(update_answers))
  }, [attempt])

  const formattedTimerValue = timerValue < 0 ? 0 : timerValue

  const checkAnswers = async lastAttempt => {
    const { starttime, snippetid, practice_snippet } = snippets.focused
    const { sessionId } = snippets

    const filteredCurrentAnswers = Object.keys(currentAnswers)
      .filter(key => !correctAnswerIDs.includes(key))
      .reduce((obj, key) => {
        obj[key] = currentAnswers[key]
        return obj
      }, {})

    const answersObj = {
      starttime,
      story_id: lessonId ? snippets.focused?.storyid : storyId,
      group_id: groupId,
      snippet_id: snippetid,
      touched: touchedIds.length,
      untouched: exerciseCount - touchedIds.length - rightAnswerAmount,
      attempt,
      options,
      audio,
      audio_wids,
      voice,
      answers: filteredCurrentAnswers,
      last_attempt: lastAttempt,
      timer_value: isControlledStory ? formattedTimerValue : null,
      session_id: sessionId,
      frozen_exercise: isControlledStory,
    }

    dispatch(clearTouchedIds())
    if (lessonId){
      dispatch(postLessonSnippetAnswers(lessonId, answersObj, false))
    } else {
      dispatch(postAnswers(storyId, answersObj, false))
    }

    const wrongAnswers = Object.keys(filteredCurrentAnswers).filter(
      key =>
        filteredCurrentAnswers[key].users_answer.toLowerCase() !==
        filteredCurrentAnswers[key].correct.toLowerCase()
    )

    let update_answers = {}
    for (const [key, answerObject] of Object.entries(filteredCurrentAnswers)) {
      if (wrongAnswers.includes(key)){
        answerObject['cue'] = answerObject['users_answer']
        update_answers[key] = answerObject
      }
    }
    dispatch(setAnswers(update_answers))

    const num_wrong_exercises = wrongAnswers ? wrongAnswers.length : 0
    const num_correct_exercises = Object.keys(filteredCurrentAnswers).length - num_wrong_exercises
    if (irt_dummy_score){
      const dummy_delta = num_correct_exercises - num_wrong_exercises
      let dummy_score = irt_dummy_score + 0.06*dummy_delta
      dummy_score = dummy_score < 0 ? 0 : dummy_score
      dummy_score = dummy_score > 100 ? 100 : dummy_score
      dispatch(setIrtDummyScore(dummy_score))
    }

    if ((!wrongAnswers || wrongAnswers.length < 1) && attempt === 0) {
      if (snippetid[0] === numSnippets - 1) {
        const endDate = Date.now() + 2 * 1000
        const colors = ['#bb0000', '#ffffff']
        finalConfettiRain(colors, endDate)
      } else {
        confettiRain()
      }
    }
  }

  const submitAnswers = () => {
    dispatch(finishSnippet())
    checkAnswers(true)
  }

  const handleRestart = () => {
    dispatch(clearPractice())
    dispatch(resetCachedSnippets())
    setcheckAnswersButtonTempDisable(true)
    if (lessonId){
      lessonStartOver()
    } else {
      dispatch(resetAnnotations())
      setcheckAnswersButtonTempDisable(true)
      const initSnippet = snippets.cachedSnippets[`${id}-0`]
      if (initSnippet) {
        dispatch(dropCachedSnippet(`${id}-0`))
        dispatch(getNextSnippetFromCache(`${id}-0`, initSnippet, true))
      } else dispatch(resetCurrentSnippet(id, isControlledStory, exerciseMode))
    }
    setTimeout(() => {
      setcheckAnswersButtonTempDisable(false)
    }, 5000)
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <CheckAnswersButton
          handleClick={checkAnswers}
          checkAnswersButtonTempDisable={checkAnswersButtonTempDisable}
        />
        <div className="space-between">
          <Button
            variant="secondary"
            size="sm"
            disabled={snippets.answersPending || snippets.pending || !snippets.focused || snippets.cacheSize === 0}
            onClick={submitAnswers}
            style={{ marginBottom: '0.5em' }}
          >
            <span>
              <FormattedMessage id="go-to-next-snippet" /> <Icon name="level down alternate" />
            </span>
          </Button>
          {!isControlledStory && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRestart}
              style={{ marginBottom: '0.5em' }}
              disabled={snippets.answersPending || snippets.pending}
            >
              <span>
                <FormattedMessage id="start-over" /> <Icon name="level up alternate" />
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SnippetActions
