import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Progress } from 'semantic-ui-react'

const OpponentProgress = () => {
  const [timeNow, setTimeNow] = useState(0)

  const { compete, snippetNumber } = useSelector(({ compete, snippets }) => {
    const snippetNumber = snippets.focused.snippetid[0]
    return { compete, snippetNumber }
  })

  useEffect(() => {
    const interval = setInterval(() => setTimeNow((new Date()).getTime()), 1000)
    return () => { clearInterval(interval) }
  }, [])

  const theTimeWhenTheOpponentCompletedThisSnippet = Object.values(compete.snippetCompleteTime).reduce((acc, cur, idx) => {
    if (idx > snippetNumber) return acc

    return acc + cur
  }, 0)


  /*
    Good luck trying to figure this one out.

    This shows the status in this particular snippet.
  */
  const getPercentage = () => {

    const opponentTimeOnThisSnippet = compete.snippetCompleteTime[snippetNumber]
    const opponentStartedThisSnippet = theTimeWhenTheOpponentCompletedThisSnippet - opponentTimeOnThisSnippet

    const timeSpentOnCompetition = (timeNow - compete.startTime) / 1000
    const status = timeSpentOnCompetition - opponentStartedThisSnippet

    return (status / opponentTimeOnThisSnippet) * 100
  }

  const percent = getPercentage()

  const percentToStatus = () => {
    if (percent > 90) {
      return {
        color: 'red',
        text: 'Your opponent is ahead of you!',
      }
    }
    if (percent < 10) {
      return {
        color: 'green',
        text: 'Your opponent is right behind you!',
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
      <Progress color={status.color} percent={percent} style={{ marginTop: '0px' }}>
        <span>{status.text}</span>
      </Progress>
    </>
  )
}

export default OpponentProgress
