import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React, { useState } from 'react'
import { learningLanguageSelector } from 'Utilities/common'
import { useSelector, useDispatch } from 'react-redux'
import { getAnswerFeedback } from 'Utilities/redux/feedbackDebuggerReducer'
import { TableHead, TableBody, TableRow, TableCell } from '@mui/material'
import AppTable from 'Components/ui/AppTable'
import AppButton from 'Components/AppButton'
import { FormattedMessage } from 'react-intl';
import Spinner from 'Components/Spinner'

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
    return <Spinner fullHeight size={60} />
  }

  return (
    <div className="cont-tall pt-sm flex-col space-between">
      <div className="justify-center">
        <div className="cont">
          <form onSubmit={handleSubmit}>
            <div>
              Correct answer:
              <input
                placeholder="Enter a single word or analytic chunk"
                type="text"
                data-cy="debug-test-correct-answer"
                value={correctAnswer}
                onChange={({ target }) => setCorrectAnswer(target.value)}
              />
            </div>
            <div>
              User answer:
              <input
                placeholder="Enter a single word or analytic chunk"
                type="text"
                data-cy="debug-test-user-answer"
                value={userAnswer}
                onChange={({ target }) => setUserAnswer(target.value)}
              />
            </div>
            <AppButton type="submit" style={{ marginTop: '0.5em' }} data-cy="debug-test-submit">
              submit
            </AppButton>
          </form>
          {feedback && (
            <div>
              <br />
              <h4 data-cy="debug-test-feedback">
                Feedback:
                <FormattedHTMLMessage
                  id={'<ul> <li />' + feedback.message.replace(/---/g, '<li />') + '</ul>'}
                />
              </h4>
              <AppTable
                bordered
                data-cy="debug-test-feature-table"
                sx={{ tableLayout: 'fixed' }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{ width: '250px' }}>
                      Features
                    </TableCell>
                    <TableCell align="center" style={{ width: '250px ' }}>
                      Correct answer
                    </TableCell>
                    <TableCell align="center" style={{ width: '250px ' }}>
                      User answer
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from(
                    new Set(
                      Object.keys(feedback.user_features).concat(
                        Object.keys(feedback.true_features)
                      )
                    )
                  )
                    .sort(function (a, b) {
                      const textA = a.toUpperCase()
                      const textB = b.toUpperCase()
                      return textA < textB ? -1 : textA > textB ? 1 : 0
                    })
                    .map(key => (
                      <TableRow>
                        {feedback.user_features[key]?.toString() ===
                        feedback.true_features[key]?.toString() ? (
                          <>
                            <TableCell align="center" className="correct">
                              {key}
                            </TableCell>
                            <TableCell align="center" className="correct">
                              {(feedback.true_features[key] || '').toString()}
                            </TableCell>
                            <TableCell align="center" className="correct">
                              {(feedback.user_features[key] || '').toString()}
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell align="center">{key}</TableCell>
                            <TableCell align="center">
                              {(feedback.true_features[key] || '').toString()}
                            </TableCell>
                            <TableCell align="center">
                              {(feedback.user_features[key] || '').toString()}
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </AppTable>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DebugTestView
