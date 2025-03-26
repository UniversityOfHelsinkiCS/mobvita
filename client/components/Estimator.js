import React, { useState } from 'react'
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap'
import { callApi } from 'Utilities/apiConnection'

const Estimator = () => {
  const [text, setText] = useState('')
  const [difficulty, setDifficulty] = useState(null)

  const estimate = async () => {
    try {
      const response = await callApi('/estimate', 'POST', { text })
      setDifficulty(response.data.difficulty)
    } catch (error) {
      console.error('Error submitting text:', error)
    }
  }

  const handleClick = e => {
    e.preventDefault()
    estimate()
  }

  return (
    <Container>
      <Row className="justify-content-center my-5">
        <Col xs="auto">
          <h3>Estimate the complexity of Finnish text</h3>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col>
          <Form>
            <Form.Group>
              <Form.Control
                as="textarea"
                className="overflow-auto"
                rows={5}
                size="lg"
                placeholder="Paste your text here"
                onChange={e => setText(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs="auto">
          <Button type="button" onClick={e => handleClick(e)}>
            Estimate
          </Button>
        </Col>
      </Row>
      {difficulty && (
        <Row className="my-5">
          <Col>
            <Table bordered>
              <tbody>
                <tr>
                  <td>Difficulty</td>
                  <td>{difficulty}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default Estimator
