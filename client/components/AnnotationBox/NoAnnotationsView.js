import React from 'react'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import CustomTooltip from 'Components/CustomTooltip'
import { useLocation } from 'react-router-dom'
import { FormattedMessage } from 'react-intl';

const NoAnnotationsView = ({ handleAnnotationBoxCollapse }) => {
  const location = useLocation()

  const isPracticeMode = location.pathname.includes('practice')

  return (
    <div>
      <div
        className="space-between"
        onClick={handleAnnotationBoxCollapse}
        onKeyDown={handleAnnotationBoxCollapse}
        role="button"
        tabIndex={0}
        data-cy="no-annotations-collapse-toggle"
      >
        <div>
          <div className="header-3" style={{ fontWeight: '500' }}>
            <CustomTooltip permanent placement="top" keyId="annotations-popup-info-text">
              <InfoOutlinedIcon fontSize="small" sx={{ color: 'grey' }} />
            </CustomTooltip>{' '}
            <FormattedMessage id="notes-header" />
          </div>
        </div>
        <KeyboardArrowUpIcon fontSize="large" />
      </div>
      <div
        className="notes-info-text"
        style={{ marginTop: '1.5em', marginBottom: '1.5em' }}
        data-cy="no-annotations-info-text"
      >
        <FormattedMessage
          id={isPracticeMode ? 'notes-added-to-history-appear-here' : 'this-story-has-no-notes'}
        />
      </div>
    </div>
  )
}

export default NoAnnotationsView
