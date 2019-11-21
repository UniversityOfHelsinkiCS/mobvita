import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Segment, Button } from 'semantic-ui-react'
import { getCurrentSnippet, postAnswers } from 'Utilities/redux/snippetsReducer'
import { getTranslationAction, clearTranslationAction } from 'Utilities/redux/translationReducer'
import { capitalize, localeOptions } from 'Utilities/common'

import ExerciseCloze from 'Components/PracticeView/ExerciseCloze'
import ExerciseMultipleChoice from 'Components/PracticeView/ExerciseMultipleChoice'
import ExerciseHearing from 'Components/PracticeView/ExerciseHearing'

const CurrentPractice = ({ storyId }) => {
  const [answers, setAnswers] = useState({})
  const [options, setOptions] = useState({})
  const [audio, setAudio] = useState([])
  const [touched, setTouched] = useState(0)
  const [attempt, setAttempts] = useState(0)
  const [language, setLanguage] = useState('')

  // Data about previously submitted snippet:
  const [previousSnippet, setPreviousSnippet] = useState({})
  const [previousAnswers, setPreviousAnswers] = useState({})

  const dispatch = useDispatch()

  const { snippets, locale } = useSelector(({ snippets, locale }) => ({ snippets, locale }))

  useEffect(() => {
    const currentLanguage = window.location.pathname.split('/')[2]
    setLanguage(currentLanguage)
    dispatch(getCurrentSnippet(storyId))
    dispatch(clearTranslationAction())
  }, [])

  const getExerciseCount = () => {
    let count = 0
    snippets.focused.practice_snippet.forEach((word) => {
      if (word.id) {
        count++
      }
    })

    return count
  }


  const checkAnswers = async () => {
    const { starttime, snippetid } = snippets.focused

    const answersObj = {
      starttime,
      story_id: storyId,
      snippet_id: [snippetid[0]],
      touched,
      untouched: getExerciseCount() - touched,
      attempt,
      options,
      audio,
      answers,
    }

    console.log(answersObj)

    setAttempts(attempt + 1)
    dispatch(postAnswers(storyId, answersObj))
  }

  const textToSpeech = (surfaceWord, wordLemmas) => {
    const selectedLocale = localeOptions.find(localeOption => localeOption.code === locale)
    window.responsiveVoice.speak(surfaceWord, `${language === 'german' ? 'Deutsch' : capitalize(language)} Female`)
    if (wordLemmas) {
      dispatch(getTranslationAction(capitalize(language), wordLemmas, capitalize(selectedLocale.name)))
    }
  }

  const handleAnswerChange = (e, word) => {
    const { surface, id, ID } = word

    if (!answers[ID]) {
      setTouched(touched + 1)
    }

    const modAnswer = {
      ...answers,
      [ID]: {
        correct: surface,
        users_answer: e.target.value,
        id,
      },
    }
    setAnswers(modAnswer)
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
        return <ExerciseHearing tabIndex={word.ID} handleChange={handleAnswerChange} handleClick={textToSpeech} key={word.ID} word={word} />
      }
      if (word.choices) {
        const { ID, choices, surface, id } = word
        options[ID] = choices

        if (!answers[ID]) { // Backend requires empty answer for multiple choice.
          const modAnswer = {
            ...answers,
            [ID]: {
              correct: surface,
              users_answer: "___",
              id,
            },
          }
          setAnswers(modAnswer)
        }

        return <ExerciseMultipleChoice tabIndex={word.ID} handleChange={handleMultiselectChange} key={word.ID} word={word} />
      }
      return <ExerciseCloze tabIndex={word.ID} handleChange={handleAnswerChange} handleClick={textToSpeech} key={word.ID} word={word} />
    }
    if (word.lemmas) {
      return (
        <span
          role="button"
          tabIndex={-1}
          className={!word.base && answers[word.ID] ? "word-interactive--exercise" : "word-interactive "}
          key={word.ID}
          onKeyDown={() => textToSpeech(word.surface, word.lemmas)}
          onClick={() => textToSpeech(word.surface, word.lemmas)}
        >
          {word.surface}
        </span>
      )
    }
    return word.surface
  }

  const renderPrevSnippet = (word) => {
    if (word.lemmas) {
      return (
        <span
          role="button"
          tabIndex={-1}
          className={!word.base && previousAnswers[word.ID] ? "word-interactive--exercise" : "word-interactive "}
          key={word.ID}
          onKeyDown={() => textToSpeech(word.surface, word.lemmas)}
          onClick={() => textToSpeech(word.surface, word.lemmas)}
        >
          {word.surface}
        </span>
      )
    }
    return word.surface
  }

  const continueToNextSnippet = () => {
    setPreviousAnswers(answers)
    setPreviousSnippet(snippets.focused)


    setAnswers({})
    setOptions({})
    setTouched(0)
    setAttempts(0)
    dispatch(getCurrentSnippet(storyId))
  }

  if (!snippets.focused || snippets.pending) return null

  const { practice_snippet: practice } = snippets.focused
  return (
    <>
      <h1>{`${snippets.focused.snippetid[0] + 1}/${snippets.focused.total_num}`}</h1>

      <Segment>
        <div>

          {Object.entries(previousSnippet).length > 0 ?
            previousSnippet.practice_snippet.map(exercise => renderPrevSnippet(exercise))
            : null
          }


          {practice.map(exercise => wordInput(exercise))}
          {getExerciseCount() === 0
            ? <Button onClick={continueToNextSnippet}>Continue to next snippet</Button>
            : <Button onClick={checkAnswers}>Check answers </Button>
          }

        </div>
      </Segment>
    </>
  )
}


export default CurrentPractice
