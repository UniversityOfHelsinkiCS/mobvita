import React, { useState } from 'react'
import useWindowDimensions from 'Utilities/windowDimensions'
import TemplateDesktopView from './TemplateDesktopView'
import TemplateMobileView from './TemplateMobileView'

const CardTemplate = ({ saveAction, clearAction, ...props }) => {
  const [hint, setHint] = useState('')
  const [translation, setTranslation] = useState('')

  const bigScreen = useWindowDimensions().width >= 1000

  const handleSave = () => {
    saveAction()
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
