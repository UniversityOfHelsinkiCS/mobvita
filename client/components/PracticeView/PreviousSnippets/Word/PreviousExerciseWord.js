import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { getTextStyle, learningLanguageSelector, hiddenFeatures } from 'Utilities/common'
import { setReferences } from 'Utilities/redux/practiceReducer'
import Tooltip from 'Components/PracticeView/Tooltip'

const PreviousExerciseWord = ({ word, handleWordClick, answer, tiedAnswer }) => {
  const { surface, isWrong, tested, lemmas, ref } = word

  const [show, setShow] = useState(false)

  const learningLanguage = useSelector(learningLanguageSelector)

  const intl = useIntl()
  const dispatch = useDispatch()

  let color = ''
  if (tested) {
    color = isWrong ? 'wrong-text' : 'right-text'
  }

  const wordClass = `word-interactive ${color}`

  const handleClick = () => {
    handleWordClick(surface, lemmas)
    setShow(true)
  }

  const handleTooltipClick = () => {
    if (ref && hiddenFeatures) dispatch(setReferences(ref))
  }

  const youAnsweredTooltip = answer || tiedAnswer

  const tooltip = (
    <div className="tooltip-green" style={{ cursor: 'pointer' }} onMouseDown={handleTooltipClick}>
      {word.message && (
        <div className="flex">
          {word.message}{' '}
          {ref && hiddenFeatures && (
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
