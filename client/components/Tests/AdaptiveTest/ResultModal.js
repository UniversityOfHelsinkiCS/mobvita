import React from 'react'
import { Modal, Table } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router'
import { resetTests } from 'Utilities/redux/testReducer'

const ResultModal = ({ cefrLevel, adaptiveTestResults }) => {
  const dispatch = useDispatch()
  const history = useHistory()

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
    dispatch(resetTests())
    history.push('/home')
  }

  return (
    <Modal
      size="tiny"
      defaultOpen
      onClose={handleClose}
      closeIcon={{ style: { top: '1rem', right: '2rem' }, color: 'black', name: 'close' }}
    >
      <Modal.Header>
        <FormattedMessage id="test-results" />
      </Modal.Header>
      <Modal.Content>
        <Table size="small" celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <FormattedMessage id="question-level" />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <FormattedMessage id="correct-answers" />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <FormattedMessage id="total-number-of-answers" />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <FormattedMessage id="percentage-of-correct-answers" />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {skillLevelResults.map(level => (
              <Table.Row>
                <Table.Cell>{level.name}</Table.Cell>
                <Table.Cell>{level.correct}</Table.Cell>
                <Table.Cell>{level.total}</Table.Cell>
                <Table.Cell>{getPercentCorrect(level)} %</Table.Cell>
              </Table.Row>
            ))}
            <Table.Row>
              <Table.Cell positive>
                <b>
                  <FormattedMessage id="total" />
                </b>
              </Table.Cell>
              <Table.Cell positive>
                <b>{overall.correct}</b>
              </Table.Cell>
              <Table.Cell positive>
                <b>{overall.total}</b>
              </Table.Cell>
              <Table.Cell positive>
                <b>{getPercentCorrect(overall)} %</b>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        {cefrLevel && (<div>
          <FormattedMessage id="your-estimated-cefr-level" />:{' '}
          <b>
            <span style={{ fontSize: '1.25em' }}>{cefrLevel}</span>
          </b>
        </div>)}
      </Modal.Content>
    </Modal>
  )
}

export default ResultModal
