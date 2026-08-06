import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import { images } from 'Utilities/common'
import { deleteFlashcard } from 'Utilities/redux/flashcardReducer'

const FlashcardDelete = ({ id }) => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  const handleRemove = async () => {
    await dispatch(deleteFlashcard(id))
  }

  return (
    <>
      <button className="flashcard-blended-input" type="button" onClick={() => setOpen(true)}>
        <img src={images.xClose} alt="close" style={{ width: 20, height: 20 }} />
      </button>
      <AppDialog open={open} onClose={() => setOpen(false)} title={<FormattedMessage id="Warning" />}>
        <FormattedMessage id="this-will-permanently-remove-this-flashcard-are-you-sure-you-want-to-proceed" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <AppButton variant="outline" onClick={() => setOpen(false)}>
            <FormattedMessage id="Cancel" />
          </AppButton>
          <AppButton variant="danger" onClick={() => handleRemove()}>
            <FormattedMessage id="Remove" />
          </AppButton>
        </div>
      </AppDialog>
    </>
  )
}

export default FlashcardDelete
