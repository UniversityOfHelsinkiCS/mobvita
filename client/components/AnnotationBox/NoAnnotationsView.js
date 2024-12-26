import React from 'react'
import { Icon, Popup } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl'

const NoAnnotationsView = ({ handleAnnotationBoxCollapse }) => {
  const intl = useIntl()
  const history = useHistory()

  const isPracticeMode = history.location.pathname.includes('practice')

  return (
    <div>
      <div
        className="space-between"
        onClick={handleAnnotationBoxCollapse}
        onKeyDown={handleAnnotationBoxCollapse}
        role="button"
        tabIndex={0}
      >
        <div>
          <div className="header-3" style={{ fontWeight: '500' }}>
            <Popup
                position="top center"
                content={<FormattedHTMLMessage id={'annotations-popup-info-text'} />}
                trigger={<Icon name="info circle" size="small" color="grey" />}
            />{' '}
            <FormattedMessage id="notes-header" />
          </div>
        </div>
        <Icon name="angle up" size="large" />
      </div>
      <div className="notes-info-text" style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>
        <FormattedMessage
          id={isPracticeMode ? 'notes-added-to-history-appear-here' : 'this-story-has-no-notes'}
        />
      </div>
    </div>
  )
}

export default NoAnnotationsView
