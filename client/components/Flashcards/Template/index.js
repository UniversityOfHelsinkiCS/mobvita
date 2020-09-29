import React, { useState, useRef } from 'react'
import useWindowDimensions from 'Utilities/windowDimensions'
import TemplateDesktopView from './TemplateDesktopView'
import TemplateMobileView from './TemplateMobileView'

const CardTemplate = ({ saveAction, clearAction, hints, setHints, ...props }) => {
  const [hint, setHint] = useState('')
  const [translation, setTranslation] = useState('')

  const bigScreen = useWindowDimensions().width >= 720

  const hintRef = useRef()

  const handleSave = () => {
    saveAction(hint)
    setHint('')
    setTranslation('')
  }

  const handleClear = () => {
    clearAction()
    setHint('')
    setTranslation('')
  }

  if (bigScreen) {
    return (
      <TemplateDesktopView
        hint={hint}
        hintRef={hintRef}
        hints={hints}
        setHints={setHints}
        setHint={setHint}
        translation={translation}
        setTranslation={setTranslation}
        handleSave={handleSave}
        handleClear={handleClear}
        {...props}
      />
    )
  }

  return (
    <TemplateMobileView
      hint={hint}
      hintRef={hintRef}
      hints={hints}
      setHints={setHints}
      setHint={setHint}
      translation={translation}
      setTranslation={setTranslation}
      handleSave={handleSave}
      handleClear={handleClear}
      {...props}
    />
  )
}

export default CardTemplate
