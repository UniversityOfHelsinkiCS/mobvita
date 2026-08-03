import React from 'react'
import { useNavigate } from 'react-router-dom'
import LanguageSelectDialog from './LanguageSelectDialog'

/**
 * /learningLanguage route — renders the learning-language dialog always-open (onboarding + direct
 * navigation). Selecting a language / closing returns to /home.
 */
const LearningLanguageSelectView = () => {
  const navigate = useNavigate()
  return <LanguageSelectDialog open onClose={() => navigate('/home')} />
}

export default LearningLanguageSelectView
