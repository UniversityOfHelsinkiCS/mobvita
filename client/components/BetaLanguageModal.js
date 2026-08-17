import React from 'react'
import { useDispatch } from 'react-redux'
import { dismissBetaLanWarning } from 'Utilities/redux/userReducer'
import AppDialog from 'Components/ui/AppDialog'
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
    >
      <div className="encouragement" style={{ padding: '1.5rem' }}>
        <div
          className="flex"
          style={{ alignItems: 'center', marginTop: '1.5rem', fontSize: '18px' }}
        >
          <img
            src={images.exclamationMark}
            alt="exclamation mark"
            style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
          />
          <FormattedMessage id="beta-language-warning" values={{ language }} />
        </div>
      </div>
    </AppDialog>
  )
}

export default BetaLanguageModal
