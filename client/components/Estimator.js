import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

const Estimator = () => {
  const [story, setStory] = useState('')

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <Form>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label size="lg">Estimator</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            size="lg"
            placeholder="Insert your story here"
            onChange={e => setStory(e.target.value)}
          />
        </Form.Group>
        <Button type="button" onClick={() => console.log(story)}>
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default Estimator
