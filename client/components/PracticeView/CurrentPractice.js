import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getCurrentSnippet, getNextSnippet, postAnswers, setTotalNumberAction } from 'Utilities/redux/snippetsReducer'
import { getTranslationAction, clearTranslationAction } from 'Utilities/redux/translationReducer'
import { capitalize, learningLanguageSelector, translatableLanguages } from 'Utilities/common'

import PreviousSnippets from 'Components/PracticeView/PreviousSnippets'
import ExerciseCloze from 'Components/PracticeView/ExerciseCloze'
import ExerciseMultipleChoice from 'Components/PracticeView/ExerciseMultipleChoice'
import ExerciseHearing from 'Components/PracticeView/ExerciseHearing'
import { FormattedMessage } from 'react-intl'
import { getSelf } from 'Utilities/redux/userReducer'
import { Button } from 'react-bootstrap'
import Chunks from './Chunks'


const CurrentPractice = ({ storyId }) => {
  const [answers, setAnswers] = useState({})
  const [options, setOptions] = useState({})
  const [progress, setProgress] = useState(0)
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

  const [finished, setFinished] = useState(false)

  let snippetProgress = ''
  if (snippets.focused) {
    snippetProgress = finished ? snippets.focused.snippetid[0] + 1 : snippets.focused.snippetid[0]
  }

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

        let usersAnswer
        if (listen || choices) {
          usersAnswer = ''
        } else {
          usersAnswer = base || bases
        }

        // Checks if word to be shown is already correct and marks it touched.
        // (Only applies to cloze, other exercise types dont have default values set.)
        if (usersAnswer === surface) {
          setTouchedIds(touchedIDs.concat(ID))
          setTouched(touched + 1)
        }

        return {
          ...answerObject,
          [ID]: {
            correct: surface,
            users_answer: usersAnswer,
            id,
            concept,
          },
        }
      }, {})
      if (Object.keys(initialAnswers).length > 0) setAnswers({ ...answers, ...initialAnswers }) // Append, dont replace
      setExerciseCount(getExerciseCount())
    }
  }

  useEffect(setInitialAnswers, [snippets.focused])

  useEffect(() => {
    if (snippets.focused) {
      setProgress(snippetProgress / snippets.focused.total_num)
    }
  }, [snippets.focused])

  useEffect(() => {
    if (snippets.focused && snippets.focused.skip_second) {
      setOptions({})
      setTouched(0)
      setAttempts(0)
      const currentSnippetId = snippets.focused.snippetid[0]
      if (snippets.focused.total_num !== currentSnippetId + 1 || finished) {
        dispatch(getNextSnippet(storyId, currentSnippetId))
      } else {
        setFinished(true)
        setProgress(currentSnippetId + 1 / snippets.focused.total_num)
      }
    }
    dispatch(getSelf())
  }, [snippets.focused])

  useEffect(() => {
    if (scrollTarget.current && snippets.previous.length) {
      // window.scrollTo(0, scrollTarget.current.offsetTop)
      scrollTarget.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [snippets.previous])

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

  const startOver = async () => {
    await dispatch(getNextSnippet(storyId, snippets.focused.snippetid[0]))
    setFinished(false)
    setProgress(0)
  }

  const textToSpeech = (surfaceWord, wordLemmas, wordId) => {
    // const selectedLocale = localeOptions.find(localeOption => localeOption.code === locale)
    window.responsiveVoice.speak(surfaceWord, `${learningLanguage === 'german' ? 'Deutsch' : capitalize(learningLanguage)} Female`)
    if (wordLemmas) {
      const storyId = story.exercise_setting.story
      dispatch(
        getTranslationAction(
          capitalize(learningLanguage),
          wordLemmas,
          capitalize(dictionaryLanguage || translatableLanguages[learningLanguage][0]),
          storyId,
          wordId,
        ),
      )
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
          key={word.ID}
          className="word-interactive"
          onKeyDown={() => textToSpeech(word.surface, word.lemmas, word.ID)}
          onClick={() => textToSpeech(word.surface, word.lemmas, word.ID)}
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

  const chunkInput = (chunk) => {
    if (chunk.length === 1) {
      return wordInput(chunk[0])
    }
    const elements = chunk.map(word => wordInput(word))
    return <span className="chunk">{elements}</span>
  }

  return (
    <div className="component-container">
      <h3>{`${story.title}`}</h3>
      {story.url ? <p><a href={story.url}><FormattedMessage id="Source" /></a></p> : null}

      <PreviousSnippets textToSpeech={textToSpeech} answers={answers} />
      <hr />

      {!finished
        ? (
          <div>
            <div
              ref={scrollTarget}
              className="practice-container"
              data-cy="practice-view"
            >
              <Chunks chunkInput={chunkInput} />
            </div>
            <Button
              data-cy="check-answer"
              block
              variant="primary"
              onClick={() => checkAnswers()}
            >
              <FormattedMessage id="check-answer" />
            </Button>
          </div>
        )
        : (
          <Button variant="primary" block onClick={() => startOver()}>
            <FormattedMessage id="restart-story" />
          </Button>
        )}

      {
        snippets.focused && (
          <div style={{ height: '2.5em', marginTop: '0.5em', textAlign: 'center' }} className="progress">
            <span
              data-cy="snippet-progress"
              style={{ marginTop: '0.23em', fontSize: 'larger', position: 'absolute', right: 0, left: 0 }}
              className="progress-value"
            >{`${snippetProgress} / ${snippets.focused.total_num}`}
            </span>
            <div
              className="progress-bar progress-bar-striped bg-info"
              style={{ width: `${progress * 100}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        )
      }
    </div>
  )
}


export default CurrentPractice
