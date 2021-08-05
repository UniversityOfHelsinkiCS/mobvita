import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import {
  getTextStyle,
  learningLanguageSelector,
  dictionaryLanguageSelector,
  speak,
  respVoiceLanguages,
  formatGreenFeedbackText,
} from 'Utilities/common'
import { setReferences } from 'Utilities/redux/practiceReducer'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import { setFocusedWord, setHighlightedWord } from 'Utilities/redux/annotationsReducer'
import Tooltip from 'Components/PracticeView/Tooltip'

const PreviousExerciseWord = ({ word, answer, tiedAnswer }) => {
  const {
    surface,
    isWrong,
    tested,
    lemmas,
    ref,
    ID: wordId,
    id: storyId,
    inflection_ref: inflectionRef,
  } = word

  const [show, setShow] = useState(false)

  const learningLanguage = useSelector(learningLanguageSelector)
  const autoSpeak = useSelector(({ user }) => user.data.user.auto_speak)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { highlightedWord, annotations } = useSelector(({ annotations }) => annotations)

  const intl = useIntl()
  const dispatch = useDispatch()

  const voice = respVoiceLanguages[learningLanguage]
  let color = ''
  if (tested) color = isWrong ? 'wrong-text' : 'right-text'
  const wordClass = `word-interactive ${color}`

  const wordHasAnnotations = word => {
    const matchingAnnotationInStore = annotations.find(w => w.ID === word.ID)
    const allAreRemoved = matchingAnnotationInStore?.annotation?.every(
      annotation => annotation.annotation === '<removed>'
    )
    if (!matchingAnnotationInStore || allAreRemoved) return false

    return true
  }

  const handleClick = () => {
    setShow(true)
    if (autoSpeak === 'always' && voice) speak(surface, voice)
    if (lemmas) {
      dispatch(setWords({ surface, lemmas }))
      dispatch(
        getTranslationAction({
          learningLanguage,
          wordLemmas: lemmas,
          dictionaryLanguage,
          storyId,
          wordId,
          inflectionRef,
        })
      )
    }
    dispatch(setHighlightedWord(word))
    const annotationInStore = annotations.find(w => w.ID === word.ID)
    if (annotationInStore) dispatch(setFocusedWord(annotationInStore))
    else dispatch(setFocusedWord(word))
  }

  const getSuperscript = word => {
    const existingAnnotations = annotations.filter(word =>
      word.annotation.every(annotation => annotation.annotation !== '<removed>')
    )
    return existingAnnotations.findIndex(a => a.ID === word.ID) + 1
  }

  const handleTooltipClick = () => {
    if (ref) dispatch(setReferences(ref))
  }

  const youAnsweredTooltip = answer || tiedAnswer

  const tooltip = (
    <div className="tooltip-green" style={{ cursor: 'pointer' }} onMouseDown={handleTooltipClick}>
      {word.message && (
        <div className="flex">
          <span dangerouslySetInnerHTML={formatGreenFeedbackText(word?.message)} />{' '}
          {ref && (
            <Icon
              name="external"
              size="small"
              style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }}
            />
          )}
        </div>
      )}
      {youAnsweredTooltip && (
        <div>
          {`${intl.formatMessage({ id: 'you-used' })}: `}
          <span style={getTextStyle(learningLanguage, 'tooltip')}>
            {youAnsweredTooltip.users_answer}
          </span>
        </div>
      )}
    </div>
  )

  return (
    <Tooltip placement="top" tooltipShown={show} trigger="none" tooltip={tooltip}>
      <span
        className={`${wordClass} ${word.ID === highlightedWord?.ID && 'notes-highlighted-word'}`}
        role="button"
        onClick={handleClick}
        onKeyDown={handleClick}
        tabIndex={-1}
        onBlur={() => setShow(false)}
      >
        {surface}
      </span>
      {wordHasAnnotations(word) && <sup className="notes-superscript">{getSuperscript(word)}</sup>}
    </Tooltip>
  )
}

export default PreviousExerciseWord
