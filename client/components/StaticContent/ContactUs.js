import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendEmail } from 'Utilities/redux/emailReducer'
import AppDialog from 'Components/ui/AppDialog'
import ContactForm from './ContactForm'

/**
 * ContactUs — connected container for the contact modal.
 *
 * Works two ways: pass a `trigger` element (it's cloned with an onClick that opens the dialog), or
 * drive it with `open` / `setOpen`. Owns redux (sendEmail) and form state; renders the pure
 * <ContactForm> inside the design-system <AppDialog>.
 */
export default function ContactUs({ trigger, open: controlledOpen, setOpen: setControlledOpen }) {
  const dispatch = useDispatch()

  const error = useSelector(({ email }) => email.errorMessage)
  const session = useSelector(({ user }) => user)
  const user = session.data ? session.data.user : null

  const [internalOpen, setInternalOpen] = useState(false)
  const controlled = typeof controlledOpen === 'boolean' && typeof setControlledOpen === 'function'
  const open = controlled ? controlledOpen : internalOpen
  const setOpen = controlled ? setControlledOpen : setInternalOpen

  const initialFormState = {
    name: user ? user.username : '',
    email: user ? user.email : '',
    subject: 'Revita',
    message: '',
  }
  const [formState, setFormState] = useState(initialFormState)

  const handleFieldChange = (name, value) => {
    setFormState(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    setOpen(false)
    dispatch(sendEmail(formState))
    setFormState(initialFormState)
  }

  return (
    <>
      {trigger && React.cloneElement(trigger, { onClick: () => setOpen(true) })}
      <AppDialog open={open} onClose={() => setOpen(false)} title="Contact us">
        <ContactForm
          name={formState.name}
          email={formState.email}
          subject={formState.subject}
          message={formState.message}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          error={error}
        />
      </AppDialog>
    </>
  )
}
