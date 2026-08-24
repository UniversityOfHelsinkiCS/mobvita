import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { learningLanguageSelector } from 'Utilities/common'
import { useSelector, useDispatch } from 'react-redux'
import { getAnswerFeedback } from 'Utilities/redux/feedbackDebuggerReducer'
import { Paper, TableHead, TableBody, TableRow, TableCell } from '@mui/material'
import { colors, font, shape } from 'Assets/mui_theme/designTokens'
import AppTable from 'Components/ui/AppTable'
import AppButton from 'Components/AppButton'
import AppTextField from 'Components/ui/AppTextField'
import Spinner from 'Components/Spinner'

// Match / mismatch cell tints — soft DS green (replaces the legacy bright `.correct` #d3ffd8) and a
// soft red so differing features stand out at a glance.
const CORRECT_BG = '#E9F1EC'
const MISMATCH_BG = '#F8E3E3'

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
          <Paper
            elevation={0}
            sx={{
              padding: '1.5em',
              mt: '1.5rem',
              backgroundColor: colors.card,
              color: colors.ink,
              fontFamily: font.family,
              border: 'none',
              borderRadius: '20px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.10)',
            }}
          >
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1em', maxWidth: 550 }}>
                <AppTextField
                  label="Correct answer"
                  placeholder="Enter a single word or analytic chunk"
                  value={correctAnswer}
                  onChange={({ target }) => setCorrectAnswer(target.value)}
                  inputProps={{ 'data-cy': 'debug-test-correct-answer' }}
                />
                <AppTextField
                  label="User answer"
                  placeholder="Enter a single word or analytic chunk"
                  value={userAnswer}
                  onChange={({ target }) => setUserAnswer(target.value)}
                  inputProps={{ 'data-cy': 'debug-test-user-answer' }}
                />
              </div>
              <AppButton
                type="submit"
                sx={{ height: shape.inputHeight, py: 0, mt: '1em' }}
                data-cy="debug-test-submit"
              >
                submit
              </AppButton>
            </form>
            {feedback && (
              <div style={{ marginTop: '1.5rem' }}>
                <h4 data-cy="debug-test-feedback" style={{ fontWeight: 600 }}>
                  Feedback:
                  <FormattedHTMLMessage
                    id={'<ul> <li />' + feedback.message.replace(/---/g, '<li />') + '</ul>'}
                  />
                </h4>
                <AppTable bordered data-cy="debug-test-feature-table" sx={{ tableLayout: 'fixed' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" style={{ width: '250px' }}>
                        Features
                      </TableCell>
                      <TableCell align="center" style={{ width: '250px' }}>
                        Correct answer
                      </TableCell>
                      <TableCell align="center" style={{ width: '250px' }}>
                        User answer
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.from(
                      new Set([
                        ...Object.keys(feedback.user_features),
                        ...Object.keys(feedback.true_features),
                      ]),
                    )
                      .sort(function (a, b) {
                        const textA = a.toUpperCase()
                        const textB = b.toUpperCase()
                        return textA < textB ? -1 : textA > textB ? 1 : 0
                      })
                      .map(key => {
                        const isMatch =
                          feedback.user_features[key]?.toString() ===
                          feedback.true_features[key]?.toString()
                        const cellSx = { backgroundColor: isMatch ? CORRECT_BG : MISMATCH_BG }
                        return (
                          <TableRow key={key}>
                            <TableCell align="center" sx={cellSx}>
                              {key}
                            </TableCell>
                            <TableCell align="center" sx={cellSx}>
                              {(feedback.true_features[key] || '').toString()}
                            </TableCell>
                            <TableCell align="center" sx={cellSx}>
                              {(feedback.user_features[key] || '').toString()}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </AppTable>
              </div>
            )}
          </Paper>
        </div>
      </div>
    </div>
  )
}

export default DebugTestView
