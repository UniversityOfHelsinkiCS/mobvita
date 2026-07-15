import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import AppButton from 'Components/AppButton'

export const CustomButton = ({ condition = true, translationId, ...props }) => {
  if (!condition) return null

  return (
    <AppButton {...props} style={{ marginBottom: '.1em' }}>
      <FormattedMessage id={translationId} />
    </AppButton>
  )
}

export const LinkButton = ({ ...props }) => <CustomButton as={Link} {...props} />
