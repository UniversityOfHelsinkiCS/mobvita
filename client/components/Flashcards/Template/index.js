import React, { useState } from 'react'
import useWindowDimensions from 'Utilities/windowDimensions'
import TemplateDesktopView from './TemplateDesktopView'
import FlashcardTemplate from '../FlashcardTemplate'

const CardTemplate = ({ saveAction, ...props }) => {
  const [hint, setHint] = useState('')
  const [translation, setTranslation] = useState('')

  const bigScreen = useWindowDimensions().width >= 1000

  const handleSave = () => {
    saveAction()
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
        {...props}
      />
    )
  }

  return <FlashcardTemplate {...props} />
}

export default CardTemplate
