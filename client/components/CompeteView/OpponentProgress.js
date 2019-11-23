import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Progress } from 'semantic-ui-react'

const OpponentProgress = () => {
  const [startingTime, setStartingTime] = useState(undefined)
  const [timeNow, setTimeNow] = useState(0)
  const { compete, snippetNumber } = useSelector(({ compete, snippets }) => {
    const snippetNumber = snippets.focused.snippetid[0]
    return { compete, snippetNumber }
  })

  const initialize = () => {
    const time = (new Date()).getTime()
    setStartingTime(time)
  }

  const updateTime = () => {
    if (!startingTime) return

    const acualTime = (new Date()).getTime()
    const difference = acualTime - startingTime
    setTimeNow(difference / 1000)
    setTimeout(updateTime, 1000)
  }

  useEffect(() => { initialize() }, [])
  useEffect(() => { updateTime() }, [startingTime])

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

    const acualTimeNow = (new Date()).getTime()
    const timeSpentOnCompetition = (acualTimeNow - compete.startTime) / 1000
    const status = timeSpentOnCompetition - opponentStartedThisSnippet

    return (status / opponentTimeOnThisSnippet) * 100
  }

  const percent = getPercentage()
  return (
    <>
      <Progress percent={percent} style={{ transfrom: 'rotate(90deg)' }} />
    </>
  )
}

export default OpponentProgress
