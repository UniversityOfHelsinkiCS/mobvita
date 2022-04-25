import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'semantic-ui-react'

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
      <Button onClick={open}>
        <FormattedMessage id="expand-all-concepts" />
      </Button>
      <Button onClick={close}>
        <FormattedMessage id="collapse-all-concepts" />
      </Button>
    </div>
  )
}

export default OpenConceptsWidget
