import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Segment, Button } from 'semantic-ui-react'
import { getCurrentSnippet, getNextSnippet, postAnswers, setTotalNumberAction } from 'Utilities/redux/snippetsReducer'
import { getTranslationAction, clearTranslationAction } from 'Utilities/redux/translationReducer'
import { capitalize, localeOptions } from 'Utilities/common'

import PreviousSnippet from 'Components/PracticeView/PreviousSnippet'
import ResetButton from 'Components/PracticeView/ResetButton'
import ExerciseCloze from 'Components/PracticeView/ExerciseCloze'
import ExerciseMultipleChoice from 'Components/PracticeView/ExerciseMultipleChoice'
import ExerciseHearing from 'Components/PracticeView/ExerciseHearing'

const CurrentPractice = ({ storyId }) => {
  const [answers, setAnswers] = useState({})
  const [options, setOptions] = useState({})
  const [audio, setAudio] = useState([])
  const [touchedIDs, setTouchedIds] = useState([])
  const [touched, setTouched] = useState(0)
  const [attempt, setAttempts] = useState(0)
  const [language, setLanguage] = useState('')
  const [exerciseCount, setExerciseCount] = useState(0)

  const dispatch = useDispatch()

  const { snippets, locale } = useSelector(({ snippets, locale }) => ({ snippets, locale }))

  useEffect(() => {
    const currentLanguage = window.location.pathname.split('/')[2]
    setLanguage(currentLanguage)
    dispatch(getCurrentSnippet(storyId))
    dispatch(clearTranslationAction())
  }, [])

  const setInitialAnswers = () => {
    if (snippets.focused) {
      const filteredSnippet = snippets.focused.practice_snippet.filter(word => word.id)
      const initialAnswers = filteredSnippet.reduce((answerObject, currentWord) => {
        const { surface, id, ID, base, bases, listen, choices } = currentWord
        if (answers[ID]) return { ...answerObject, [ID]: answers[ID] }
        const newAnswerObject = {
          ...answerObject,
          [ID]: {
            correct: surface,
            users_answer: (listen || choices) ? '' : (base || bases),
            id,
          }
        }
        return newAnswerObject
      }, {})
      if (Object.keys(initialAnswers).length > 0) setAnswers(initialAnswers)
      setExerciseCount(getExerciseCount())
    }
  }

  useEffect(setInitialAnswers, [snippets.focused])

  useEffect(() => {
    // has to be done since answers don't include data on
    // how many snippets are in total
    // kinda ugly though, pls fix
    if (snippets.focused) {
      const { total_num } = snippets.focused
      if (total_num && total_num !== snippets.totalnum) {
        dispatch(setTotalNumberAction(total_num))
      }
    }
  }, [snippets])

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
      touched: touched,
      untouched: exerciseCount - touched,
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

    if (!touchedIDs.includes(ID)) {
      setTouchedIds(touchedIDs.concat(ID))
      setTouched(touched + 1)
    }

    const newAnswers = {
      ...answers,
      [ID]: {
        correct: surface,
        users_answer: e.target.value,
        id,
      },
    }
    setAnswers(newAnswers)
  }

  const handleMultiselectChange = (event, word, data) => {
    const { id, ID, surface } = word
    const { value } = data

    if (!touchedIDs.includes(ID)) {
      setTouchedIds(touchedIDs.concat(ID))
      setTouched(touched + 1)
    }

    const newAnswers = {
      ...answers,
      [ID]: {
        correct: surface,
        users_answer: value,
        id,
      },
    }
    setAnswers(newAnswers)
  }

  const wordInput = (word) => {

    if (!word.id && !word.lemmas) return word.surface
    if (!word.id) {
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

    const usersAnswer = answers[word.ID] ? answers[word.ID].users_answer : ''

    if (word.listen) {
      if (!audio.includes(word.ID.toString())) {
        audio.push(word.ID.toString()) // SUPER DANGEROUS
      }
      return (
        <ExerciseHearing
          tabIndex={word.ID}
          handleChange={handleAnswerChange}
          handleClick={textToSpeech}
          value={usersAnswer}
          key={word.ID}
          word={word}
        />
      )
    }
    if (word.choices) {
      return (
        <ExerciseMultipleChoice
          tabIndex={word.ID}
          handleChange={handleMultiselectChange}
          key={word.ID}
          value={usersAnswer}
          word={word}
        />
      )
    }
    return (
      <ExerciseCloze
        tabIndex={word.ID}
        handleChange={handleAnswerChange}
        handleClick={textToSpeech}
        key={word.ID}
        value={usersAnswer}
        word={word}
      />
    )
  }

  const continueToNextSnippet = () => {
    setAnswers({})
    setOptions({})
    setTouched(0)
    setAttempts(0)
    dispatch(getCurrentSnippet(storyId))
  }

  const skipThisPart = () => {
    setAnswers({})
    setOptions({})
    setTouched(0)
    setAttempts(0)
    const currentSnippetId = snippets.focused.snippetid[0]
    dispatch(getNextSnippet(storyId, currentSnippetId))
  }

  if (!snippets.focused || snippets.pending) return null

  const { practice_snippet: practice } = snippets.focused

  return (
    <>
      <h1>
        {`${snippets.focused.snippetid[0] + 1}/${snippets.totalnum}`}
        <ResetButton style={{ float: 'right' }} storyId={storyId} />
      </h1>
      <PreviousSnippet snippet={snippets.previous} />

      <Segment style={{ marginBottom: '5px', wordSpacing: '1px', lineHeight: '2em' }}>
        {practice.map(exercise => wordInput(exercise))}
      </Segment>

      {exerciseCount === 0 ?
        <Button fluid onClick={continueToNextSnippet}>Continue to next snippet</Button>
        : (touched >= Math.ceil(exerciseCount / 2)
          ? <Button fluid onClick={() => checkAnswers()}>{`Check answers ${attempt}/2 attemps used`}</Button>
          : <Button fluid onClick={() => skipThisPart()}>Skip this part</Button>
        )
      }
    </>
  )
}


export default CurrentPractice
