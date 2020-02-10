import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Loader } from 'semantic-ui-react'
import { getCurrentSnippet, getNextSnippet, postAnswers, setTotalNumberAction } from 'Utilities/redux/snippetsReducer'
import { getTranslationAction, clearTranslationAction } from 'Utilities/redux/translationReducer'
import { capitalize, learningLanguageSelector } from 'Utilities/common'

import PreviousSnippets from 'Components/PracticeView/PreviousSnippets'
import ExerciseCloze from 'Components/PracticeView/ExerciseCloze'
import ExerciseMultipleChoice from 'Components/PracticeView/ExerciseMultipleChoice'
import ExerciseHearing from 'Components/PracticeView/ExerciseHearing'
import { FormattedMessage } from 'react-intl'
import { getSelf } from 'Utilities/redux/userReducer'
import { Button } from 'react-bootstrap'


const CurrentPractice = ({ storyId }) => {
  const [answers, setAnswers] = useState({})
  const [options, setOptions] = useState({})
  const [audio, setAudio] = useState([])
  const [touchedIDs, setTouchedIds] = useState([])
  const [touched, setTouched] = useState(0)
  const [attempt, setAttempts] = useState(0)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(({ user }) => user.data.user.last_trans_language)
  const [exerciseCount, setExerciseCount] = useState(0)
  const scrollTarget = useRef(null)

  const dispatch = useDispatch()

  const { snippets } = useSelector(({ snippets, locale }) => ({ snippets, locale }))
  const { story } = useSelector(({ stories }) => ({ story: stories.focused }))


  useEffect(() => {
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

  const setInitialAnswers = () => {
    if (snippets.focused) {
      const filteredSnippet = snippets.focused.practice_snippet.filter(word => word.id)
      const initialAnswers = filteredSnippet.reduce((answerObject, currentWord) => {
        const { surface, id, ID, base, bases, listen, choices, concept } = currentWord
        if (answers[ID]) return { ...answerObject, [ID]: answers[ID] }
        const newAnswerObject = {
          ...answerObject,
          [ID]: {
            correct: surface,
            users_answer: (listen || choices) ? '' : (base || bases),
            id,
            concept,
          },
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

    if (scrollTarget.current) {
      window.scrollTo(0, scrollTarget.current.offsetTop)
    }
  }, [snippets])

  useEffect(() => {
    if (snippets.focused && snippets.focused.skip_second) {
      setAnswers({})
      setOptions({})
      setTouched(0)
      setAttempts(0)
      dispatch(getNextSnippet(storyId))
    }
    dispatch(getSelf())
  }, [snippets.focused])

  const checkAnswers = async () => {
    const { starttime, snippetid } = snippets.focused

    const answersObj = {
      starttime,
      story_id: storyId,
      snippet_id: [snippetid[0]],
      touched,
      untouched: exerciseCount - touched,
      attempt,
      options,
      audio,
      answers,
    }

    setAttempts(attempt + 1)
    dispatch(postAnswers(storyId, answersObj))
  }

  const textToSpeech = (surfaceWord, wordLemmas) => {
    // const selectedLocale = localeOptions.find(localeOption => localeOption.code === locale)
    window.responsiveVoice.speak(surfaceWord, `${learningLanguage === 'german' ? 'Deutsch' : capitalize(learningLanguage)} Female`)
    if (wordLemmas) {
      dispatch(getTranslationAction(capitalize(learningLanguage), wordLemmas, capitalize(dictionaryLanguage)))
    }
  }

  const handleAnswerChange = (e, word) => {
    const { surface, id, ID, concept } = word

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
        concept,
      },
    }
    setAnswers(newAnswers)
  }

  const handleMultiselectChange = (event, word, data) => {
    const { id, ID, surface, concept } = word
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
        concept,
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
          className={!word.base && answers[word.ID] ? 'word-interactive--exercise' : 'word-interactive '}
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
        setAudio(audio.concat(word.ID.toString()))
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

  const handleCheckButton = () => {
    if (exerciseCount === 0) {
      continueToNextSnippet()
    } else if (touched < Math.ceil(exerciseCount / 2)) {
      skipThisPart()
    } else {
      checkAnswers()
    }
  }

  if (!snippets.focused || snippets.pending) {
    return (
      <div>
        <Loader active />
      </div>
    )
  }

  const { practice_snippet: practice } = snippets.focused
  return (
    <>
      <h3>
        {`${story.title} Part ${snippets.focused.snippetid[0] + 1}/${snippets.totalnum}`}
      </h3>
      {story.url ? <p><a href={story.url}><FormattedMessage id="Source" /></a></p> : null}

      <PreviousSnippets snippets={snippets.previous.filter(Boolean)} textToSpeech={textToSpeech} />
      <hr />
      <div
        ref={scrollTarget}
        className="practice-container"
        data-cy="practice-view"
      >
        {practice.map(exercise => wordInput(exercise))}
      </div>

      <Button
        data-cy="check-answer"
        block
        variant="primary"
        onClick={() => handleCheckButton()}
      >
        <FormattedMessage id="check-answer" />
      </Button>
    </>
  )
}


export default CurrentPractice
