import React, { useState } from 'react'
import { learningLanguageSelector } from 'Utilities/common'
import { useSelector, useDispatch } from 'react-redux'
import { getAnswerFeedback } from 'Utilities/redux/feedbackDebuggerReducer'
import { Table, Form } from 'semantic-ui-react'
import { Button, Spinner } from 'react-bootstrap'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

const DebugTestView = () => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { feedback, pending } = useSelector(({ debugFeedback }) => debugFeedback)
  const [userAnswer, setUserAnswer] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')

  const handleSubmit = event => {
    event.preventDefault()

    dispatch(getAnswerFeedback(learningLanguage, userAnswer, correctAnswer))
  }

  if (pending) {
    return <Spinner />
  }

  return (
    <div className="cont-tall pt-sm flex-col space-between">
      <div className="justify-center">
        <div className="cont">
          <Form onSubmit={handleSubmit}>
            <div>
              Correct answer:
              <input
                placeholder="Enter a single word or analytic chunk"
                type="text"
                value={correctAnswer}
                onChange={({ target }) => setCorrectAnswer(target.value)}
              />
            </div>
            <div>
              User answer:
              <input
                placeholder="Enter a single word or analytic chunk"
                type="text"
                value={userAnswer}
                onChange={({ target }) => setUserAnswer(target.value)}
              />
            </div>
            <Button type="submit" style={{ marginTop: '0.5em' }}>
              submit
            </Button>
          </Form>
          {feedback && (
            <div>
                <br/>
                <h4>
                    Feedback:
                    <FormattedHTMLMessage
                        id={"<ul> <li />" +
                            feedback.message.replace(/---/g, "<li />") +
                            "</ul>"
                           } />
                    
                </h4>
            <Table celled fixed unstackable>
              <Table.Header>
                <Table.Row textAlign="center">
                  <Table.HeaderCell style={{ width: '250px' }}>Features</Table.HeaderCell>
                  <Table.HeaderCell style={{ width: '250px ' }}>Correct answer</Table.HeaderCell>
                  <Table.HeaderCell style={{ width: '250px ' }}>User answer</Table.HeaderCell>
                </Table.Row>
                {Array.from(
                  new Set(
                    Object.keys(feedback.user_features).concat(Object.keys(feedback.true_features))
                  )
                )
                  .sort(function (a, b) {
                    const textA = a.toUpperCase()
                    const textB = b.toUpperCase()
                    return textA < textB ? -1 : textA > textB ? 1 : 0
                  })
                  .map(key => (
                    <Table.Row textAlign="center">
                      {feedback.user_features[key]?.toString() ===
                      feedback.true_features[key]?.toString() ? (
                        <>
                          <Table.Cell className="correct">{key}</Table.Cell>
                          <Table.Cell className="correct">
                            {(feedback.true_features[key] || '').toString()}
                          </Table.Cell>
                          <Table.Cell className="correct">
                            {(feedback.user_features[key] || '').toString()}
                          </Table.Cell>
                        </>
                      ) : (
                        <>
                          <Table.Cell>{key}</Table.Cell>
                          <Table.Cell>{(feedback.true_features[key] || '').toString()}</Table.Cell>
                          <Table.Cell>{(feedback.user_features[key] || '').toString()}</Table.Cell>
                        </>
                      )}
                    </Table.Row>
                  ))}
              </Table.Header>
            </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DebugTestView
