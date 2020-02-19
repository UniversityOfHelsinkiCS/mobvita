import React from 'react'
import TooltipTrigger from 'react-popper-tooltip'
import 'react-popper-tooltip/dist/styles.css'


// Usage:
// additionalClassnames defines the varians of the Tooptip

const Tooltip = ({ children, tooltip, hideArrow, additionalClassnames = '', ...props }) => (

  <TooltipTrigger
    {...props}
    tooltip={({
      arrowRef,
      tooltipRef,
      getArrowProps,
      getTooltipProps,
      placement,
    }) => (
      <div
        {...getTooltipProps({
          ref: tooltipRef,
          className: `overlay tooltip-container ${additionalClassnames}`,
        })}
      >
        {!hideArrow && (
        <div
          {...getArrowProps({
            ref: arrowRef,
            className: 'tooltip-arrow',
            'data-placement': placement,
          })}
        />
        )}
        {tooltip}
      </div>
    )}
  >
    {({ getTriggerProps, triggerRef }) => (
      <span
        {...getTriggerProps({
          ref: triggerRef,
          className: 'trigger',
        })}
      >
        {children}
      </span>
    )}
  </TooltipTrigger>
)

export default Tooltip
