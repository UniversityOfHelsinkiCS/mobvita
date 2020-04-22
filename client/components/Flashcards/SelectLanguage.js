import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useIntl } from 'react-intl'
import {
  learningLanguageSelector,
  dictionaryLanguageSelector,
  translatableLanguages,
} from 'Utilities/common'
import { getFlashcards } from 'Utilities/redux/flashcardReducer'
import { updateDictionaryLanguage } from 'Utilities/redux/userReducer'

const SelectLanguage = () => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const { storyId } = useParams()
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)

  const dictionaryOptions = translatableLanguages[learningLanguage]
    ? translatableLanguages[learningLanguage].map(element => ({
      key: element,
      value: element,
      text: intl.formatMessage({ id: element }),
    }))
    : []

  const handleLanguageChange = async (value) => {
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
      {dictionaryOptions.map(option => (
        <option key={option.key} value={option.value}>{option.text}</option>
      ))}
    </select>
  )
}

export default SelectLanguage
