import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useIntl, FormattedMessage } from 'react-intl'
import { updateEnableRecmd } from 'Utilities/redux/userReducer'
import AppCheckbox from 'Components/ui/AppCheckbox'
import CustomTooltip from 'Components/CustomTooltip'

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
      <AppCheckbox
        className="interactable"
        sx={{ p: 0, mt: '0.15em', mr: '0.5em' }}
        onChange={updatePreferences}
        checked={!enable_recmd}
        disabled={userPending}
      />
      <span style={{ color: '#708090' }}>
        <FormattedMessage id="never-show-recommendations" />
      </span>
      <CustomTooltip permanent title={intl.formatMessage({ id: 'disable-recmd-tooltip' })}>
        <InfoOutlinedIcon
          className="interactable"
          fontSize="small"
          sx={{ ml: '0.5em', color: 'grey' }}
        />
      </CustomTooltip>
    </div>
  )
}

export default TurnOffRecommendations
