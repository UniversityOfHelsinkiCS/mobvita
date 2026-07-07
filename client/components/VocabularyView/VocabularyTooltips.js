import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React from 'react'
import { useSelector } from 'react-redux'
import { useIntl } from 'react-intl';
import InfoTooltip from 'Components/InfoTooltip'

const VocabularyTooltips = ({ graphType }) => {
  const { interfaceLanguage } = useSelector(({ user }) => user.data.user)
  const intl = useIntl()

  return (
    <div className="flex">
      <span
        style={{ display: 'inline-block', paddingRight: '0.75em', marginBottom: '0.35em', marginLeft: '12em' }}
      >
        <InfoTooltip
          title={
            <div>
              <b>{intl.formatMessage({ id: 'mastered-words' })}</b>
              {': '}
              <FormattedHTMLMessage id="overview-vocabulary-explanation" />
            </div>
          }
        />
      </span>
      <span
        style={{ display: 'inline-block', paddingRight: '0.75em', marginBottom: '0.35em', marginLeft: '7em' }}
      >
        <InfoTooltip
          title={
            <div>
              <b>{intl.formatMessage({ id: 'vocabulary-total' })}</b>
              {': '}
              <FormattedHTMLMessage id="vocabulary-total-explanation" />
            </div>
          }
        />
      </span>
      {/*
      <span
        style={{ display: 'inline-block', paddingRight: '0.75em', marginBottom: '0.35em', marginLeft: '8em' }}
      >
        <InfoTooltip
          title={
            <div>
              <b>{intl.formatMessage({ id: 'vocabulary-seen' })}</b>
              {': '}
              <FormattedHTMLMessage id="vocabulary-seen-explanation" />
            </div>
          }
        />
      </span>
      <span
        style={{ display: 'inline-block', paddingRight: '0.75em', marginBottom: '0.35em', marginLeft: '8em' }}
      >
        <InfoTooltip
          title={
            <div>
              <b>{intl.formatMessage({ id: 'vocabulary-visit' })}</b>
              {': '}
              <FormattedHTMLMessage id="vocabulary-visit-explanation" />
            </div>
          }
        />
      </span>
      */}
      <span
        style={{
          display: 'inline-block',
          paddingRight: '0.75em',
          marginBottom: '0.35em',
          marginLeft: '7em',
          marginRight:
            interfaceLanguage === 'Finnish' && graphType === 'column mastered' ? '8em' : '15em',
        }}
      >
        <InfoTooltip
          title={
            <div>
              <b>{intl.formatMessage({ id: 'vocabulary-flashcard' })}</b>
              {': '}
              <FormattedHTMLMessage id="vocabulary-flashcard-explanation" />
            </div>
          }
        />
      </span>
    </div>
  )
}

export default VocabularyTooltips
