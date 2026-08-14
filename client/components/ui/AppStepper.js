// eslint-disable-next-line no-unused-vars
import React from 'react'
import { colors, font } from 'Assets/mui_theme/designTokens'

/**
 * AppStepper — vertical progress stepper (2026 design; see the lesson-setup mockup).
 *
 * Each step is a right-aligned label + a numbered circle. The current step's circle is filled
 * green; every other step is a green-outlined circle.
 *
 * Controlled: `steps` (array of { label }) + `activeIndex` (0-based current step).
 */
const ROW_H = 54
const CIRCLE = 30

const AppStepper = ({ steps = [], activeIndex = 0 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', fontFamily: font.family }}>
    {steps.map((step, i) => {
      const active = i === activeIndex
      return (
        <div key={step.label} style={{ display: 'flex', alignItems: 'center', height: ROW_H }}>
          <span
            style={{
              flex: 1,
              textAlign: 'right',
              marginRight: 14,
              fontSize: 15,
              fontWeight: active ? 600 : 500,
              color: colors.ink,
              whiteSpace: 'nowrap',
            }}
          >
            {step.label}
          </span>
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
            {i + 1}
          </span>
        </div>
      )
    })}
  </div>
)

export default AppStepper
