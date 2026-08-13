import React from 'react'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import { styled } from '@mui/material/styles'
import { colors, font } from 'Assets/mui_theme/designTokens'

/**
 * AppTable — design-system data table (MUI `Table`, not react-bootstrap's). Replaces the bootstrap
 * `<Table striped bordered hover responsive size="sm">` call sites, so the flags mirror those:
 *
 *   striped  - alternate rows get the cream stripe
 *   bordered - every cell gets a green hairline (otherwise only the row separator)
 *   hover    - rows highlight on hover (pair with a row `onClick`)
 *
 * Width and row height are two separate knobs. MUI's own `Table` calls the row-height one `size`,
 * which reads like it means dimensions; here `size` means what it says and the other is `density`:
 *
 *   size     - how wide the table is: "full" (default — fills its container) or "auto" (shrink to
 *              content). Also takes a raw width: a number for px, or a string like "50%" / "30em".
 *   density  - how tall the rows are: "compact" (default — the old bootstrap `size="sm"`, 6px cell
 *              padding) or "standard" (16px).
 *
 * Always horizontally scrollable (bootstrap's `responsive`) via the `TableContainer` wrapper —
 * pass `containerProps` to style it.
 *
 * Compose with MUI's `TableHead` / `TableBody` / `TableRow` / `TableCell` as children.
 */
// Derived — no table stripe in designTokens; a cream one notch off the card colour.
const STRIPE = '#F4F2E7'

const SIZE_WIDTHS = { full: '100%', auto: 'auto' }
const DENSITIES = { compact: 'small', standard: 'medium' }

// A named size, else a raw CSS width (number ⇒ px, string ⇒ verbatim).
const resolveWidth = size =>
  SIZE_WIDTHS[size] ?? (typeof size === 'number' ? `${size}px` : size)

const StyledTable = styled(Table, {
  shouldForwardProp: prop =>
    !['striped', 'bordered', 'hoverable', 'tableWidth'].includes(prop),
})(({ striped, bordered, hoverable, tableWidth }) => ({
  fontFamily: font.family,
  width: tableWidth,
  '& .MuiTableCell-root': {
    fontFamily: font.family,
    color: colors.ink,
    borderBottom: `1px solid ${colors.border}`,
    ...(bordered && { border: `1px solid ${colors.border}` }),
  },
  '& .MuiTableCell-head': { fontWeight: 600 },
  ...(striped && {
    '& .MuiTableBody-root .MuiTableRow-root:nth-of-type(odd)': { backgroundColor: STRIPE },
  }),
  ...(hoverable && {
    '& .MuiTableBody-root .MuiTableRow-root:hover': { backgroundColor: colors.menuHover },
  }),
}))

const AppTable = ({
  size = 'full',
  density = 'compact',
  striped = false,
  bordered = false,
  hover = false,
  containerProps,
  children,
  ...rest
}) => (
  <TableContainer {...containerProps}>
    <StyledTable
      striped={striped}
      bordered={bordered}
      hoverable={hover}
      tableWidth={resolveWidth(size)}
      size={DENSITIES[density] || density}
      {...rest}
    >
      {children}
    </StyledTable>
  </TableContainer>
)

export default AppTable
