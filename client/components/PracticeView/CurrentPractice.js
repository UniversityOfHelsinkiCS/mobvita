import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getCurrentSnippet, getNextSnippet, postAnswers, resetCurrentSnippet } from 'Utilities/redux/snippetsReducer'
import { getTranslationAction, clearTranslationAction } from 'Utilities/redux/translationReducer'
import { capitalize, learningLanguageSelector, translatableLanguages, newCapitalize } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import Keyboard from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'

import PreviousSnippets from 'Components/PracticeView/PreviousSnippets'
import { FormattedMessage } from 'react-intl'
import { getSelf } from 'Utilities/redux/userReducer'
import { Button, Spinner } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { setAnswers, clearAnswers, clearCurrentSnippetAnswers } from 'Utilities/redux/practiceReducer'
import { RUSphonetic, RUSauthentic } from './KeyboardLayouts'
import Chunks from './Chunks'


const CurrentPractice = ({ storyId }) => {
  // const [answers, setAnswers] = useState({})
  const { answers, currentSnippetAnswers, focusedWord } = useSelector(({ practice }) => practice)
  const [options, setOptions] = useState({})
  const [progress, setProgress] = useState(0)
  const [audio, setAudio] = useState([])
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [keyboard, setKeyboard] = useState(null)
  const [keyboardLayout, setKeyboardLayout] = useState(RUSauthentic)
  const [layoutName, setLayoutName] = useState('default')
  const [shift, setShift] = useState(false)

  const [touchedIDs, setTouchedIds] = useState([])
  const [touched, setTouched] = useState(0)
  const [attempt, setAttempts] = useState(0)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(({ user }) => user.data.user.last_trans_language)
  const [exerciseCount, setExerciseCount] = useState(0)
  const scrollTarget = useRef(null)

  const smallWindow = useWindowDimensions().width < 500

  const dispatch = useDispatch()

  const { snippets } = useSelector(({ snippets }) => ({ snippets }))
  const { story } = useSelector(({ stories }) => ({ story: stories.focused }))
  const answersPending = useSelector(({ snippets }) => snippets.answersPending)
  const currentSnippetId = useSelector(({ snippets }) => {
    if (!snippets.focused) return -1

    const { snippetid } = snippets.focused
    return snippetid[snippetid.length - 1]
  })

  const [finished, setFinished] = useState(false)

  let snippetProgress = ''
  if (snippets.focused) {
    snippetProgress = finished ? currentSnippetId + 1 : currentSnippetId
  }

  useEffect(() => {
    dispatch(clearAnswers())
  }, [])

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
    if (snippets.focused && snippets.focused.storyid === storyId) {
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
      dispatch(clearCurrentSnippetAnswers())
      if (Object.keys(initialAnswers).length > 0) dispatch(setAnswers({ ...initialAnswers })) // Append, dont replace
      setExerciseCount(getExerciseCount())
    }
  }

  useEffect(() => {
    if (!keyboard || !answers[focusedWord.ID]) return
    keyboard.setInput(answers[focusedWord.ID].users_answer)
  }, [focusedWord, keyboard])

  useEffect(() => {
    setInitialAnswers()
  }, [snippets.focused])

  useEffect(() => {
    if (!answersPending) dispatch(getSelf())
  }, [answersPending])

  useEffect(() => {
    if (snippets.focused) {
      setProgress(snippetProgress / snippets.focused.total_num)
    }
  }, [snippets.focused])

  useEffect(() => {
    if (snippets.focused && snippets.focused.skip_second) {
      setOptions({})
      setTouched(0)
      setTouchedIds([])
      setAttempts(0)

      if (snippets.focused.total_num !== currentSnippetId + 1 || finished) {
        dispatch(getNextSnippet(storyId, currentSnippetId))
      } else {
        setFinished(true)
        setProgress(currentSnippetId + 1 / snippets.focused.total_num)
      }
    }
  }, [snippets.focused])

  useEffect(() => {
    if (!snippets.pending && scrollTarget.current && snippets.previous.length) {
      scrollTarget.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [snippets.pending, answers])

  const checkAnswers = async () => {
    const { starttime, snippetid } = snippets.focused

    const answersObj = {
      starttime,
      story_id: storyId,
      snippet_id: snippetid,
      touched,
      untouched: exerciseCount - touched,
      attempt,
      options,
      audio,
      answers: currentSnippetAnswers,
    }

    setAttempts(attempt + 1)
    dispatch(postAnswers(storyId, answersObj))
  }

  const startOver = async () => {
    dispatch(clearAnswers())
    await dispatch(getNextSnippet(storyId, currentSnippetId))
    setFinished(false)
    setProgress(0)
  }

  const textToSpeech = (surfaceWord, wordLemmas, wordId) => {
    // const selectedLocale = localeOptions.find(localeOption => localeOption.code === locale)
    try {
      window.responsiveVoice.speak(surfaceWord, `${learningLanguage === 'german' ? 'Deutsch' : capitalize(learningLanguage)} Female`)
    } catch (e) {
      console.log(`Failed to speak ${surfaceWord} in ${capitalize(learningLanguage)}`)
    }
    if (wordLemmas) {
      dispatch(
        getTranslationAction(
          newCapitalize(learningLanguage),
          wordLemmas,
          capitalize(dictionaryLanguage) || translatableLanguages[learningLanguage][0],
          storyId,
          wordId,
        ),
      )
    }
  }

  const handleRestart = () => {
    setOptions({})
    setTouched(0)
    setAttempts(0)
    dispatch(clearAnswers())
    dispatch(resetCurrentSnippet(storyId))
  }

  const handleKeyPress = (key) => {
    const layout = layoutName === 'default' ? 'shift' : 'default'

    if (key === '{capslock}') {
      setLayoutName(layout)
    } else if (key === '{shift}') {
      setShift(true)
      setLayoutName(layout)
    } else if (shift) {
      setShift(false)
      setLayoutName(layout)
    }
  }

  const handleAnswerChange = (value, word = focusedWord) => {
    const { surface, id, ID, concept } = word

    if (!touchedIDs.includes(ID)) {
      setTouchedIds(touchedIDs.concat(ID))
      setTouched(touched + 1)
    }

    const newAnswer = {
      [ID]: {
        correct: surface,
        users_answer: value,
        id,
        concept,
      },
    }
    dispatch(setAnswers(newAnswer))
  }

  const handleInputChange = (value, word) => {
    if (keyboard) keyboard.setInput(value)
    handleAnswerChange(value, word)
  }

  const handleMultiselectChange = (event, word, data) => {
    const { id, ID, surface, concept } = word
    const { value } = data

    if (!touchedIDs.includes(ID)) {
      setTouchedIds(touchedIDs.concat(ID))
      setTouched(touched + 1)
    }

    const newAnswer = {
      [ID]: {
        correct: surface,
        users_answer: value,
        id,
        concept,
      },
    }
    dispatch(setAnswers(newAnswer))
  }

  return (
    <div className="component-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <h3>{`${story.title}`}</h3>
        <Icon
          data-cy="restart-story"
          style={{ cursor: 'pointer' }}
          name="redo"
          onClick={handleRestart}
        />
      </div>
      {story.url ? <p><a href={story.url}><FormattedMessage id="Source" /></a></p> : null}

      <PreviousSnippets textToSpeech={textToSpeech} answers={answers} />
      <hr />

      {!finished
        ? (
          <div style={{ width: '100%' }}>
            <div
              ref={scrollTarget}
              className="practice-container"
              data-cy="practice-view"
            >
              <Chunks
                textToSpeech={textToSpeech}
                audio={audio}
                setAudio={setAudio}
                handleAnswerChange={handleInputChange}
                handleMultiselectChange={handleMultiselectChange}
              />
            </div>
            <Button
              data-cy="check-answer"
              block
              variant="primary"
              disabled={answersPending || snippets.pending}
              onClick={() => checkAnswers()}
            >
              <div className="spinner-container">
                {answersPending ? <Spinner animation="border" variant="dark" size="lg" />
                  : <FormattedMessage id="check-answer" />}

              </div>

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
      {learningLanguage === 'Russian' && !smallWindow
        && (
          <>
            <Icon
              data-cy="onscreen-keyboard"
              style={{ cursor: 'pointer' }}
              name="keyboard"
              size="big"
              onClick={() => setShowKeyboard(!showKeyboard)}
            />
            {showKeyboard && (
              <>
                <Button onClick={() => setKeyboardLayout(RUSauthentic)}>ru-йцуке</Button>
                <Button onClick={() => setKeyboardLayout(RUSphonetic)}>ru-яверт</Button>
                <Keyboard
                  keyboardRef={k => setKeyboard(k)}
                  layout={keyboardLayout}
                  layoutName={layoutName}
                  inputName={focusedWord.ID}
                  onChange={handleAnswerChange}
                  onKeyPress={handleKeyPress}
                />
              </>
            )}
          </>
        )}
    </div>
  )
}


export default CurrentPractice
