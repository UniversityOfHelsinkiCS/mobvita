import React, { useState } from 'react'
import { Popper } from '@mui/material'

// Controlled popover anchored to `children`; only controlled-story words may open it.
// Callers' `trigger`, `onVisibilityChange`, `closeOnOutOfBoundaries` never took effect; ignored.
const Tooltip = ({
  children,
  tooltip,
  hideArrow,
  additionalClassnames = '',
  tooltipShown,
  isControlledStoryWord = false,
  placement = 'bottom',
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [arrowEl, setArrowEl] = useState(null)
  const open = Boolean(tooltipShown && isControlledStoryWord && anchorEl)

  return (
    <>
      <span ref={setAnchorEl} className="trigger">
        {children}
      </span>
      {/* Inline, not portalled, and offset 6px: what react-popper-tooltip rendered. */}
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        disablePortal
        className={`tooltip-container ${additionalClassnames}`}
        role="dialog"
        tabIndex={-1}
        style={{ zIndex: 1200, pointerEvents: 'auto' }}
        modifiers={[
          { name: 'offset', options: { offset: [0, 6] } },
          { name: 'arrow', enabled: !hideArrow, options: { element: arrowEl } },
        ]}
      >
        {!hideArrow && <div ref={setArrowEl} className="tooltip-arrow" />}
        {tooltip}
      </Popper>
    </>
  )
}

export default Tooltip
