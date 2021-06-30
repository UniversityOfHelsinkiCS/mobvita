import React, { useEffect, useState } from 'react'
import Spinner from 'Components/Spinner'
import { Icon } from 'semantic-ui-react'

const OpponentBar = ({
  botSnippetTimes,
  botCorrectPercent,
  exercisesPerSnippet,
  playerFinished,
  setPlayerFinished,
  setEndModalOpen,
  botScore,
  setBotScore,
}) => {
  const snippetsTotal = botSnippetTimes?.length

  // const snippetsTotal = 3
  // const botSnippetTimes = new Array(snippetsTotal).fill(4)

  const [interval, setInterval] = useState(botSnippetTimes[0])
  const [currentSnippetBot, setCurrentSnippetBot] = useState(0)

  const probCorrect = n => {
    return !!n && Math.random() <= n
  }

  const computeNumCorrectForSnippet = exercisesInSnippet => {
    const probResults = []

    Array.from({ length: exercisesInSnippet }, _ =>
      probResults.push(probCorrect(botCorrectPercent))
    )

    return probResults.filter(e => e).length
  }

  useEffect(() => {
    if (exercisesPerSnippet[currentSnippetBot - 1]) {
      const numCorrectCurrentSnippet = computeNumCorrectForSnippet(
        exercisesPerSnippet[currentSnippetBot - 1]
      )

      setBotScore(botScore + numCorrectCurrentSnippet)
    }
  }, [currentSnippetBot])

  useEffect(() => {
    if (currentSnippetBot <= snippetsTotal && !playerFinished) {
      setTimeout(() => {
        setInterval(botSnippetTimes[currentSnippetBot + 1])
        setCurrentSnippetBot(currentSnippetBot + 1)
      }, interval * 1000)
    } else {
      setPlayerFinished('bot')
      setTimeout(() => {
        setEndModalOpen(true)
      }, 1000)
    }
  }, [currentSnippetBot])

  const getLabelsWidth = () => {
    if (currentSnippetBot > snippetsTotal) return 100
    if (currentSnippetBot / snippetsTotal < 0.12) return 12
    return (currentSnippetBot / snippetsTotal) * 100
  }

  return (
    <>
      {!snippetsTotal ? (
        <Spinner />
      ) : (
        <div>
          <div
            className="competition-bar-label"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              width: `${getLabelsWidth()}%`,
            }}
          >
            <div className="bold">Opponent</div>
            <div style={{ backgroundColor: 'white' }}>
              <div>{botScore}</div>
              <Icon name="thumbs up outline" />
            </div>
          </div>
          <div
            style={{
              height: '0.9em',
              textAlign: 'center',
              borderRadius: '10px 10px 0px 0px',
            }}
            className="progress"
          >
            <span
              data-cy="snippet-progress"
              style={{
                marginTop: '0.75em',
                position: 'absolute',
                right: 0,
                left: 0,
              }}
            />
            <div
              className="progress-bar bg-warning"
              style={{
                width: `${(currentSnippetBot / snippetsTotal) * 100}%`,
                backgroundColor: '#FA6',
                borderRadius: '0',
              }}
              role="progressbar"
              aria-valuenow={currentSnippetBot / snippetsTotal}
              aria-valuemin="0"
              aria-valuemax="100"
              height="50%"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default OpponentBar
