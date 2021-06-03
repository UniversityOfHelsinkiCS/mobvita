import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'

export default ({ translationId, id, updateLibrarySelect, updateGroupSelect, children }) => {
  const history = useHistory()
  const dispatch = useDispatch()

  const handleButtonClick = async () => {
    await dispatch(updateGroupSelect(id))
    await dispatch(updateLibrarySelect('group'))
    history.push('/library')
  }

  return (
    <tr>
      <td>
        <FormattedMessage id={translationId} />
      </td>
      <td style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {children}
        {id && updateLibrarySelect && updateGroupSelect && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleButtonClick}
            style={{ marginLeft: '1em' }}
          >
            <FormattedMessage id="Stories" />
          </Button>
        )}
      </td>
    </tr>
  )
}
