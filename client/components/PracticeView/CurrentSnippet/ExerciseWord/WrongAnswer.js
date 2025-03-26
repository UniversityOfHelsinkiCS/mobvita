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
import { setReferences } from 'Utilities/redux/practiceReducer'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import { getContextTranslation } from 'Utilities/redux/contextTranslationReducer'
import Tooltip from 'Components/PracticeView/Tooltip'

const WrongAnswer = ({ word, snippet }) => {
  const { 
    surface, 
    translation_lemmas, 
    bases,
    lemmas, 
    ID: wordId, 
    id: storyId, 
    inflection_ref: inflectionRef,
    sentence_id
  } = word
  const ref = word.hints && word.hints.filter(
    hint => hint.ref?.length).reduce((obj, v) => ({ ...obj, [v.keyword || v.easy]: v.ref}), {}) 
  const answer = useSelector(({ practice }) => practice.currentAnswers[word.tiedTo || word.ID])

  const [show, setShow] = useState(false)

  const learningLanguage = useSelector(learningLanguageSelector)
  const { resource_usage, autoSpeak } = useSelector(state => state.user.data.user)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const mtLanguages = useMTAvailableLanguage()

  const intl = useIntl()
  const dispatch = useDispatch()

  const voice = voiceLanguages[learningLanguage]

  const wordClass = 'word-interactive wrong-text'

  const handleClick = () => {
    setShow(true)
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
  }

  const tooltip = (
    <div className="tooltip-green" style={{ cursor: 'pointer' }} onMouseDown={handleTooltipClick}>
      {word.message && (
        <div className="flex">
          <span dangerouslySetInnerHTML={formatGreenFeedbackText(word?.message.easy)} />{' '}
          {ref && Object.keys(ref).length && (
            <Icon
              name="external"
              size="small"
              style={{ alignSelf: 'flex-start', marginLeft: '0.5rem' }}
            />
          )}
        </div>
      )}
      {answer && (
        <div>
          {`${intl.formatMessage({ id: 'you-used' })}: `}
          <span dangerouslySetInnerHTML={formatGreenFeedbackText(answer.users_answer)} style={getTextStyle(learningLanguage, 'tooltip')}/>
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

export default WrongAnswer
