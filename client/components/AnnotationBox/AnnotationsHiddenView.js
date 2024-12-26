import React from 'react'
import { useDispatch } from 'react-redux'
import { Icon, Popup } from 'semantic-ui-react'
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl'
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
        <Popup
          position="top center"
          content={<FormattedHTMLMessage id={'annotations-popup-info-text'} />}
          trigger={<Icon name="info circle" size="small" color="grey" />}
        />{' '}
        <FormattedMessage id="notes-header" />
      </div>
      <Icon name="angle down" size="large" />
    </div>
  )
}

export default AnnotationsHiddenView
