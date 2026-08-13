import React from 'react'
import { useDispatch } from 'react-redux'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CustomTooltip from 'Components/CustomTooltip'
import { FormattedMessage, useIntl } from 'react-intl';
import { setAnnotationsVisibility } from 'Utilities/redux/annotationsReducer'

const AnnotationsHiddenView = () => {
  const dispatch = useDispatch()
  const intl = useIntl()
  return (
    <div
      className="space-between"
      onClick={() => dispatch(setAnnotationsVisibility(true))}
      onKeyDown={() => dispatch(setAnnotationsVisibility(true))}
      role="button"
      tabIndex={0}
      data-cy="annotations-visibility-button"
    >
      <div className="header-3" style={{ fontWeight: '500' }}>
        <CustomTooltip permanent placement="top" keyId="annotations-popup-info-text">
          <InfoOutlinedIcon
            fontSize="small"
            sx={{ color: 'grey' }}
            data-cy="annotations-hidden-info-icon"
          />
        </CustomTooltip>{' '}
        <FormattedMessage id="notes-header" />
      </div>
      <KeyboardArrowDownIcon fontSize="large" />
    </div>
  )
}

export default AnnotationsHiddenView
