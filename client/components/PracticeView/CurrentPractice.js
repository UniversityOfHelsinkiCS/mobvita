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
  const [options, setOptions] = useState({})
  const [audio, setAudio] = useState([])
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
      options,
      audio,
      answers,
    }

    console.log(answersObj)

    dispatch(getAnswers(storyId, answersObj))
  }

  const textToSpeech = (surfaceWord, wordLemmas) => {
    window.responsiveVoice.speak(surfaceWord, 'Finnish Female')
    dispatch(getTranslationAction('Finnish', wordLemmas))
  }

  const handleAnswerChange = (e, word) => {
    const { surface, id, ID } = word

    if (!answers[ID]) {
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

  const handleMultiselectChange = (event, word, data) => {
    const { id, ID, surface } = word
    const { value } = data

    answers[ID] = {
      correct: surface,
      users_answer: value,
      id,
    }
  }


  const wordInput = (word) => {
    if (word.id !== undefined) {
      if (word.listen) {
        if (!audio.includes(word.ID.toString())) {
          audio.push(word.ID.toString())
        }
        return <ExerciseHearing handleChange={handleAnswerChange} handleClick={textToSpeech} key={word.ID} word={word} />
      }
      if (word.choices) {
        const { ID, choices } = word
        options[ID] = choices
        return <ExerciseMultipleChoice handleChange={handleMultiselectChange} key={word.ID} word={word} />
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
