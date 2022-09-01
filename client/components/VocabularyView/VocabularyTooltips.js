import React from 'react'
import { Icon, Popup } from 'semantic-ui-react'
import { useSelector } from 'react-redux'
import { FormattedHTMLMessage, useIntl } from 'react-intl'

const VocabularyTooltips = ({ graphType }) => {
  const { interfaceLanguage } = useSelector(({ user }) => user.data.user)
  const intl = useIntl()

  return (
    <div className="flex">
      <Popup
        content={
          <div>
            <b>{intl.formatMessage({ id: 'mastered-words' })}</b>
            {': '}
            <FormattedHTMLMessage id="overview-vocabulary-explanation" />
          </div>
        }
        trigger={
          <Icon
            style={{ paddingRight: '0.75em', marginBottom: '0.35em', marginLeft: '12em' }}
            name="info circle"
            color="grey"
          />
        }
      />
      <Popup
        content={
          <div>
            <b>{intl.formatMessage({ id: 'vocabulary-total' })}</b>
            {': '}
            <FormattedHTMLMessage id="vocabulary-total-explanation" />
          </div>
        }
        trigger={
          <Icon
            style={{ paddingRight: '0.75em', marginBottom: '0.35em', marginLeft: '7em' }}
            name="info circle"
            color="grey"
          />
        }
      />
      {/* 
      <Popup
        content={
          <div>
            <b>{intl.formatMessage({ id: 'vocabulary-seen' })}</b>
            {': '}
            <FormattedHTMLMessage id="vocabulary-seen-explanation" />
          </div>
        }
        trigger={
          <Icon
            style={{ paddingRight: '0.75em', marginBottom: '0.35em', marginLeft: '8em' }}
            name="info circle"
            color="grey"
          />
        }
      />
      <Popup
        content={
          <div>
            <b>{intl.formatMessage({ id: 'vocabulary-visit' })}</b>
            {': '}
            <FormattedHTMLMessage id="vocabulary-visit-explanation" />
          </div>
        }
        trigger={
          <Icon
            style={{ paddingRight: '0.75em', marginBottom: '0.35em', marginLeft: '8em' }}
            name="info circle"
            color="grey"
          />
        }
      />
      */}
      <Popup
        content={
          <div>
            <b>{intl.formatMessage({ id: 'vocabulary-flashcard' })}</b>
            {': '}
            <FormattedHTMLMessage id="vocabulary-flashcard-explanation" />
          </div>
        }
        trigger={
          <Icon
            style={{
              paddingRight: '0.75em',
              marginBottom: '0.35em',
              marginLeft: '7em',
              marginRight:
                interfaceLanguage === 'Finnish' && graphType === 'column mastered' ? '8em' : '15em',
            }}
            name="info circle"
            color="grey"
          />
        }
      />
    </div>
  )
}

export default VocabularyTooltips
