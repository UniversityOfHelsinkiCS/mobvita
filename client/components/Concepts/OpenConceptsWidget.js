import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'

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
    <div className="flex">
      <Button style={{ marginLeft: '1rem', marginTop: '0.5rem' }} onClick={open} size="sm">
        <FormattedMessage id="expand-all-concepts" />
      </Button>
      <Button style={{ marginLeft: '1rem', marginTop: '0.5rem'}} onClick={close} size="sm">
        <FormattedMessage id="collapse-all-concepts" />
      </Button>
    </div>
  )
}

export default OpenConceptsWidget
