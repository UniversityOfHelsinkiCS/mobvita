import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Segment, Button } from 'semantic-ui-react'
import { getCurrentSnippet, getAnswers } from 'Utilities/redux/snippetsReducer'
import { getTranslationAction } from 'Utilities/redux/translationReducer'

import ExerciseCloze from 'Components/PracticeView/ExerciseCloze'
import ExerciseMultipleChoice from 'Components/PracticeView/ExerciseMultipleChoice'
import ExerciseHearing from 'Components/PracticeView/ExerciseHearing'

const CurrentPractice = ({ storyId }) => {
  const [answers, setAnswer] = useState({})
  const [touched, setTouched] = useState(0)
  const dispatch = useDispatch()

  const { snippets } = useSelector(({ snippets }) => ({ snippets }))

  useEffect(() => {
    dispatch(getCurrentSnippet(storyId))
  }, [])

  const checkAnswers = () => {
    const { starttime, snippetid, total_num: totalNum } = snippets.focused

    const answersObj = {
      starttime,
      story_id: storyId,
      snippet_id: snippetid[0],
      touched,
      untouched: totalNum - touched,
      answers,
    }

    console.log(answersObj)

    // dispatch(getAnswers(storyId, answersObj))
  }

  const textToSpeech = (surfaceWord, wordLemmas) => {
    window.responsiveVoice.speak(surfaceWord, 'Finnish Female')
    dispatch(getTranslationAction('Finnish', wordLemmas))
  }

  const handleAnswerChange = (e, word) => {
    const { surface, id, ID } = word

    if (word.choices) {
      answers[ID] = {
        [ID]: word.choices,
      }
    } else if (!answers[ID]) {
      const modAnswer = {
        ...answers,
        [ID]: {
          correct: surface,
          users_answer: e.target.value,
          id,
        },
      }
      setTouched(touched + 1)
      setAnswer(modAnswer)
    } else {
      answers[ID].users_answer = e.target.value
    }
  }


  const wordInput = (word) => {
    if (word.id !== undefined) {
      if (word.listen) {
        return <ExerciseHearing handleChange={handleAnswerChange} handleClick={textToSpeech} key={word.ID} word={word} />
      }
      if (word.choices) {
        return <ExerciseMultipleChoice handleChange={handleAnswerChange} key={word.ID} word={word} />
      }
      return <ExerciseCloze handleChange={handleAnswerChange} handleClick={textToSpeech} key={word.ID} word={word} />
    }
    return (
      <span
        role="button"
        tabIndex={0}
        className="word-interactive"
        key={word.ID}
        onKeyDown={() => textToSpeech(word.surface, word.lemmas)}
        onClick={() => textToSpeech(word.surface, word.lemmas)}
        tabIndex="-1"
      >
        {word.surface}
      </span>
    )
  }

  if (!snippets.focused) return null
  const { practice_snippet: practice } = snippets.focused
  return (
    <Segment>
      <div>
        {practice.map(exercise => wordInput(exercise))}
        <Button onClick={checkAnswers}> check answers </Button>
      </div>
    </Segment>
  )
}

export default CurrentPractice
