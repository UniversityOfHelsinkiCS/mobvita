import React from 'react'
import { FormattedMessage } from 'react-intl'
import { TableCell, TableRow } from '@mui/material'

export default ({ translationId, children }) => (
  <TableRow>
    <TableCell>
      <FormattedMessage id={translationId} />
    </TableCell>
    <TableCell style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
      {children}
    </TableCell>
  </TableRow>
)
