import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { getTextWidth, learningLanguageSelector } from 'Utilities/common'
import Tooltip from './Tooltip'

const ExerciseCloze = ({ word, handleChange, handleClick, value }) => {
  const [className, setClassName] = useState('cloze untouched')
  const [touched, setTouched] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { isWrong, tested } = word

  const handleTooltipClick = () => handleClick(word.base || word.bases, word.lemmas)

  const changeValue = (e) => {
    if (!touched) {
      setTouched(true)
      setClassName('cloze touched')
    }
    handleChange(e, word)
  }

  useEffect(() => {
    if (tested) {
      if (isWrong) {
        setClassName('wrong')
      } else {
        setClassName('correct')
        setDisabled(true)
      }
    }
  }, [tested])


  const tooltip = word.message
    ? (
      <div onClick={handleTooltipClick}>
        <div className="tooltip-green">{word.message}</div>
        <div className="tooltip-blue">{`${word.base || word.bases} → ${learningLanguage}`}</div>
      </div>
    ) : (
      <div onClick={handleTooltipClick}>
        <div className="tooltip-blue">{`${word.base || word.bases} → ${learningLanguage}`}</div>
      </div>
    )

  return (
    <Tooltip placement="top" trigger="click" tooltip={tooltip} additionalClassnames="clickable">
      <input
        data-cy="exercise-cloze"
        autoCapitalize="off"
        disabled={disabled}
        key={word.ID}
        placeholder={`${word.base || word.bases}`}
        value={value}
        onChange={changeValue}
        className={className}
        style={{
          width: ((word.surface > word.base) ? getTextWidth(word.surface) : getTextWidth(word.base)),
          marginRight: '2px',
          height: '1.5em',
          borderRadius: '6px',
        }}
      />
    </Tooltip>
  )
}

export default ExerciseCloze
