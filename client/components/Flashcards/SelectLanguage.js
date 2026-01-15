import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import {
  learningLanguageSelector,
  dictionaryLanguageSelector,
  translatableLanguages,
} from 'Utilities/common'
import { updateDictionaryLanguage } from 'Utilities/redux/userReducer'

const SelectLanguage = () => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)

  const dictionaryOptions = translatableLanguages[learningLanguage]
    ? translatableLanguages[learningLanguage].map(element => ({
        key: element,
        value: element,
        text: intl.formatMessage({ id: element }),
      }))
    : []

  const handleLanguageChange = async (_, data) => {
    dispatch(updateDictionaryLanguage(data.value))
  }

  return (
    <Dropdown
      data-cy="flashcards-dictionary-language"
      selection
      fluid
      options={dictionaryOptions}
      value={dictionaryLanguage}
      onChange={handleLanguageChange}
    />
  )
}

export default SelectLanguage