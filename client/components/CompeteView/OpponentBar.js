import React, { useEffect, useState } from 'react'
import Spinner from 'Components/Spinner'
import { Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'

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

  // const snippetsTotal = 3 // for faster debugging
  // const botSnippetTimes = new Array(snippetsTotal).fill(4) // for debugging

  const [timer, setTimer] = useState(null)
  const [interval, setInterval] = useState(botSnippetTimes[0])
  const [currentSnippetBot, setCurrentSnippetBot] = useState(0)
  const smallScreen = useWindowDimensions().width < 500

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

  const handleBotMove = () => {
    setInterval(botSnippetTimes[currentSnippetBot + 1])
    setCurrentSnippetBot(currentSnippetBot + 1)
  }

  const stopTimer = () => setTimer(() => clearTimeout(timer))

  useEffect(() => {
    if (currentSnippetBot <= snippetsTotal && !playerFinished) {
      setTimer(
        setTimeout(() => {
          handleBotMove()
        }, interval * 1000)
      )
    } else if (!playerFinished) {
      setPlayerFinished('bot')
      setTimeout(() => {
        setEndModalOpen(true)
      }, 1000)
    }
  }, [currentSnippetBot])

  useEffect(() => {
    if (playerFinished) stopTimer()
  }, [playerFinished])

  const getLabelsWidth = () => {
    if (currentSnippetBot > snippetsTotal) return 100
    if (smallScreen && currentSnippetBot / snippetsTotal < 0.3) return 30
    if (!smallScreen && currentSnippetBot / snippetsTotal < 0.12) return 12
    return (currentSnippetBot / snippetsTotal) * 100
  }

  const getBarWidth = () => {
    if (currentSnippetBot / snippetsTotal === 0) return 2
    return (currentSnippetBot / snippetsTotal) * 100
  }

  return (
    <>
      {!snippetsTotal ? (
        <Spinner />
      ) : (
        <div data-cy="opponent-bar">
          <div
            className="competition-bar-label"
            style={{
              alignItems: 'flex-end',
              width: `${getLabelsWidth()}%`,
            }}
          >
            <div className="bold">
              <FormattedMessage id="opponent" />
            </div>
            <div style={{ backgroundColor: 'white' }}>
              <div className="justify-center">{botScore}</div>
              <div className="justify-center">
                <Icon color="orange" name="thumbs up outline" style={{ marginBottom: '.4em' }} />
              </div>
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
                width: `${getBarWidth()}%`,
                backgroundColor: '#FA6',
                borderRadius: '0',
              }}
              role="progressbar"
              aria-valuenow={getBarWidth()}
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
