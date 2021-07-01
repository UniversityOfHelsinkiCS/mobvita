import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import OpponentBar from './OpponentBar'
import PlayerBar from './PlayerBar'
import CompeteEnd from './CompeteEnd'

const CompetitionProgress = ({ playerDone, playerFinished, setPlayerFinished }) => {
  const [exercisesInSnippets, setExercisesInSnippets] = useState([])
  const { previousAnswers } = useSelector(({ practice }) => practice)
  const [userCorrectAnswers, setUserCorrectAnswers] = useState(0)
  const [exercisesInFirst, setExercisesInFirst] = useState(null)
  const [botScore, setBotScore] = useState(0)
  const [endModalOpen, setEndModalOpen] = useState(false)

  const { botSnippetTimes, botCorrectPercent, cachedSnippets, startTime, snippets } = useSelector(
    ({ stories, compete, snippets }) => ({
      snippets,
      story: stories.focused,
      startTime: compete.startTime,
      botSnippetTimes: compete.snippetCompleteTime,
      botCorrectPercent: compete.botCorrectPercent,
      cachedSnippets: compete.cachedSnippets,
    })
  )

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
    if (cachedSnippets.length > 0) {
      const exercisesPerSnippet = []

      cachedSnippets.forEach(x => {
        exercisesPerSnippet.push(x.practice_snippet.filter(e => e.id).length)
      })
      exercisesPerSnippet.unshift(exercisesInFirst)
      setExercisesInSnippets(exercisesPerSnippet)
    }
  }, [cachedSnippets])

  if (!botSnippetTimes) return null

  return (
    <div className="competition-progress" style={{ top: '3em' }}>
      <CompeteEnd
        open={endModalOpen}
        setOpen={setEndModalOpen}
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
          playerDone ? Number(snippets.focused?.snippetid) + 1 : snippets.focused?.snippetid
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
