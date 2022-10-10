import React from 'react'
import { useDispatch } from 'react-redux'
import { dismissBetaLanWarning } from 'Utilities/redux/userReducer'
import { Modal } from 'semantic-ui-react'
import { images } from 'Utilities/common'

import { FormattedMessage } from 'react-intl'

const BetaLanguageModal = ({ open, setOpen, language }) => {
  const dispatch = useDispatch()

  const closeModal = () => {
    dispatch(dismissBetaLanWarning())
    setOpen(false)
  }

  return (
    <Modal
      basic
      open={open}
      size="tiny"
      centered={false}
      dimmer="blurring"
      closeIcon={{ style: { top: '2.5rem', right: '2.5rem' }, color: 'black', name: 'close' }}
      onClose={closeModal}
    >
      <Modal.Content>
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
      </Modal.Content>
    </Modal>
  )
}

export default BetaLanguageModal
