import React from 'react'
import { useDispatch } from 'react-redux'
import { emptyLastAddInfo } from 'Utilities/redux/groupsReducer'
import { FormattedMessage, useIntl } from 'react-intl'
import { Modal, Divider } from 'semantic-ui-react'

const ResultItem = ({ label, resultList }) => {
  return (
    <div style={{ marginTop: '1em' }}>
      <span className="bold" style={{ fontSize: '1.2em' }}>
        {label}
      </span>
      <ul>
        {resultList.map(email => (
          <li key={email}>{email}</li>
        ))}
      </ul>
    </div>
  )
}

const PeopleAddResultModal = ({ lastAddInfo }) => {
  const dispatch = useDispatch()
  const intl = useIntl()

  if (!lastAddInfo) return null

  return (
    <Modal
      dimmer="inverted"
      closeIcon={{ style: { top: '1rem', right: '2.5rem' }, color: 'black', name: 'close' }}
      open={!!lastAddInfo}
      onClose={() => dispatch(emptyLastAddInfo())}
    >
      <Modal.Header>
        <FormattedMessage id="summary" />
      </Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column', margin: '1em' }}>
        <ResultItem
          label={intl.formatMessage({ id: 'teachers-added-to-the-group' })}
          resultList={lastAddInfo[0].added_teachers}
        />
        <ResultItem
          label={intl.formatMessage({ id: 'teachers-awaiting-confirmation' })}
          resultList={lastAddInfo[0].to_be_confirmed_teachers}
        />
        <ResultItem
          label={intl.formatMessage({ id: 'teachers-not-registered-in-revita' })}
          resultList={lastAddInfo[0].failed_teachers}
        />
        <Divider />
        <ResultItem
          label={intl.formatMessage({ id: 'students-added-to-the-group' })}
          resultList={lastAddInfo[0].added_students}
        />
        <ResultItem
          label={intl.formatMessage({ id: 'students-awaiting-confirmation' })}
          resultList={lastAddInfo[0].to_be_confirmed_students}
        />
        <ResultItem
          label={intl.formatMessage({ id: 'students-not-registered-in-revita' })}
          resultList={lastAddInfo[0].failed_students}
        />
      </Modal.Content>
    </Modal>
  )
}

export default PeopleAddResultModal
