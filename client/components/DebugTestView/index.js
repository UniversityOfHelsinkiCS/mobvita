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

// Match / mismatch tints for the two answer cells — soft DS green (replaces the legacy bright
// `.correct` #d3ffd8) and a soft amber so differing features stand out at a glance.
const CORRECT_BG = '#B4D2AF'
const MISMATCH_BG = '#F1D0AA'

// The cells are separate tiles rather than one banded row, the whole row tinted by whether the
// two values agree.
const FEATURE_TABLE_SX = {
  tableLayout: 'fixed',
  borderCollapse: 'separate',
  borderSpacing: '6px',
  '& .MuiTableCell-root': {
    border: 'none',
    borderRadius: '8px',
    padding: '10px 12px',
    // Feature values can be long, and some have no spaces to break at — wrap inside the tile
    // rather than letting the text run past it.
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
    verticalAlign: 'top',
  },
  '& .MuiTableCell-head': {
    backgroundColor: colors.green,
    fontWeight: 600,
  },
}

// The backend separates the parts of a message with `---`. They are plain strings, so they are
// rendered as such: a list only when there is more than one, and no bullet for a single line.
const renderFeedbackMessage = message => {
  const parts = String(message ?? '')
    .split('---')
    .map(part => part.trim())
    .filter(Boolean)

  if (parts.length === 0) return null
  if (parts.length === 1) return <p style={{ margin: 0 }}>{parts[0]}</p>

  return (
    <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
      {parts.map(part => (
        <li key={part}>{part}</li>
      ))}
    </ul>
  )
}

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
    return <Spinner fullHeight spinnerColor={colors.ink} size={60} />
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
                <div data-cy="debug-test-feedback">
                  <h4 style={{ fontWeight: 600, marginBottom: '0.5em' }}>Feedback:</h4>
                  {renderFeedbackMessage(feedback.message)}
                </div>
                <AppTable plain data-cy="debug-test-feature-table" sx={FEATURE_TABLE_SX}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" style={{ width: '40%' }}>
                        Feature
                      </TableCell>
                      <TableCell align="center" style={{ width: '30%' }}>
                        Correct answer
                      </TableCell>
                      <TableCell align="center" style={{ width: '30%' }}>
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
                        const valueSx = {
                          backgroundColor: isMatch ? CORRECT_BG : MISMATCH_BG,
                          fontWeight: isMatch ? 400 : 600,
                        }
                        return (
                          <TableRow key={key}>
                            <TableCell align="left" sx={valueSx}>
                              {key}
                            </TableCell>
                            <TableCell align="center" sx={valueSx}>
                              {(feedback.true_features[key] || '—').toString()}
                            </TableCell>
                            <TableCell align="center" sx={valueSx}>
                              {(feedback.user_features[key] || '—').toString()}
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
