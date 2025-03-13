import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import {
  getTextWidth,
  dictionaryLanguageSelector,
  rightAlignedLanguages,
  learningLanguageSelector,
  getTextStyle,
  exerciseMaskedLanguages,
  voiceLanguages,
  speak,
  formatGreenFeedbackText,
  getWordColor,
  skillLevels,
  learningLanguageLocaleCodes,
  useMTAvailableLanguage,
  getMode,
  composeExerciseContext,
} from 'Utilities/common'
import {
  setFocusedWord,
  setReferences,
  setExplanation,
  incrementHintRequests,
  mcExerciseTouched,
} from 'Utilities/redux/practiceReducer'
// import { decreaseEloHearts } from 'Utilities/redux/snippetsReducer'
import { setCurrentContext } from 'Utilities/redux/chatbotReducer'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import { getContextTranslation } from 'Utilities/redux/contextTranslationReducer'
import { Icon, Popup} from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import Tooltip from 'Components/PracticeView/Tooltip'

const ExerciseCloze = ({ word, snippet, handleChange }) => {
  const [value, setValue] = useState('')
  const [className, setClassName] = useState('exercise')
  const [touched, setTouched] = useState(false)
  const [show, setShow] = useState(false)
  const storyId = useSelector(({ snippets }) => snippets.focused?.storyid)
  const { answersPending } = useSelector(({ snippets }) => snippets)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const learningLanguage = useSelector(learningLanguageSelector)
  const mtLanguages = useMTAvailableLanguage()
  const mode = getMode()
  const { resource_usage, autoSpeak, show_review_diff, show_preview_exer, grade } = useSelector(state => state.user.data.user)
  const currentAnswer = useSelector(
    ({ practice }) => practice.currentAnswers[`${word.ID}-${word.id}`]
  )
  const { attempt, focusedWord, latestMCTouched } = useSelector(({ practice }) => practice)
  const { currentWordId, currentSnippetId  } = useSelector(({ chatbot }) => chatbot)
  const isCurrentWord = currentWordId === word.ID && currentSnippetId === word.snippet_id;
  // const { eloHearts } = useSelector(({ snippets }) => snippets)
  const [keepOpen, setKeepOpen] = useState(false)
  const {
    isWrong,
    tested,
    surface,
    ref,
    explanation,
    lemmas,
    translation_lemmas,
    bases,
    ID: wordId,
    id,
    message,
    hints,
    requested_hints,
    frozen_messages,
    hint2penalty,
    sentence_id,
    snippet_id,
    inflection_ref: inflectionRef,
  } = word
  
  

  const target = useRef()
  const dispatch = useDispatch()
  
  const voice = voiceLanguages[learningLanguage]
  

  const handleTooltipWordClick = () => {
    const showAsSurface = exerciseMaskedLanguages.includes(learningLanguage)
      ? word.surface
      : word.base || word.bases
    const maskSymbol = exerciseMaskedLanguages.includes(learningLanguage)
      ? word.base || word.bases
      : null
    if (autoSpeak === 'always' && voice) speak(surface, voice, 'dictionary', resource_usage)
    if (lemmas) {
      const prefLemma = word.pref_lemma
      dispatch(setWords({ surface: showAsSurface, lemmas, maskSymbol }))
      dispatch(
        getTranslationAction({
          learningLanguage,
          wordLemmas: translation_lemmas || lemmas,
          bases,
          dictionaryLanguage,
          storyId,
          wordId,
          inflectionRef,
          prefLemma,
        })
      )
      if (mtLanguages.includes([learningLanguage, dictionaryLanguage].join('-'))) {
        const sentence = snippet.filter(
          s => sentence_id - 1 < s.sentence_id && s.sentence_id < sentence_id + 1).map(t=>t.surface).join('').replaceAll('\n', ' ').trim()
        dispatch(
          getContextTranslation(sentence,
            learningLanguageLocaleCodes[learningLanguage],
            learningLanguageLocaleCodes[dictionaryLanguage])
        )
      }
    }
  }

  const changeValue = e => {
    setValue(e.target.value)
  }
  

  const getExerciseClass = (tested, isWrong) => {
    if (!tested) return 'exercise'
    if (isWrong) return 'exercise wrong cloze'
    return 'exercise correct'
  }

  useEffect(() => {
    const val = currentAnswer ? currentAnswer.users_answer : ''
    setValue(val)
  }, [currentAnswer])

  useEffect(() => {
    setClassName(getExerciseClass(tested, isWrong))
  }, [tested])

  

  useEffect(() => {
    if (focusedWord !== word) {
      setShow(false)
    }
  }, [focusedWord])

  useEffect(() => {
    if (latestMCTouched && latestMCTouched !== word) {
      setShow(false)
    }
  }, [latestMCTouched])


  const tooltip = (
    <div>
      {
        frozen_messages?.length>0 && (<div className="tooltip-hint" style={{ textAlign: 'left' }}>
        <ul style={{paddingLeft: '20px'}}>
          {frozen_messages.map((mess, index) => (
            <span key={index} className="flex">
              <li
                style={{ fontWeight: 'bold', fontStyle: 'italic' }}
                dangerouslySetInnerHTML={formatGreenFeedbackText(mess)}
              />
            </span>
          ))}
        </ul>
        </div>)
      }
      <div className='tooltip-hint' style={{ display: 'flex', justifyContent: 'center' }}>
        <FormattedMessage id="click-to-see-translation" />
      </div>
      <div className="tooltip-hint" style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="primary"
          onMouseDown={handleTooltipWordClick}
          onClick={handleTooltipWordClick}
        >
          <span style={getTextStyle(learningLanguage, 'tooltip')}>{word.base || word.bases} </span>
          → <FormattedMessage id={dictionaryLanguage} />
        </Button>
      </div>
    </div>
  )

  // Font is changed to 16px and back to disable iOS safari zoom in effect
  const changeElementFont = (element, size = '') => {
    element.style.fontSize = size
  }

  const handleBlur = () => {
    handleChange(value, word)

    if (!keepOpen) {
      setShow(false)
    }
    setKeepOpen(false)
  }

  const handleFocus = e => {
    if (!touched) {
      setTouched(true)
      if (!tested) setClassName('exercise')
      handleChange(value, word)
    }
    setShow(!show)
    dispatch(setFocusedWord(word))
    changeElementFont(e.target)
    dispatch(setCurrentContext(composeExerciseContext(snippet, word)))
  }

  const handleMouseDown = e => {
    changeElementFont(e.target, '16px')
  }

  const focusNextClozeOrHearing = element => {
    const { form } = element
    const nextElement = form.elements[Array.prototype.indexOf.call(form, element) + 1]
    const isNextElementInput = nextElement.className.includes('exercize')
    if (isNextElementInput) changeElementFont(nextElement, '16px')
    nextElement.focus()
  }

  const handleKeyDown = e => {
    const isEnterPressed = e.keyCode === 13
    if (isEnterPressed) {
      focusNextClozeOrHearing(e.target)
      e.preventDefault()
    }
  }

  const direction = rightAlignedLanguages.includes(learningLanguage) ? 'bidi-override' : ''

  return (
    <Tooltip
      placement="top"
      trigger="none"
      onVisibilityChange={setShow}
      tooltipShown={show}
      closeOnOutOfBoundaries
      tooltip={tooltip}
      additionalClassnames="clickable"
    >
      <input
        onKeyDown={handleKeyDown}
        ref={target}
        data-cy={!answersPending && "exercise-cloze" || "exercise-cloze-pending"}
        autoCapitalize="off"
        readOnly={tested && !isWrong || answersPending}
        key={word.ID}
        name={word.ID}
        placeholder={`${word.base || word.bases}`}
        value={value}
        onChange={changeValue}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onClick={() => dispatch(mcExerciseTouched(null))}
        onFocus={handleFocus}
        className={className}
        style={{
          width: word.surface?.length > word.base?.length ? getTextWidth(word.surface) : getTextWidth(word.base),
          backgroundColor: getWordColor(
            word.level,
            grade,
            skillLevels,
            show_review_diff,
            show_preview_exer,
            mode
          ),
          marginRight: '2px',
          height: '1.5em',
          lineHeight: 'normal',
          unicodeBidi: direction,
          border: isCurrentWord ? '2px solid green' : '1px solid rgb(211, 211, 211)',
        }}
      />
      {false && word.negation && <sup style={{ color: '#0000FF' }}>(neg)</sup>}
    </Tooltip>
  )
}

export default ExerciseCloze
