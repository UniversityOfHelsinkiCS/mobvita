import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  dictionaryLanguageSelector,
  learningLanguageSelector,
  voiceLanguages,
  speak,
  formatGreenFeedbackText,
} from 'Utilities/common'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import Tooltip from 'Components/PracticeView/Tooltip'

const RightAnswer = ({ word }) => {
  const { surface, lemmas, ID: wordId, id: storyId, inflection_ref: inflectionRef } = word

  const autoSpeak = useSelector(({ user }) => user.data.user.auto_speak)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const learningLanguage = useSelector(learningLanguageSelector)

  const [show, setShow] = useState(false)

  const dispatch = useDispatch()

  const voice = voiceLanguages[learningLanguage]

  const handleClick = () => {
    setShow(true)
    if (autoSpeak === 'always' && voice) speak(surface, voice, 'dictionary')
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
  }

  const tooltip = (
    <div className="tooltip-green">
      <div>
        <span dangerouslySetInnerHTML={formatGreenFeedbackText(word?.message)} />
      </div>
    </div>
  )

  return (
    <Tooltip placement="top" tooltipShown={show && word.message} trigger="none" tooltip={tooltip}>
      <span
        className="word-interactice right-text"
        role="button"
        onClick={handleClick}
        onKeyDown={handleClick}
        tabIndex={-1}
        onBlur={() => setShow(false)}
      >
        {surface}
      </span>
    </Tooltip>
  )
}

export default RightAnswer
