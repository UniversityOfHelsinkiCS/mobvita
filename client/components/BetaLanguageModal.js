// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useDispatch } from 'react-redux'
import { dismissBetaLanWarning } from 'Utilities/redux/userReducer'
import AppDialog from 'Components/ui/AppDialog'
import AppButton from 'Components/AppButton'
import { colors, font } from 'Assets/mui_theme/designTokens'
import { images } from 'Utilities/common'

import { FormattedMessage } from 'react-intl'

const BetaLanguageModal = ({ open, setOpen, language }) => {
  const dispatch = useDispatch()

  const closeModal = () => {
    dispatch(dismissBetaLanWarning())
    setOpen(false)
  }

  return (
    <AppDialog
      open={open}
      onClose={closeModal}
      maxWidth="xs"
      data-cy="beta-language-modal"
      closeDataCy="beta-language-modal-close"
      sx={{
        '& .MuiDialog-paper': { minHeight: 320 },
        '& .MuiDialogContent-root': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        },
      }}
    >
      <div style={{ textAlign: 'center', padding: '0.5rem 0.5rem 0' }}>
        <img
          src={images.exclamationMark}
          alt="exclamation mark"
          style={{ width: 48, height: 48, marginBottom: '1.25rem' }}
        />
        <p
          style={{
            fontFamily: font.family,
            fontWeight: 500,
            fontSize: 18,
            lineHeight: 1.4,
            color: colors.ink,
            margin: '0 0 28px',
          }}
        >
          <FormattedMessage id="beta-language-warning" values={{ language }} />
        </p>
        <AppButton
          variant="primary"
          size="lg"
          sx={{ fontSize: 16 }}
          data-cy="beta-language-modal-continue"
          onClick={closeModal}
        >
          <FormattedMessage id="Continue" />
        </AppButton>
      </div>
    </AppDialog>
  )
}

export default BetaLanguageModal
