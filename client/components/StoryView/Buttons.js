import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

export const CustomButton = ({ condition = true, translationId, ...props }) => {
  if (!condition) return null

  return (
    <Button {...props}>
      <FormattedMessage id={translationId} />
    </Button>
  )
}

export const LinkButton = ({ ...props }) => <CustomButton as={Link} {...props} />
