import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import {
  getTextStyle,
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

const RightAnswer = ({ word, snippet }) => {
  const { 
    surface, 
    lemmas, 
    translation_lemmas, 
    bases,
    ID: wordId, 
    id: storyId, 
    inflection_ref: inflectionRef,
    snippet_id,
    sentence_id,
    mc_correct,
    wrong,
    choices,
  } = word
  const { resource_usage, autoSpeak } = useSelector(state => state.user.data.user)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const learningLanguage = useSelector(learningLanguageSelector)
  const mtLanguages = useMTAvailableLanguage()
  const [show, setShow] = useState(false)

  const intl = useIntl()
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
          bases,
          dictionaryLanguage,
          storyId,
          wordId,
          inflectionRef,
        })
      )
      if (mtLanguages.includes([learningLanguage, dictionaryLanguage].join('-'))) {
        const sentence = snippet.filter(
          s => sentence_id - 1 <= s.sentence_id && s.sentence_id <= sentence_id + 1).map(t=>t.surface).join('').replaceAll('\n', ' ').trim()
        dispatch(
          getContextTranslation(sentence,
            learningLanguageLocaleCodes[learningLanguage],
            learningLanguageLocaleCodes[dictionaryLanguage])
        )
      }
    }
  }

  const tooltip = (
    <div className="tooltip-green" style={{ textAlign: 'left', padding: '15px' }}>
      {mc_correct && choices && (
        <div>
          <div>
            <span dangerouslySetInnerHTML={formatGreenFeedbackText(word.frozen_messages[0])} />
            <ul>
              {choices.map((choice, i) => (
                <li key={i}>
                  <span dangerouslySetInnerHTML={formatGreenFeedbackText(choice)} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            {`${intl.formatMessage({ id: 'you-used' })}: `}
            <span dangerouslySetInnerHTML={formatGreenFeedbackText(wrong)} style={getTextStyle(learningLanguage, 'tooltip')}/>
          </div>
        </div>
      ) || (
        <div>
          <span dangerouslySetInnerHTML={formatGreenFeedbackText(word?.message?.easy)} />
        </div>
      )}
    </div>
  )

  return (
    <Tooltip placement="top" tooltipShown={show && (word.message || mc_correct)} trigger="none" tooltip={tooltip}>
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
