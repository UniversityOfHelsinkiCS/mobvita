import React from 'react'
import { FormattedMessage } from 'react-intl'

export default ({ translationId, children }) => (
  <tr>
    <td>
      <FormattedMessage id={translationId} />
    </td>
    <td style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
      {children}
    </td>
  </tr>
)