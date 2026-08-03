import React, { useState } from 'react'
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import AppDialog from 'Components/ui/AppDialog'
import { resetTests } from 'Utilities/redux/testReducer'

const ResultModal = ({ cefrLevel, adaptiveTestResults }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(true)

  const { A1, A2, B1, B2, C1, C2, overall } = adaptiveTestResults

  const skillLevelResults = [
    { ...A1, name: 'A1' },
    { ...A2, name: 'A2' },
    { ...B1, name: 'B1' },
    { ...B2, name: 'B2' },
    { ...C1, name: 'C1' },
    { ...C2, name: 'C2' },
  ]

  const getPercentCorrect = scoreObj => {
    if (scoreObj.total === 0) return 0

    return ((scoreObj.correct / scoreObj.total) * 100).toFixed(1)
  }

  const handleClose = () => {
    setOpen(false)
    dispatch(resetTests())
    navigate('/home')
  }

  return (
    <AppDialog open={open} onClose={handleClose} title={<FormattedMessage id="test-results" />}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <FormattedMessage id="question-level" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="correct-answers" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="total-number-of-answers" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="percentage-of-correct-answers" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {skillLevelResults.map(level => (
            <TableRow key={level.name}>
              <TableCell>{level.name}</TableCell>
              <TableCell>{level.correct}</TableCell>
              <TableCell>{level.total}</TableCell>
              <TableCell>{getPercentCorrect(level)} %</TableCell>
            </TableRow>
          ))}
          <TableRow sx={{ backgroundColor: '#e9f6ec' }}>
            <TableCell>
              <b>
                <FormattedMessage id="total" />
              </b>
            </TableCell>
            <TableCell>
              <b>{overall.correct}</b>
            </TableCell>
            <TableCell>
              <b>{overall.total}</b>
            </TableCell>
            <TableCell>
              <b>{getPercentCorrect(overall)} %</b>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {cefrLevel && (
        <div style={{ marginTop: 16 }}>
          <FormattedMessage id="your-estimated-cefr-level" />:{' '}
          <b>
            <span style={{ fontSize: '1.25em' }}>{cefrLevel}</span>
          </b>
        </div>
      )}
    </AppDialog>
  )
}

export default ResultModal
