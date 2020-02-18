import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { getTextWidth, learningLanguageSelector } from 'Utilities/common'
import { Overlay } from 'react-bootstrap'

const ExerciseCloze = ({ word, handleChange, handleClick, value }) => {
  const [className, setClassName] = useState('cloze untouched')
  const [touched, setTouched] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [show, setShow] = useState(false)
  const target = useRef(null)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { isWrong, tested } = word

  const handleOverlayClick = () => handleClick(word.base || word.bases, word.lemmas)

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

  const handleHide = () => {
    if (show) setShow(false)
  }

  const handleShow = () => {
    if (!show) setShow(true)
  }

  return (
    <>
      <input
        ref={target}
        data-cy="exercise-cloze"
        autoCapitalize="off"
        disabled={disabled}
        key={word.ID}
        placeholder={`${word.base || word.bases}`}
        value={value}
        onChange={changeValue}
        className={className}
        onClick={handleShow}
        style={{
          width: ((word.surface > word.base) ? getTextWidth(word.surface) : getTextWidth(word.base)),
          marginRight: '2px',
          height: '1.5em',
          borderRadius: '6px',
        }}
      />

      { show && (
        <Overlay
          target={target.current}
          show={show}
          placement="top"
          rootClose
          onHide={handleHide}
        >
          {({
            placement,
            scheduleUpdate,
            arrowProps,
            outOfBoundaries,
            show: _show,
            ...props
          }) => (
            <div
              {...props}
              className="overlay clickable"
              style={{ ...props.style }}
              onClick={handleOverlayClick}
            >
              {word.message || `${word.base} → ${learningLanguage}`}
            </div>
          )}
        </Overlay>
      )}

    </>
  )
}

export default ExerciseCloze
