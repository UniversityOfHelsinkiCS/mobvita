import React from 'react'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import { styled } from '@mui/material/styles'
import { colors } from 'Assets/mui_theme/designTokens'

/**
 * AppTable — design-system data table (MUI `Table`, not react-bootstrap's).
 *
 * BY DEFAULT the table is filled: a sage-green header row (`colors.green`) over cream body rows
 * (`colors.card`), with the outer corners rounded. Pass `plain` for the old unfilled look —
 * transparent rows separated only by a hairline — when the table sits on a surface that already
 * supplies its own colour.
 *
 * Flags mirror the bootstrap `<Table striped bordered hover responsive size="sm">` this replaced:
 *
 *   plain    - opt out of the filled header/body colours
 *   striped  - alternate body rows get a slightly deeper cream
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
// Derived — no table stripe in designTokens; one notch deeper than the cream card colour.
const STRIPE = '#F1EEDA'
const RADIUS = 12

const SIZE_WIDTHS = { full: '100%', auto: 'auto' }
const DENSITIES = { compact: 'small', standard: 'medium' }

// A named size, else a raw CSS width (number ⇒ px, string ⇒ verbatim).
const resolveWidth = size =>
  SIZE_WIDTHS[size] ?? (typeof size === 'number' ? `${size}px` : size)

const StyledTable = styled(Table, {
  shouldForwardProp: prop =>
    !['filled', 'striped', 'bordered', 'hoverable', 'tableWidth'].includes(prop),
})(({ filled, striped, bordered, hoverable, tableWidth }) => ({
  width: tableWidth,
  borderCollapse: 'separate',
  borderSpacing: 0,
  '& .MuiTableCell-root': {
    color: colors.ink,
    borderBottom: `1px solid ${colors.border}`,
    ...(bordered && { border: `1px solid ${colors.border}` }),
  },
  '& .MuiTableCell-head': { fontWeight: 600 },
  // Fills go on the ROW so `striped` and `hover` (declared after) can override the body colour;
  // MUI's cells are transparent by default, so the row colour shows through.
  ...(filled && {
    '& .MuiTableHead-root .MuiTableRow-root': { backgroundColor: colors.green },
    '& .MuiTableBody-root .MuiTableRow-root': { backgroundColor: colors.card },
    // Round the outer corners by rounding the corner cells — the table itself can't be clipped
    // without also clipping a horizontally scrolling body.
    '& .MuiTableHead-root .MuiTableRow-root .MuiTableCell-root:first-of-type': {
      borderTopLeftRadius: RADIUS,
    },
    '& .MuiTableHead-root .MuiTableRow-root .MuiTableCell-root:last-of-type': {
      borderTopRightRadius: RADIUS,
    },
    '& .MuiTableBody-root .MuiTableRow-root:last-of-type .MuiTableCell-root': {
      borderBottom: 'none',
      '&:first-of-type': { borderBottomLeftRadius: RADIUS },
      '&:last-of-type': { borderBottomRightRadius: RADIUS },
    },
  }),
  ...(striped && {
    '& .MuiTableBody-root .MuiTableRow-root:nth-of-type(odd)': { backgroundColor: STRIPE },
  }),
  ...(hoverable && {
    '& .MuiTableBody-root .MuiTableRow-root:hover': { backgroundColor: colors.menuHover },
  }),
}))

const AppTable = ({
  plain = false,
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
      filled={!plain}
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
