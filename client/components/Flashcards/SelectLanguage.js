import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import AppSelect from 'Components/ui/AppSelect'
import {
  learningLanguageSelector,
  dictionaryLanguageSelector,
  translatableLanguages,
} from 'Utilities/common'
import { updateDictionaryLanguage } from 'Utilities/redux/userReducer'

const SelectLanguage = ({ trigger }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)

  const dictionaryOptions = translatableLanguages[learningLanguage]
    ? translatableLanguages[learningLanguage].map(element => ({
        value: element,
        label: intl.formatMessage({ id: element }),
      }))
    : []

  const handleLanguageChange = value => {
    dispatch(updateDictionaryLanguage(value))
  }

  return (
    <div data-cy="flashcards-dictionary-language">
      <AppSelect
        variant="tan-outline"
        trigger={trigger}
        value={dictionaryLanguage}
        onChange={handleLanguageChange}
        options={dictionaryOptions}
        minWidth={200}
      />
    </div>
  )
}

export default SelectLanguage
