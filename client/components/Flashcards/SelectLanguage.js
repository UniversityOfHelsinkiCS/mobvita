import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  learningLanguageSelector,
  dictionaryLanguageSelector,
  translatableLanguages,
} from 'Utilities/common'
import { getFlashcards } from 'Utilities/redux/flashcardReducer'
import { updateDictionaryLanguage } from 'Utilities/redux/userReducer'

const SelectLanguage = ({ setSwipeIndex }) => {
  const dispatch = useDispatch()
  const { storyId } = useParams()
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)

  const dictionaryOptions = translatableLanguages[learningLanguage]
    ? translatableLanguages[learningLanguage].map(element => ({
      key: element,
      value: element,
      text: element,
    }))
    : []

  const handleLanguageChange = async (value) => {
    setSwipeIndex(0)
    dispatch(updateDictionaryLanguage(value))
    dispatch(getFlashcards(learningLanguage, value, storyId))
  }

  return (
    <select
      disabled={dictionaryOptions.length <= 1}
      defaultValue={dictionaryLanguage}
      style={{}}
      onChange={e => handleLanguageChange(e.target.value)}
    >
      {dictionaryOptions.map(option => <option key={option.key}>{option.text}</option>)}
    </select>
  )
}

export default SelectLanguage
