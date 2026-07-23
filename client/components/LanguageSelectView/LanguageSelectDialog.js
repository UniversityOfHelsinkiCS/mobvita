import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import CircularProgress from '@mui/material/CircularProgress'
import { capitalize, dictionaryLanguageSelector, translatableLanguages } from 'Utilities/common'
import {
  updateLearningLanguage,
  updateDictionaryLanguage,
  resetLearningLanguageChanged,
} from 'Utilities/redux/userReducer'
import AppDialog from 'Components/ui/AppDialog'
import LanguageSelectContent from './LanguageSelectContent'
import InterfaceLanguageView from './InterfaceLanguageView'

/**
 * LanguageSelectDialog — learning-language picker in an AppDialog. Owns the redux logic; renders the
 * pure <LanguageSelectContent>. Selecting a language updates it and closes the dialog. Used by the
 * navbar (controlled open) and the /learningLanguage route (rendered always-open).
 */
const LanguageSelectDialog = ({ open, onClose }) => {
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { pending, learningLanguageChanged } = user

  const [showInterfaceModal, setShowInterfaceModal] = useState(false)

  useEffect(() => {
    setShowInterfaceModal(open && !user.data.user?.interfaceLanguage)
  }, [open, user])

  useEffect(() => {
    if (learningLanguageChanged) {
      dispatch(resetLearningLanguageChanged())
      onClose()
    }
  }, [learningLanguageChanged])

  const checkForTranslatableLanguages = lang => {
    if (!translatableLanguages[lang]) {
      dispatch(updateDictionaryLanguage('English'))
      return
    }
    if (translatableLanguages[lang].includes(dictionaryLanguage)) return
    if (translatableLanguages[lang].includes('English')) {
      dispatch(updateDictionaryLanguage('English'))
      return
    }
    if (translatableLanguages[lang].includes('Russian')) {
      dispatch(updateDictionaryLanguage('Russian'))
      return
    }
    if (translatableLanguages[lang].length > 0) {
      dispatch(updateDictionaryLanguage(translatableLanguages[lang][0]))
    }
  }

  const handleLearningLanguageChange = lang => {
    checkForTranslatableLanguages(capitalize(lang))
    dispatch(updateLearningLanguage(lang))
  }

  return (
    <>
      <AppDialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        title={<FormattedMessage id="what-language-would-you-like-to-learn" />}
      >
        {pending ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2em' }}>
            <CircularProgress />
          </div>
        ) : (
          <LanguageSelectContent onSelect={handleLearningLanguageChange} />
        )}
      </AppDialog>

      {showInterfaceModal && (
        <InterfaceLanguageView
          setShowLangModal={setShowInterfaceModal}
          showInterfaceModal={showInterfaceModal}
        />
      )}
    </>
  )
}

export default LanguageSelectDialog
