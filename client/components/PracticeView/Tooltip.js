import React from 'react'
import { usePopperTooltip } from 'react-popper-tooltip'
import 'react-popper-tooltip/dist/styles.css'

// Usage:
// additionalClassnames defines the varians of the Tooptip

const Tooltip = ({ children, tooltip, hideArrow, additionalClassnames = '', ...props }) => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip(props)

  return (
    <>
      <span ref={setTriggerRef} className="trigger">
        {children}
      </span>

      {visible && (
        <div
          {...getTooltipProps({
            ref: setTooltipRef,
            className: `tooltip-container ${additionalClassnames}`,
          })}
        >
          {!hideArrow && (
            <div
              {...getArrowProps({
                className: 'tooltip-arrow',
              })}
            />
          )}
          {tooltip}
        </div>
      )}
    </>
  )
}

export default Tooltip
