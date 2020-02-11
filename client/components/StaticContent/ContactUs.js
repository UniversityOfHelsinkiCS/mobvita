import React, { useState } from 'react'
import { Modal, Container, Form, Button } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { sendEmail } from 'Utilities/redux/emailReducer'


export default function ContactUs({ trigger }) {
  const dispatch = useDispatch()

  const error = useSelector(({ email }) => email.errorMessage)
  const session = useSelector(({ user }) => user)
  const user = session.data ? session.data.user : null

  const [formState, setFormState] = useState({
    name: user ? user.username : '',
    email: user ? user.email : '',
    subject: 'MobVita',
    message: '',
  })

  const handleFormChange = (e) => {
    const { name, value } = e.target

    setFormState({
      ...formState,
      [name]: value,
    })
  }


  return (
    <Modal
      dimmer="inverted"
      closeIcon
      trigger={trigger}
    >
      <Modal.Header>Contact us</Modal.Header>
      <Modal.Content className="practiceModal">

        <Container>
          <Form onSubmit={() => dispatch(sendEmail(formState))}>
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
