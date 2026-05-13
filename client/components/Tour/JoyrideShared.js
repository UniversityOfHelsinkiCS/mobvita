/* eslint-disable no-unused-vars */
import React from 'react'
import { Joyride as JoyRide } from 'react-joyride'
import { FormattedMessage } from 'react-intl'

const styles = {
  tooltipContainer: { textAlign: 'left' },
  options: {
    arrowColor: 'rgb(50, 170, 248)',
    primaryColor: 'rgb(50, 170, 248)',
    backgroundColor: 'white',
    textColor: '#004a14',
  },
  buttonNext: { backgroundColor: 'rgb(50, 170, 248)', borderRadius: 8 },
}

const options = {
  buttons: ['close', 'primary'],
  showProgress: true,
  skipScroll: true,
  zIndex: 10000,
}

const locale = {
  last: <FormattedMessage id="end-tour" />,
  next: <FormattedMessage id="next" />,
}

// Thin wrapper around <JoyRide> that applies the project-wide tour styling,
// options and locale so each per-tour component only supplies its own steps
// and event handler. `tourKey` is used as React key to force a remount on
// restart.
const JoyrideShared = ({ steps, stepIndex, run, tourKey, continuous, onEvent }) => (
  <JoyRide
    key={tourKey}
    steps={steps}
    stepIndex={stepIndex}
    run={run}
    continuous={continuous}
    onEvent={onEvent}
    options={options}
    styles={styles}
    locale={locale}
  />
)

export default JoyrideShared