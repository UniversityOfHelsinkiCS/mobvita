import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import {
  getTextStyle,
  learningLanguageSelector,
  dictionaryLanguageSelector,
  speak,
  voiceLanguages,
  formatGreenFeedbackText,
  learningLanguageLocaleCodes,
  useMTAvailableLanguage
} from 'Utilities/common'
import { setReferences, setExplanation } from 'Utilities/redux/practiceReducer'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import { getContextTranslation } from 'Utilities/redux/contextTranslationReducer'
import Tooltip from 'Components/PracticeView/Tooltip'

const PreviousExerciseWord = ({ word, answer, tiedAnswer, snippet }) => {
  const {
    surface,
    isWrong,
    tested,
    wrong,
    lemmas,
    translation_lemmas,
    bases,
    ID: wordId,
    id: storyId,
    inflection_ref: inflectionRef,
    sentence_id,
    snippet_id,
  } = word
  const ref = word.hints && word.hints.filter(
    hint => hint.ref?.length).reduce((obj, v) => ({ ...obj, [v.keyword || v.easy]: v.ref}), {}) 
  const explanation = word.hints && word.hints.filter(
    hint => hint.explanation?.length || hint.meta !== hint.easy).reduce((obj, v) => ({ 
      ...obj, 
      [v.keyword || v.easy]: v.easy === v.meta && v.explanation || [v.meta, ...(v.explanation || [])]}), {})
  const {focused: story} = useSelector(({ stories }) => stories)
  const [show, setShow] = useState(false)

  const learningLanguage = useSelector(learningLanguageSelector)
  const mtLanguages = useMTAvailableLanguage()
  const { resource_usage, autoSpeak } = useSelector(state => state.user.data.user)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)

  const intl = useIntl()
  const dispatch = useDispatch()

  const voice = voiceLanguages[learningLanguage]
  let color = ''
  if (tested || typeof wrong !== 'undefined') color = isWrong ? 'wrong-text' : 'right-text'
  const wordClass = `word-interactive ${color}`

  const handleClick = () => {
    if (word.isWrong || word.mc_correct) setShow(true)
    if (autoSpeak === 'always' && voice) speak(surface, voice, 'dictionary', resource_usage)
    if (lemmas) {
      const prefLemma = word.pref_lemma
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
          prefLemma,
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

  const handleTooltipClick = () => {
    if (ref && Object.keys(ref).length) dispatch(setReferences(ref))
    if (explanation && Object.keys(explanation).length) dispatch(setExplanation(explanation))
  }

  const youAnsweredTooltip = answer || tiedAnswer

  const tooltip = (
    <div className="tooltip-green" style={{ cursor: 'pointer' }} onMouseDown={handleTooltipClick}>
      {word.message && (
        <div className="flex">
          <span dangerouslySetInnerHTML={formatGreenFeedbackText(word?.message.easy)} />{' '}
          {ref && Object.keys(ref).length && (
            <Icon name="info circle" style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }} />
          )}
          {explanation && Object.keys(explanation).length && (
            <Icon name="info circle" style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }} />
          )}
        </div>
      )}
      {word?.mc_correct && (
        <div style={{ textAlign: 'left', padding: '15px' }}>
          <span dangerouslySetInnerHTML={formatGreenFeedbackText(word.frozen_messages[0])} />
          <ul>
            {word.choices.map((choice, i) => (
              <li key={i}>
                <span dangerouslySetInnerHTML={formatGreenFeedbackText(choice)} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {youAnsweredTooltip && (
        <div>
          {`${intl.formatMessage({ id: 'you-used' })}: `}
          <span dangerouslySetInnerHTML={formatGreenFeedbackText(youAnsweredTooltip.users_answer)}  
          style={getTextStyle(learningLanguage, 'tooltip')} />
        </div>
      )}
    </div>
  )

  return (
    <Tooltip placement="top" tooltipShown={show} trigger="none" tooltip={tooltip}>
      <span
        className={wordClass}
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

export default PreviousExerciseWord
