import React, { useState } from 'react'
import { Container, Row, Col, Button, Form, Table, Alert, Spinner, Badge } from 'react-bootstrap'
import axios from 'axios'

const Estimator = () => {
  const [text, setText] = useState('')
  const [level, setLevel] = useState(null)
  const [explanations, setExplanations] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const estimate = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post('/api/estimate', { text })
      setLevel(response.data.level)
      setExplanations(response.data.explanation)
      setIsLoading(false)
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setIsLoading(false)
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
                rows={10}
                size="lg"
                placeholder="Paste your text here"
                onChange={e => setText(e.target.value)}
              />
            </Form.Group>
            <Form.Text>
              Max. 500 words, {text.trim().split(/\s+/).filter(Boolean).length} used
            </Form.Text>
          </Form>
        </Col>
      </Row>
      <Row className="justify-content-center my-3">
        <Col xs="auto">
          <Button
            type="button"
            style={{ width: '100px', height: '40px' }}
            disabled={!text || isLoading}
            onClick={e => handleClick(e)}
          >
            {!isLoading ? (
              <span>Estimate</span>
            ) : (
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            )}
          </Button>
        </Col>
      </Row>
      {errorMessage && (
        <Row className="mt-5">
          <Col>
            <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
              {errorMessage}
            </Alert>
          </Col>
        </Row>
      )}
      {explanations && (
        <Row className="my-5">
          <Col>
            <h4 style={{ marginBottom: '20px' }}>Results</h4>
            <Table bordered>
              <tbody>
                <tr>
                  <td>Level</td>
                  <td>{level}</td>
                </tr>
                <tr>
                  <td>Top features</td>
                  <td>
                    {explanations.slice(0, 10).map(explanation => (
                      <>
                        <Badge variant="info" pill>
                          {explanation.feature}
                        </Badge>{' '}
                      </>
                    ))}
                  </td>
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
