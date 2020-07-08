import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import Tooltip from 'Components/PracticeView/Tooltip'

const PreviousExerciseWord = ({ word, handleWordClick, answer, tiedAnswer }) => {
  const { surface, isWrong, tested, lemmas } = word
  const intl = useIntl()
  const [show, setShow] = useState(false)

  const learningLanguage = useSelector(learningLanguageSelector)

  let color = ''
  if (tested) {
    color = isWrong ? 'wrong-text' : 'right-text'
  }

  const wordClass = `word-interactive ${color}`

  const handleClick = () => {
    handleWordClick(surface, lemmas)
    setShow(true)
  }

  const youAnsweredTooltip = answer || tiedAnswer

  const tooltip = (
    <div className="tooltip-green">
      {word.message && <div>{word.message}</div>}
      {youAnsweredTooltip && (
        <div>
          {`${intl.formatMessage({ id: 'you-used' })}: `}
          <span style={getTextStyle(learningLanguage, 'tooltip')}>
            {youAnsweredTooltip.users_answer}
          </span>
        </div>
      )
      }
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
