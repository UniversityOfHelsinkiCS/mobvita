import { FormattedMessage } from 'react-intl'
import { localeOptions } from 'Utilities/common'
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import AppSelect from 'Components/ui/AppSelect'
import { colors, font } from 'Assets/mui_theme/designTokens'

import { setLocale } from 'Utilities/redux/localeReducer'
import { updateLocale } from 'Utilities/redux/userReducer'

const headingStyle = {
  fontFamily: font.family,
  fontWeight: 700,
  fontSize: 22,
  lineHeight: 1.25,
  color: colors.ink,
  margin: '0 0 28px',
}

const InterfaceLanguageView = ({ setShowLangModal, showInterfaceModal }) => {
  const dispatch = useDispatch()

  const { data } = useSelector(({ user }) => user)
  const { user } = data

  const [localeDropdownOptions, setLocaleDropdownOptions] = useState([])
  const [language, setLanguage] = useState(user?.user?.interfaceLanguage || 'en')

  useEffect(() => {
    const temp = localeOptions.map(option => ({
      value: option.code,
      text: option.displayName,
      key: option.code,
    }))
    setLocaleDropdownOptions(temp)
  }, [dispatch, user])

  const handleLocaleChange = () => {
    dispatch(setLocale(language))
    if (user) dispatch(updateLocale(language))
    setShowLangModal(false)
  }

  return (
    <AppDialog
      open={showInterfaceModal}
      onClose={() => setShowLangModal(false)}
      maxWidth="xs"
      data-cy="interface-language-modal"
      closeDataCy="interface-language-modal-close"
      sx={{
        '& .MuiDialog-paper': { minHeight: 320 },
        '& .MuiDialogContent-root': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        },
      }}
    >
      <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
        <h3 style={headingStyle} data-cy="choose-lang">
          <FormattedMessage id="choose-interface-language" />
        </h3>
        <div
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.25rem' }}
          data-cy="ui-lang-select"
        >
          <AppSelect
            variant="contrast-outline"
            value={language} // Use the state for default locale
            options={localeDropdownOptions.map(option => ({
              value: option.value,
              label: option.text,
            }))}
            onChange={setLanguage}
            minWidth={200}
            matchTriggerWidth
          />
        </div>
        <AppButton
          variant="primary"
          size="lg"
          sx={{ fontSize: 16 }}
          onClick={handleLocaleChange}
          data-cy="interface-language-continue-button"
        >
          <FormattedMessage id="Continue" />
        </AppButton>
      </div>
    </AppDialog>
  )
}

export default InterfaceLanguageView
