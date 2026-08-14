import React, { useEffect, useState } from 'react'
import Spinner from 'Components/Spinner'
import AppProgressBar from 'Components/ui/AppProgressBar'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import useWindowDimensions from 'Utilities/windowDimensions'
import { useTimer } from 'Utilities/reactTimerHookCompat'
import { initializeTimer } from 'Utilities/redux/competitionReducer'
import { colors } from 'Assets/mui_theme/designTokens'

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

  const [currentSnippetBot, setCurrentSnippetBot] = useState(0)
  const smallScreen = useWindowDimensions().width < 500
  const dispatch = useDispatch()
  const { timerControls } = useSelector(({ compete }) => compete)

  const { controls: timer } = useTimer({
    initialTime: botSnippetTimes[0] * 1000,
    direction: 'backward',
    startImmediately: false,
    timeToUpdate: 100,
  })

  useEffect(() => {
    if (timer) dispatch(initializeTimer(timer))
  }, [timer])

  useEffect(() => {
    if (playerFinished) timerControls.stop()
  }, [playerFinished])

  const probCorrect = n => !!n && Math.random() <= n

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
    setCurrentSnippetBot(currentSnippetBot + 1)
    timerControls.setTime(botSnippetTimes[currentSnippetBot + 1] * 1000)
  }

  timer.setCheckpoints([
    {
      time: 0,
      callback: () => {
        handleBotMove()
      },
    },
  ])

  useEffect(() => {
    if (currentSnippetBot < snippetsTotal && !playerFinished && timerControls) {
      timerControls.start()
    } else if (!playerFinished && timerControls) {
      setPlayerFinished('bot')
      timerControls.stop()
      setTimeout(() => {
        setEndModalOpen(true)
      }, 1000)
    }
  }, [currentSnippetBot])

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
          {/* <div>{Math.round(timerControls?.getTime() / 1000 ?? 0)}</div>  for debugging */}
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
              <div className="justify-center" data-cy="opponent-bar-score">
                {botScore}
              </div>
              <div className="justify-center">
                <ThumbUpOutlinedIcon sx={{ color: 'orange', marginBottom: '.4em' }} />
              </div>
            </div>
          </div>
          <AppProgressBar
            value={getBarWidth()}
            height="0.9em"
            trackColor={colors.progressBarTrack}
            fillColor={colors.opponent}
            style={{ borderRadius: '10px 10px 0px 0px' }}
            fillProps={{ style: { borderRadius: 0 } }}
            label={<span data-cy="snippet-progress" />}
          />
        </div>
      )}
    </>
  )
}

export default OpponentBar
