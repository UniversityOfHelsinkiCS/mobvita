import React, { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { useLearningLanguage } from 'Utilities/common'
import { postAnswers, getCurrentSnippet } from 'Utilities/redux/snippetsReducer'
import { sendActivity } from 'Utilities/redux/competitionReducer'
import {
  finishSnippet,
  clearTouchedIds,
  addToCorrectAnswerIDs,
} from 'Utilities/redux/practiceReducer'
import Spinner from 'Components/Spinner'

const CheckAnswersButton = ({ handleClick, checkAnswersButtonTempDisable, playerFinished }) => {
  const attempt = useSelector(({ practice }) => practice.attempt)
  const {
    focused: focusedSnippet,
    pending: snippetPending,
    answersPending,
  } = useSelector(({ snippets }) => snippets)
  const { cacheSize } = useSelector(({ snippets }) => snippets)
  const [barColor, setBarColor] = useState('rgb(50, 170, 248)')
  const [attemptRatioPercentage, setAttemptRatioPercentage] = useState(100)

  const getFontStyle = () => {
    if (attemptRatioPercentage > 60) return { color: 'white' }
    return { color: 'black', textShadow: '0px 0px 4px #FFF' }
  }

  const currentSnippetId = () => {
    if (!focusedSnippet) return -1
    const { snippetid } = focusedSnippet
    return snippetid[snippetid.length - 1]
  }

  const noSnippetToFetchFromCache = () => {
    return (
      currentSnippetId() === cacheSize &&
      cacheSize !== focusedSnippet.total_num - 1
    )
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

  const handleSubmitAnswers = () => {
    if (attemptRatioPercentage <= 1) {
      handleClick(true)
    } else {
      handleClick()
    }
  }

  return (
    <button
      data-cy="check-answer"
      type="button"
      onClick={handleSubmitAnswers}
      className="check-answers-button"
      disabled={
        answersPending ||
        snippetPending ||
        !focusedSnippet ||
        checkAnswersButtonTempDisable ||
        playerFinished !== null ||
        noSnippetToFetchFromCache()
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
        answersPending && <Spinner variant={attemptRatioPercentage > 60 && "white" || "dark"} /> ||
        <FormattedMessage id="check-answer" />
      }
      </span>
    </button>
  )
}

const SnippetActions = ({ storyId, exerciseCount, playerFinished }) => {
  const learningLanguage = useLearningLanguage()
  const [checkAnswersButtonTempDisable, setcheckAnswersButtonTempDisable] = useState(false)
  const { cacheSize } = useSelector(({ snippets }) => snippets)
  const { currentAnswers, correctAnswerIDs, touchedIds, attempt, options, audio, audio_wids, voice } = useSelector(
    ({ practice }) => practice
  )
  const { snippets } = useSelector(({ snippets }) => ({ snippets }))
  const { competition_id, botCorrectPercent, startTime } = useSelector(({ compete }) => compete)
  const dispatch = useDispatch()

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
      .map(w => `${w.ID}`)

    dispatch(addToCorrectAnswerIDs(testedAndCorrectIDs))
  }, [attempt])

  const currentSnippetId = () => {
    if (!snippets.focused) return -1
    const { snippetid } = snippets.focused
    return snippetid[snippetid.length - 1]
  }

  const noSnippetToFetchFromCache = () => {
    return (
      currentSnippetId() === cacheSize &&
      cacheSize !== snippets.focused?.total_num - 1
    )
  }

  const checkAnswers = async lastAttempt => {
    const { starttime, snippetid } = snippets.focused

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
      audio_wids,
      voice,
      answers: filteredCurrentAnswers,
      last_attempt: lastAttempt,
    }

    const correct = Object.keys(currentAnswers).filter(
      key => currentAnswers[key].correct === currentAnswers[key].users_answer
    )

    const totalExercises = Object.keys(currentAnswers).length
    const num_correct = Object.keys(correct).length

    if (lastAttempt || totalExercises === num_correct) {
      dispatch(
        sendActivity(
          storyId,
          competition_id,
          botCorrectPercent,
          startTime,
          learningLanguage,
          num_correct,
          totalExercises,
          snippets.focused.total_num,
          currentSnippetId() == snippets.focused.total_num - 1
        )
      )
    }

    dispatch(clearTouchedIds())
    dispatch(postAnswers(storyId, answersObj, true))
    setcheckAnswersButtonTempDisable(true)
    setTimeout(() => {
      setcheckAnswersButtonTempDisable(false)
    }, 5000)
  }

  const handleRetry = () => {
    dispatch(getCurrentSnippet(storyId))
  }

  const submitAnswers = () => {
    dispatch(finishSnippet())

    checkAnswers(true)
  }
  

  const nextSnippetButtonDisabled =
    snippets.answersPending || snippets.pending || !snippets.focused || noSnippetToFetchFromCache()

  const isSnippetFetchedSuccessfully =
    snippets.answersPending || snippets.pending || snippets.focused

  return (
    <div>
      {isSnippetFetchedSuccessfully ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <CheckAnswersButton
            handleClick={checkAnswers}
            checkAnswersButtonTempDisable={checkAnswersButtonTempDisable}
            playerFinished={playerFinished}
          />
          <div>
            <Button
              data-cy={!nextSnippetButtonDisabled ? 'next-snippet-ready' : 'next-snippet-waiting'}
              variant="secondary"
              size="sm"
              disabled={nextSnippetButtonDisabled}
              onClick={submitAnswers}
              style={{ marginBottom: '0.5em' }}
            >
              <span>
                <FormattedMessage id="go-to-next-snippet" /> <Icon name="level down alternate" />
              </span>
            </Button>
          </div>
        </div>
      ) : (
        <Button
          block
          variant="primary"
          disabled={snippets.answersPending || snippets.pending}
          onClick={() => handleRetry()}
        >
          Retry loading snippet
        </Button>
      )}
    </div>
  )
}

export default SnippetActions
