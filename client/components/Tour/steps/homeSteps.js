/* eslint-disable no-unused-vars */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import Sparkle from 'react-sparkle'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { tourSign } from '../utils'

// Step blueprints for the Home tour, keyed by stable id.
export const stepBlueprints = {
  welcome: {
    target: '.tour-home-welcome',
    title: <FormattedMessage id="welcome" />,
    content: (
      <div className="tour-mobile-message">
        <FormattedHTMLMessage id="tour-welcome-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    skipBeacon: true,
  },
  // Points at the navbar hamburger; the sidebar itself stays closed.
  sideBar: {
    target: '.tour-home-sidebar',
    title: <FormattedMessage id="sidebar" />,
    content: (
      <div className="tour-mobile-message">
        <FormattedHTMLMessage id="tour-sidebar-message" />
      </div>
    ),
    textAlign: 'center',
    placement: 'bottom-start',
    disableScrolling: true,
    skipBeacon: true,
    styles: { options: { zIndex: 10000 } },
  },
  learningLanguage: {
    target: '.tour-home-learning-language',
    title: <FormattedMessage id="Learning-language" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-learning-language-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    skipBeacon: true,
    styles: { options: { zIndex: 10000 } },
  },
  addNewStories: {
    target: '.tour-home-add-new-stories',
    title: <FormattedMessage id="add-content" />,
    content: (
      <div className="tour-mobile-message">
        <Sparkle flicker={false} />
        <FormattedHTMLMessage id="tour-add-content-message" />
      </div>
    ),
    placement: 'top',
    skipBeacon: true,
    styles: {
      tooltipContainer: { textAlign: 'left' },
      options: {
        arrowColor: 'rgb(50, 170, 248)',
        primaryColor: 'rgb(50, 170, 248)',
        backgroundColor: 'rgb(50, 170, 248',
        zIndex: 1000,
        textColor: 'white',
      },
      buttonNext: { backgroundColor: 'white', borderRadius: 8, color: 'black' },
    },
  },
  library: {
    target: '.tour-home-library',
    title: <FormattedMessage id="Library" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-library-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    skipBeacon: true,
  },
  lesson: {
    target: '.tour-home-lesson',
    title: <FormattedMessage id="Lessons" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-lessons-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    skipBeacon: true,
  },
  practiceNow: {
    target: '.tour-home-practice-now',
    title: <FormattedMessage id="practice-now" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-practice-now-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    skipBeacon: true,
  },
  flashcards: {
    target: '.tour-home-flashcards',
    title: <FormattedMessage id="Flashcards" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-flashcards-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    skipBeacon: true,
  },
  progress: {
    target: '.tour-home-progress',
    title: <FormattedMessage id="Progress" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-progress-message" />
      </div>
    ),
    skipBeacon: true,
  },
  chatbot: {
    target: '.tour-home-chatbot',
    title: <FormattedMessage id="tour-chatbot-message-title" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-chatbot-message" />
      </div>
    ),
    skipBeacon: true,
    placementBeacon: 'left',
    placement: 'left',
  },
  // Points at the Help row in the left sidebar; HomeTour opens the sidebar for this step.
  help: {
    target: '.tour-home-help',
    title: <FormattedMessage id="tour-step9-HELP-header" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-step9-HELP-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'right',
    skipBeacon: true,
    styles: { options: { zIndex: 10000 } },
  },
  beginPracticing: {
    target: '.tour-home-begin-practicing',
    title: <FormattedMessage id="begin-practicing" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-begin-practicing-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'right',
    skipBeacon: true,
    styles: { options: { zIndex: 10000 } },
  },
}

export { homeOrder as STEP_ORDER } from './stepOrders'
