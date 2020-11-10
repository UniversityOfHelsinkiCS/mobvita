import React from 'react'
import { FormattedMessage } from 'react-intl'

const Header = ({ translationId }) => (
  <h2 style={{ fontSize: '18px', color: '#5f5f5f' }}>
    <FormattedMessage id={translationId} />
  </h2>
)

export default Header
