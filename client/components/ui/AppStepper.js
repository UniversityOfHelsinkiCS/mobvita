// eslint-disable-next-line no-unused-vars
import React from 'react'
import { colors } from 'Assets/mui_theme/designTokens'

/**
 * AppStepper — progress stepper (2026 design).
 *
 *   orientation="vertical" (default) — right-aligned label + numbered circle per row.
 *   orientation="horizontal"          — numbered circles in a row, label centred beneath.
 *
 * The current step's circle is filled green; every other step is a green-outlined circle.
 * `connected` joins the circles with a line in the same green and width as their borders (default:
 * no lines). Controlled: `steps` (array of { label }) + `activeIndex` (0-based).
 */
const ROW_H = 54
const CIRCLE = 30
const LINE = 2

// One half of the line between two circles. Each step draws the halves on its own sides (none
// before the first step, none after the last); neighbouring halves meet at the step boundary, and
// every half stops at its circle's border, so the line never crosses a circle.
const Connector = ({ style }) => (
  <span aria-hidden style={{ position: 'absolute', backgroundColor: colors.green, ...style }} />
)

const horizontalConnectors = (i, count) => {
  const common = { top: CIRCLE / 2 - LINE / 2, height: LINE, width: `calc(50% - ${CIRCLE / 2}px)` }
  return (
    <>
      {i > 0 && <Connector style={{ ...common, left: 0 }} />}
      {i < count - 1 && <Connector style={{ ...common, right: 0 }} />}
    </>
  )
}

const verticalConnectors = (i, count) => {
  // The circle is the row's last item, so its centre is CIRCLE / 2 in from the right edge.
  const common = {
    right: CIRCLE / 2 - LINE / 2,
    width: LINE,
    height: `calc(50% - ${CIRCLE / 2}px)`,
  }
  return (
    <>
      {i > 0 && <Connector style={{ ...common, top: 0 }} />}
      {i < count - 1 && <Connector style={{ ...common, bottom: 0 }} />}
    </>
  )
}

const StepCircle = ({ index, active }) => (
  <span
    style={{
      width: CIRCLE,
      height: CIRCLE,
      flexShrink: 0,
      borderRadius: '50%',
      border: `2px solid ${colors.green}`,
      backgroundColor: active ? colors.green : 'transparent',
      color: colors.ink,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      fontWeight: 600,
    }}
  >
    {index + 1}
  </span>
)

const AppStepper = ({
  steps = [],
  activeIndex = 0,
  orientation = 'vertical',
  connected = false,
}) => {
  if (orientation === 'horizontal') {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {steps.map((step, i) => (
          <div
            key={step.label}
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: '0 6px',
              position: 'relative',
            }}
          >
            {connected && horizontalConnectors(i, steps.length)}
            <StepCircle index={i} active={i === activeIndex} />
            <span
              style={{
                textAlign: 'center',
                fontSize: 13,
                fontWeight: i === activeIndex ? 600 : 500,
                color: colors.ink,
                lineHeight: 1.3,
              }}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {steps.map((step, i) => (
        <div
          key={step.label}
          style={{ display: 'flex', alignItems: 'center', height: ROW_H, position: 'relative' }}
        >
          {connected && verticalConnectors(i, steps.length)}
          <span
            style={{
              flex: 1,
              textAlign: 'right',
              marginRight: 14,
              fontSize: 15,
              fontWeight: i === activeIndex ? 600 : 500,
              color: colors.ink,
              whiteSpace: 'nowrap',
            }}
          >
            {step.label}
          </span>
          <StepCircle index={i} active={i === activeIndex} />
        </div>
      ))}
    </div>
  )
}

export default AppStepper
