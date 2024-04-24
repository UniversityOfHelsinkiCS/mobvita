import React, { useEffect, useState } from 'react'
import useWindowDimensions from 'Utilities/windowDimensions'
import { getOpponent } from 'Utilities/redux/competitionReducer'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import OpponentBar from './OpponentBar'
import PlayerBar from './PlayerBar'
import CompeteEnd from './CompeteEnd'

const CompetitionProgress = ({ storyId, youWon, playerFinished, setPlayerFinished }) => {
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  const [exercisesInSnippets, setExercisesInSnippets] = useState([])
  const { previousAnswers } = useSelector(({ practice }) => practice)
  const [userCorrectAnswers, setUserCorrectAnswers] = useState(0)
  const [exercisesInFirst, setExercisesInFirst] = useState(null)
  const [botScore, setBotScore] = useState(0)
  const [endModalOpen, setEndModalOpen] = useState(false)

  const { botSnippetTimes, botCorrectPercent, cachedSnippets, snippets } = useSelector(
    ({ stories, compete, snippets, cachedSnippets }) => ({
      snippets,
      story: stories.focused,
      startTime: compete.startTime,
      botSnippetTimes: compete.snippetCompleteTime,
      botCorrectPercent: compete.botCorrectPercent,
      cachedSnippets: cachedSnippets.snippets,
    })
  )

  const smallScreen = width < 700
  const snippetsTotal = snippets.focused?.total_num

  useEffect(() => {
    const numCorrectAnswers = Object.values(previousAnswers).filter(
      e => e.correct.toLowerCase() === e.users_answer.toLowerCase()
    ).length

    setUserCorrectAnswers(numCorrectAnswers)
  }, [previousAnswers])

  useEffect(() => {
    if (!exercisesInFirst) {
      setExercisesInFirst(snippets.focused?.practice_snippet.filter(e => e.id).length)
    }
  }, [snippets])

  useEffect(() => {
    if (Object.keys(cachedSnippets).length > 0) {
      const exercisesPerSnippet = []

      Object.values(cachedSnippets).sort((a, b) => a.snippetid[0] - b.snippetid[0]).forEach(x => {
        exercisesPerSnippet.push(x.practice_snippet.filter(e => e.id).length)
      })
      exercisesPerSnippet.unshift(exercisesInFirst)
      setExercisesInSnippets(exercisesPerSnippet)
    }
  }, [cachedSnippets])

  if (!botSnippetTimes) {
    return (
      <div className="justify-center" style={{ alignItems: 'center' }}>
        Loading opponent failed. Click
        <Button
          style={{ margin: '0em .5em' }}
          size="sm"
          onClick={() => dispatch(getOpponent(storyId))}
        >
          here
        </Button>
        to try again.
      </div>
    )
  }

  return (
    <div className="competition-progress" style={{ top: smallScreen ? '0em' : '3em' }}>
      <CompeteEnd
        open={endModalOpen}
        setOpen={setEndModalOpen}
        setPlayerFinished={setPlayerFinished}
        playerFinished={playerFinished}
        playerScore={userCorrectAnswers}
        botScore={botScore}
        exercisesTotal={exercisesInSnippets.reduce((a, b) => a + b, 0)}
      />
      <OpponentBar
        botSnippetTimes={Object?.values(botSnippetTimes)}
        botCorrectPercent={botCorrectPercent}
        exercisesPerSnippet={exercisesInSnippets}
        setEndModalOpen={setEndModalOpen}
        playerFinished={playerFinished}
        setPlayerFinished={setPlayerFinished}
        botScore={botScore}
        setBotScore={setBotScore}
      />
      <PlayerBar
        snippetsTotal={snippetsTotal}
        currentSnippet={
          youWon ? Number(snippets.focused?.snippetid) + 1 : snippets.focused?.snippetid
        }
        exercisesPerSnippet={exercisesInSnippets}
        playerScore={userCorrectAnswers}
        setEndModalOpen={setEndModalOpen}
        playerFinished={playerFinished}
        setPlayerFinished={setPlayerFinished}
      />
    </div>
  )
}

export default CompetitionProgress
