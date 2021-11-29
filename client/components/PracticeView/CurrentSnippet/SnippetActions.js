import React, { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { postAnswers, resetCurrentSnippet } from 'Utilities/redux/snippetsReducer'
import { resetAnnotations } from 'Utilities/redux/annotationsReducer'
import {
  finishSnippet,
  clearTouchedIds,
  clearPractice,
  addToCorrectAnswerIDs,
} from 'Utilities/redux/practiceReducer'

const CheckAnswersButton = ({ handleClick, checkAnswersButtonTempDisable }) => {
  const attempt = useSelector(({ practice }) => practice.attempt)
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
  }, [focusedSnippet, attempt])

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
        style={{
          width: `${attemptRatioPercentage}%`,
          backgroundColor: barColor,
          borderRadius: '13px',
        }}
      />
      <span style={{ ...getFontStyle() }}>
        <FormattedMessage id="check-answer" />
      </span>
    </button>
  )
}

const SnippetActions = ({ storyId, exerciseCount }) => {
  const [checkAnswersButtonTempDisable, setcheckAnswersButtonTempDisable] = useState(false)
  const { currentAnswers, correctAnswerIDs, touchedIds, attempt, options, audio } = useSelector(
    ({ practice }) => practice
  )
  const { snippets } = useSelector(({ snippets }) => ({ snippets }))
  const dispatch = useDispatch()
  const { id } = useParams()
  const history = useHistory()
  const isControlledStory = history.location.pathname.includes('controlled-practice')

  const rightAnswerAmount = useMemo(
    () =>
      snippets.focused &&
      snippets.focused.practice_snippet.reduce(
        (sum, word) => (word.tested && !word.isWrong ? sum + 1 : sum),
        0
      ),
    [snippets]
  )

  useEffect(() => {
    const testedAndCorrectIDs = snippets?.focused?.practice_snippet
      .filter(w => w.tested && !w.isWrong)
      .map(w => w.ID.toString())

    dispatch(addToCorrectAnswerIDs(testedAndCorrectIDs))
  }, [attempt])

  const checkAnswers = async lastAttempt => {
    const { starttime, snippetid } = snippets.focused
    const { sessionId } = snippets

    const filteredCurrentAnswers = Object.keys(currentAnswers)
      .filter(key => !correctAnswerIDs.includes(key))
      .reduce((obj, key) => {
        obj[key] = currentAnswers[key]
        return obj
      }, {})

    const answersObj = {
      starttime,
      story_id: storyId,
      snippet_id: snippetid,
      touched: touchedIds.length,
      untouched: exerciseCount - touchedIds.length - rightAnswerAmount,
      attempt,
      options,
      audio,
      answers: filteredCurrentAnswers,
      last_attempt: lastAttempt,
    }

    dispatch(clearTouchedIds())
    dispatch(postAnswers(storyId, answersObj, false, isControlledStory, sessionId))
  }

  const submitAnswers = () => {
    dispatch(finishSnippet())
    checkAnswers(true)
  }

  const handleRestart = () => {
    dispatch(clearPractice())
    dispatch(resetCurrentSnippet(id, isControlledStory))
    dispatch(resetAnnotations())
    setcheckAnswersButtonTempDisable(true)
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
            disabled={snippets.answersPending || snippets.pending || !snippets.focused}
            onClick={submitAnswers}
            style={{ marginBottom: '0.5em' }}
          >
            <span>
              <FormattedMessage id="go-to-next-snippet" /> <Icon name="level down alternate" />
            </span>
          </Button>
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
        </div>
      </div>
    </div>
  )
}

export default SnippetActions
