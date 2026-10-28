import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
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
 * pure <LanguageSelectContent>. Selecting a language updates it, closes the dialog and sends the
 * user home. Used by the navbar (controlled open) and the /learningLanguage route (always-open).
 */
const LanguageSelectDialog = ({ open, onClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(({ user }) => user)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { pending, learningLanguageChanged } = user

  const [showInterfaceModal, setShowInterfaceModal] = useState(false)
  // Only a pick made in this dialog should move the user. `learningLanguageChanged` also fires for
  // programmatic changes — DemoPublicRoute sets the demo language for fresh anonymous sessions —
  // and this dialog is mounted by the navbar on every `*` route, demo pages included.
  const changedByUser = useRef(false)

  useEffect(() => {
    setShowInterfaceModal(open && !user.data?.user?.interfaceLanguage)
  }, [open, user])

  useEffect(() => {
    if (!learningLanguageChanged) return
    dispatch(resetLearningLanguageChanged())
    onClose()
    if (!changedByUser.current) return
    changedByUser.current = false
    // Whatever the user was doing belonged to the old language — a story, a test, a lesson — so
    // `replace` rather than push: going Back would otherwise return to that dead context.
    navigate('/home', { replace: true })
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
    changedByUser.current = true
    checkForTranslatableLanguages(capitalize(lang))
    dispatch(updateLearningLanguage(lang))
  }

  return (
    <>
      <AppDialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        title={
          <span style={{ display: 'block', fontSize: 34, fontWeight: 700, lineHeight: 1.15 }}>
            <FormattedMessage id="what-language-would-you-like-to-learn" />
          </span>
        }
      >
        <LanguageSelectContent onSelect={handleLearningLanguageChange} />
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
