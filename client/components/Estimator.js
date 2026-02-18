import React, { useState } from 'react'
import { Container, Row, Col, Button, Form, Table, Alert, Badge } from 'react-bootstrap'
import axios from 'axios'
import Spinner from 'Components/Spinner'

const Estimator = () => {
  const [text, setText] = useState('')
  const [results, setResults] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const estimate = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post('/api/estimate', { text })
      setResults(response.data)
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
              <Spinner inline />
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
      {results && (
        <Row className="my-5">
          <Col>
            <h4 style={{ marginBottom: '20px' }}>Results</h4>
            <Table bordered>
              <tbody>
                <tr>
                  <td>Score</td>
                  <td>{results.score.toFixed(1)}</td>
                </tr>
                <tr>
                  <td>CEFR</td>
                  <td>{results.cefr}</td>
                </tr>
                <tr>
                  <td>Level</td>
                  <td>{results.level}</td>
                </tr>
                <tr>
                  <td>Top features</td>
                  <td>
                    {results.explanation.slice(0, 10).map(item => (
                      <>
                        <Badge variant={item.contribution > 0 ? 'success' : 'danger'} pill>
                          {item.feature}
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
