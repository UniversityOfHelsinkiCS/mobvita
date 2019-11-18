import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Segment, Button } from 'semantic-ui-react'
import { getCurrentSnippet, getAnswers } from 'Utilities/redux/snippetsReducer'

import ExerciseCloze from 'Components/PracticeView/ExerciseCloze'
import ExerciseMultipleChoice from 'Components/PracticeView/ExerciseMultipleChoice'
import ExerciseHearing from 'Components/PracticeView/ExerciseHearing'

const CurrentPractice = ({ storyId }) => {
  const [answer, setAnswer] = useState({})
  const dispatch = useDispatch()

  const { snippets } = useSelector(({ snippets }) => ({ snippets }))

  useEffect(() => {
    dispatch(getCurrentSnippet(storyId))
  }, [])

  const checkAnswers = () => {
    // dispatch(getAnswers(storyId))
    dispatch(getCurrentSnippet(storyId))
    // TODO: Analyze results once endpoint actually exists
  }

  const textToSpeech = (word) => {
    window.responsiveVoice.speak(word, 'Finnish Female')
  }

  const handleChange = (e, ID) => {
    if (!answer[ID]) {
      const modAnswer = {
        ...answer,
        [ID]: e.target.value
      }
      setAnswer(modAnswer)
    } else {
      answer[ID] = e.target.value
    }
  }


  const wordInput = (word) => {
    if (word.id !== undefined) {
      if (word.listen) {
        return <ExerciseHearing handleChange={handleChange} handleClick={textToSpeech} key={word.ID} word={word} />
      }
      if (word.choices) {
        return <ExerciseMultipleChoice handleChange={handleChange} key={word.ID} word={word} />
      }
      return <ExerciseCloze handleChange={handleChange} handleClick={textToSpeech} key={word.ID} word={word} />
    }
    return (
      <span
        role="button"
        tabIndex={0}
        className="word-interactive"
        key={word.ID}
        onKeyDown={() => textToSpeech(word.surface)}
        onClick={() => textToSpeech(word.surface)}
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
        {practice.map(word => wordInput(word))}
        <Button onClick={checkAnswers}> check answers </Button>
      </div>
    </Segment>
  )
}

export default CurrentPractice
