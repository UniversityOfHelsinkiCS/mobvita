import React from 'react'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

const tourSteps = [
  {
    target: '.tour-start-finish',
    title: <FormattedMessage id="welcome" />,
    content: <FormattedHTMLMessage id="tour-welcome-message" />,
    disableBeacon: true,
    hideBackButton: true,
    showProgress: true,
  },
  {
    target: '.tour-sidebar',
    title: <FormattedMessage id="sidebar" />,
    content: <FormattedHTMLMessage id="tour-sidebar-message" />,
    textAlign: 'center',
    placement: 'bottom',
    disableBeacon: true,
    hideBackButton: true,
    showProgress: true,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    target: '.tour-learning-language',
    title: <FormattedMessage id="Learning-language" />,
    content: <FormattedHTMLMessage id="tour-learning-language-message" />,
    placement: 'right',
    placementBeacon: 'left',
    disableBeacon: true,
    hideBackButton: true,
    showProgress: true,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    target: '.tour-practice-now',
    title: <FormattedMessage id="practice-now" />,
    content: <FormattedHTMLMessage id="tour-practice-now-message" />,
    placement: 'right',
    placementBeacon: 'left',
    disableBeacon: true,
    hideBackButton: true,
    showProgress: true,
  },

  {
    target: '.tour-flashcards',
    title: <FormattedMessage id="Flashcards" />,
    content: <FormattedHTMLMessage id="tour-flashcards-message" />,
    placement: 'right',
    placementBeacon: 'left',
    disableBeacon: true,
    showProgress: true,
    hideBackButton: true,
  },
  {
    target: '.tour-library',
    title: <FormattedMessage id="Library" />,
    content: <FormattedHTMLMessage id="tour-library-message" />,
    placement: 'right',
    placementBeacon: 'left',
    disableBeacon: true,
    hideBackButton: true,
    showProgress: true,
  },
  {
    target: '.tour-add-new-stories',
    title: <FormattedMessage id="add-content" />,
    content: <FormattedHTMLMessage id="tour-add-content-message" />,
    placement: 'top',
    disableBeacon: true,
    hideBackButton: true,
    showProgress: true,
  },
  {
    target: '.tour-start-finish',
    title: <FormattedMessage id="begin-practicing" />,
    content: <FormattedHTMLMessage id="tour-begin-practicing-message" />,
    placement: 'top',
    opacity: 0,
    disableBeacon: true,
    hideBackButton: true,
  },
]

const initialState = {
  key: new Date(), // This field makes the tour to re-render when we restart the tour
  run: false,
  continuous: true,
  loading: false,
  stepIndex: 0,
  steps: tourSteps,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'START':
      return { ...state, run: true }
    case 'RESET':
      return { ...state, stepIndex: 0 }
    case 'STOP':
      return { ...state, run: false }
    case 'NEXT_OR_PREV':
      return { ...state, ...action.payload }
    case 'RESTART':
      return {
        ...state,
        stepIndex: 0,
        run: true,
        loading: false,
        key: new Date(),
      }
    default:
      return state
  }
}
