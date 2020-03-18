import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { getTextWidth, dictionaryLanguageSelector } from 'Utilities/common'
import Tooltip from './Tooltip'

const ExerciseCloze = ({ word, handleChange, handleClick, value }) => {
  const [className, setClassName] = useState('cloze untouched')
  const [touched, setTouched] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { isWrong, tested } = word
  const [show, setShow] = useState(false)

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
        <div className="tooltip-blue">{`${word.base || word.bases} → ${dictionaryLanguage}`}</div>
      </div>
    ) : (
      <div onClick={handleTooltipClick}>
        <div className="tooltip-blue">{`${word.base || word.bases} → ${dictionaryLanguage}`}</div>
      </div>
    )

  const handleDelayedBlur = () => { // It just works...
    setTimeout(() => {
      setShow(false)
    }, 100)
  }

  return (
    <Tooltip placement="top" trigger="none" onVisibilityChange={setShow} tooltipShown={show} closeOnOutOfBoundaries tooltip={tooltip} additionalClassnames="clickable">
      <input
        data-cy="exercise-cloze"
        autoCapitalize="off"
        disabled={disabled}
        key={word.ID}
        placeholder={`${word.base || word.bases}`}
        value={value}
        onChange={changeValue}
        onBlur={handleDelayedBlur}
        onFocus={() => setShow(!show)}
        className={className}
        style={{
          width: ((word.surface > word.base) ? getTextWidth(word.surface) : getTextWidth(word.base)),
          marginRight: '2px',
          height: '1.5em',
          borderRadius: '6px',
          lineHeight: 'normal',
        }}
      />
    </Tooltip>
  )
}

export default ExerciseCloze
