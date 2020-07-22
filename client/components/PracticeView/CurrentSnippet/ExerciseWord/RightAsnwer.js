import React, { useState } from 'react'
import Tooltip from 'Components/PracticeView/Tooltip'

const PreviousExerciseWord = ({ word, handleWordClick }) => {
  const { surface, lemmas } = word
  const [show, setShow] = useState(false)

  const handleClick = () => {
    handleWordClick(surface, lemmas)
    setShow(true)
  }

  const tooltip = (
    <div className="tooltip-green">
      <div>{word.message}</div>
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

export default PreviousExerciseWord
