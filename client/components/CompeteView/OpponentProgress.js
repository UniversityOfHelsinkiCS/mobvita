import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Progress } from 'semantic-ui-react'

const OpponentProgress = () => {
  const [timeNow, setTimeNow] = useState(0)
  const [opponentScore, setOpponentScore] = useState(0)

  const { compete, snippetNumber } = useSelector(({ compete, snippets }) => {
    const snippetNumber = snippets.focused.snippetid[0]
    return { compete, snippetNumber }
  })

  const { opponentPercent } = compete

  useEffect(() => {
    setOpponentScore((compete.total * opponentPercent).toFixed(0))
  }, [compete.total])

  useEffect(() => {
    const interval = setInterval(() => setTimeNow(new Date().getTime()), 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const theTimeWhenTheOpponentCompletedThisSnippet = Object.values(
    compete.snippetCompleteTime
  ).reduce((acc, cur, idx) => {
    if (idx > snippetNumber) return acc

    return acc + cur
  }, 0)

  /*
    Good luck trying to figure this one out.

    This shows the status in this particular snippet.
  */
  const getPercentage = () => {
    const opponentTimeOnThisSnippet = compete.snippetCompleteTime[snippetNumber]
    const opponentStartedThisSnippet =
      theTimeWhenTheOpponentCompletedThisSnippet - opponentTimeOnThisSnippet

    const timeSpentOnCompetition = (timeNow - compete.startTime) / 1000
    const status = timeSpentOnCompetition - opponentStartedThisSnippet

    return (status / opponentTimeOnThisSnippet) * 100
  }

  const percent = getPercentage()

  const percentToStatus = () => {
    if (percent > 90) {
      return {
        color: 'red',
        text: 'Your opponent is answering faster than you!',
      }
    }
    if (percent < 10) {
      return {
        color: 'green',
        text: 'You are really fast!',
      }
    }
    return {
      color: 'yellow',
      text: 'Your opponent is almost tied with you!',
    }
  }

  const status = percentToStatus()
  return (
    <>
      {compete.total + 1 ? (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <span>
            {' '}
            Score: {compete.total - compete.wrong} / {compete.total}
          </span>
          <span>
            {' '}
            Opponent: {opponentScore} / {compete.total}
          </span>
        </div>
      ) : null}
      <Progress
        color={status.color}
        percent={percent}
        style={{ marginTop: '0px', marginBottom: '3em' }}
      >
        <span>{status.text}</span>
      </Progress>
    </>
  )
}

export default OpponentProgress
