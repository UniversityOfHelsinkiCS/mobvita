import React, { useState } from 'react'
import { Modal, Container, Form, Button } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { sendEmail } from 'Utilities/redux/emailReducer'


export default function ContactUs({ trigger, open: controlledOpen, setOpen: setControlledOpen }) {
  const dispatch = useDispatch()

  const error = useSelector(({ email }) => email.errorMessage)
  const session = useSelector(({ user }) => user)
  const user = session.data ? session.data.user : null

  const initialFormState = {
    name: user ? user.username : '',
    email: user ? user.email : '',
    subject: 'Revita',
    message: '',
  }

  const [formState, setFormState] = useState(initialFormState)
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = typeof controlledOpen === 'boolean' && typeof setControlledOpen === 'function'
  const modalOpen = isControlled ? controlledOpen : internalOpen
  const setModalOpen = isControlled ? setControlledOpen : setInternalOpen

  const handleFormChange = (e) => {
    const { name, value } = e.target

    setFormState({
      ...formState,
      [name]: value,
    })
  }

  const handleFormSubmit = () => {
    setModalOpen(false)
    dispatch(sendEmail(formState))
    setFormState(initialFormState)
  }


  return (
    <Modal
      dimmer="inverted"
      closeIcon
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      onOpen={() => setModalOpen(true)}
      trigger={trigger}
    >
      <Modal.Header>Contact us</Modal.Header>
      <Modal.Content className="practiceModal">

        <Container>
          <Form onSubmit={handleFormSubmit}>
            <Form.Field>
              <label>Name</label>
              <input value={formState.name} onChange={handleFormChange} name="name" placeholder="Name" />
            </Form.Field>
            <Form.Field>
              <label>Subject</label>
              <input value={formState.subject} onChange={handleFormChange} name="subject" placeholder="Subject" />
            </Form.Field>
            <Form.Field>
              <label>Email</label>
              <input value={formState.email} onChange={handleFormChange} name="email" placeholder="Email" />
            </Form.Field>
            <Form.TextArea value={formState.message} onChange={handleFormChange} name="message" label="Message" placeholder="What can we help you with?" />
            <Button type="submit">Submit</Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </Form>
        </Container>


      </Modal.Content>
    </Modal>
  )
}
