import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  dictionaryLanguageSelector,
  learningLanguageSelector,
  voiceLanguages,
  speak,
  formatGreenFeedbackText,
  learningLanguageLocaleCodes,
  useMTAvailableLanguage
} from 'Utilities/common'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import { getContextTranslation } from 'Utilities/redux/contextTranslationReducer'
import Tooltip from 'Components/PracticeView/Tooltip'

const RightAnswer = ({ word }) => {
  const { 
    surface, 
    lemmas, 
    translation_lemmas, 
    ID: wordId, 
    id: storyId, 
    inflection_ref: inflectionRef,
    snippet_id,
    sentence_id,
  } = word
  const {focused: story} = useSelector(({ stories }) => stories)
  const { resource_usage, autoSpeak } = useSelector(state => state.user.data.user)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const learningLanguage = useSelector(learningLanguageSelector)
  const mtLanguages = useMTAvailableLanguage()
  const [show, setShow] = useState(false)

  const dispatch = useDispatch()

  const voice = voiceLanguages[learningLanguage]

  const handleClick = () => {
    setShow(true)
    if (autoSpeak === 'always' && voice) speak(surface, voice, 'dictionary', resource_usage)
    if (lemmas) {
      dispatch(setWords({ surface, lemmas }))
      dispatch(
        getTranslationAction({
          learningLanguage,
          wordLemmas: translation_lemmas || lemmas,
          dictionaryLanguage,
          storyId,
          wordId,
          inflectionRef,
        })
      )
      if (mtLanguages.includes([learningLanguage, dictionaryLanguage].join('-'))) {
        const sentence = story.paragraph[snippet_id].filter(
          s => sentence_id - 1 < s.sentence_id < sentence_id + 1).map(t=>t.surface).join('').replaceAll('\n', ' ').trim()
        dispatch(
          getContextTranslation(sentence,
            learningLanguageLocaleCodes[learningLanguage],
            learningLanguageLocaleCodes[dictionaryLanguage])
        )
      }
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
