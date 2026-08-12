import React, { useState } from 'react'
import { Card, Collapse } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { colors, font } from 'Assets/mui_theme/designTokens'

const CollapsingList = ({ header, children }) => {
  const [open, setOpen] = useState(false)
  const CaretIcon = open ? ArrowDropDownIcon : ArrowRightIcon

  return (
    <Card sx={{ mb: '0.2rem', backgroundColor: colors.card, fontFamily: font.family }}>
      <div
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25em',
          padding: '0.75rem 1.25rem',
          borderBottom: `1px solid ${colors.border}`,
          color: colors.ink,
        }}
        onClick={() => setOpen(!open)}
        onKeyPress={() => setOpen(!open)}
        role="button"
        tabIndex={0}
        aria-expanded={open}
      >
        <CaretIcon />
        {header}
      </div>
      <Collapse in={open}>{children}</Collapse>
    </Card>
  )
}

export default CollapsingList
