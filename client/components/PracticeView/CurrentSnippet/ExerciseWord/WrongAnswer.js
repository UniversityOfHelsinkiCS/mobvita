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
} from 'Utilities/common'
import { setReferences } from 'Utilities/redux/practiceReducer'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'
import Tooltip from 'Components/PracticeView/Tooltip'

const WrongAnswer = ({ word }) => {
  const { surface, lemmas, ref, ID: wordId, id: storyId, inflection_ref: inflectionRef } = word
  const answer = useSelector(({ practice }) => practice.currentAnswers[word.ID])

  const [show, setShow] = useState(false)

  const learningLanguage = useSelector(learningLanguageSelector)
  const autoSpeak = useSelector(({ user }) => user.data.user.auto_speak)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)

  const intl = useIntl()
  const dispatch = useDispatch()

  const voice = respVoiceLanguages[learningLanguage]

  const wordClass = 'word-interactive wrong-text'

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
  }

  const handleTooltipClick = () => {
    if (ref) dispatch(setReferences(ref))
  }

  const tooltip = (
    <div className="tooltip-green" style={{ cursor: 'pointer' }} onMouseDown={handleTooltipClick}>
      {word.message && (
        <div className="flex">
          {word.message}{' '}
          {ref && (
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
          <span style={getTextStyle(learningLanguage, 'tooltip')}>{answer.users_answer}</span>
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
