import React from 'react'
import { FormattedMessage } from 'react-intl'
import AppButton from 'Components/AppButton'

const OpenConceptsWidget = ({
  expandConcepts,
  collapseConcepts,
  setExpandConcepts,
  setCollapseConcepts,
}) => {
  const open = () => {
    setExpandConcepts(!expandConcepts)
  }

  const close = () => {
    setCollapseConcepts(!collapseConcepts)
  }

  return (
    <div className="flex" style={{ marginBottom: '0.5rem' }}>
      <AppButton style={{ marginLeft: '1rem', marginTop: '0.5rem' }} onClick={open} size="sm">
        <FormattedMessage id="expand-all-concepts" />
      </AppButton>
      <AppButton style={{ marginLeft: '1rem', marginTop: '0.5rem' }} onClick={close} size="sm">
        <FormattedMessage id="collapse-all-concepts" />
      </AppButton>
    </div>
  )
}

export default OpenConceptsWidget
