import React from 'react'
import { usePopperTooltip } from 'react-popper-tooltip'
import 'react-popper-tooltip/dist/styles.css'

// Usage:
// additionalClassnames defines the varians of the Tooptip

const Tooltip = ({ children, tooltip, hideArrow, additionalClassnames = '', tooltipShown, isControlledStoryWord = false, ...props }) => {
  // Support legacy `tooltipShown` prop by mapping it to `visible` for usePopperTooltip
  const hookOptions = { ...props }
  if (typeof tooltipShown !== 'undefined') hookOptions.visible = tooltipShown
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip(hookOptions)

  // Only allow the tooltip to open when explicitly marked by controlled-story word
  const isVisible = Boolean(visible && isControlledStoryWord)

  return (
    <>
      <span ref={setTriggerRef} className="trigger">
        {children}
      </span>

      {isVisible && (
        <div
          {...getTooltipProps({
                      ref: setTooltipRef,
                      className: `tooltip-container ${additionalClassnames}`,
                      tabIndex: -1,
                      role: 'dialog',
                      style: { zIndex: 1200, pointerEvents: 'auto' }
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
