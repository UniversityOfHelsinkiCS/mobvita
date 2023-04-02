import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Popup, Icon } from 'semantic-ui-react'
import { useIntl, FormattedMessage } from 'react-intl'
import { updateEnableRecmd } from 'Utilities/redux/userReducer'
import { Form } from 'react-bootstrap'


const TurnOffRecommendations = () => {
  const { pending: userPending } = useSelector(({ user }) => user)
  const { enable_recmd } = useSelector(({ user }) => user.data.user)
  const dispatch = useDispatch()
  const intl = useIntl()

  const updatePreferences = () => {
    dispatch(updateEnableRecmd(!enable_recmd))
  }

  return (
    <div className="flex pt-lg">
      <Form.Group>
        <Form.Check
          className="interactable"
          style={{ marginTop: '0.15em' }}
          type="checkbox"
          inline
          onChange={updatePreferences}
          checked={!enable_recmd}
          disabled={userPending}
        />
      </Form.Group>
      <span style={{ color: '#708090' }}>
        <FormattedMessage id="never-show-recommendations" />
      </span>
      <Popup
        className="interactable"
        content={intl.formatMessage({ id: 'disable-recmd-tooltip' })}
        trigger={
          <Icon
            className="interactable"
            style={{ marginLeft: '0.5em' }}
            name="info circle"
            color="grey"
          />
        }
      />
    </div>
  )
}

export default TurnOffRecommendations