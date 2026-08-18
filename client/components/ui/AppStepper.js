// eslint-disable-next-line no-unused-vars
import React from 'react'
import { colors, font } from 'Assets/mui_theme/designTokens'

/**
 * AppStepper — progress stepper (2026 design).
 *
 *   orientation="vertical" (default) — right-aligned label + numbered circle per row.
 *   orientation="horizontal"          — numbered circles in a row, label centred beneath.
 *
 * The current step's circle is filled green; every other step is a green-outlined circle. No
 * connecting lines. Controlled: `steps` (array of { label }) + `activeIndex` (0-based).
 */
const ROW_H = 54
const CIRCLE = 30

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

const AppStepper = ({ steps = [], activeIndex = 0, orientation = 'vertical' }) => {
  if (orientation === 'horizontal') {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', fontFamily: font.family }}>
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
            }}
          >
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
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: font.family }}>
      {steps.map((step, i) => (
        <div key={step.label} style={{ display: 'flex', alignItems: 'center', height: ROW_H }}>
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
