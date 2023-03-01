import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import JoyRide, { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { useSelector, useDispatch } from 'react-redux'
import { handleNextTourStep, stopTour } from 'Utilities/redux/tourReducer'
import { FormattedMessage } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import { homeTourSteps, libraryTourSteps, progressTourSteps, confettiRain, practiceTourSteps } from 'Utilities/common'

const Tour = () => {
  const dispatch = useDispatch()
  const tourState = useSelector(({ tour }) => tour)
  const history = useHistory()

  const bigScreen = useWindowDimensions().width >= 700

  const callback = data => {
    const { action, index, type, status } = data
    //console.log(action)

    if (
      action === ACTIONS.CLOSE ||
      (status === STATUS.SKIPPED && tourState.run) ||
      status === STATUS.FINISHED
    ) {
      dispatch(stopTour())
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // desktop
      if (bigScreen) {
        if (tourState.steps === homeTourSteps && !history.location.pathname.includes('/home')) {
          history.push('/home') // This statement pushes the use to home page if tour is started
          // on a page that doesnt have a tour
        }

        // home tour
        if (tourState.steps === homeTourSteps && index === 1) {
          confettiRain()
          confettiRain()
          setTimeout(() => {
            confettiRain()
          }, 400)
          setTimeout(() => {
            confettiRain()
          }, 600)
          setTimeout(() => {
            confettiRain()
          }, 800)
        }

        // progress tour tour step index related desktop actions
        if (tourState.steps === progressTourSteps) {
          dispatch({ type: 'CLOSE_PROFILE_DROPDOWN' })
          if (index === 0) {
            dispatch({ type: 'SET_TIMELINE_CHART' })
          }
          if (index === 2) {
            dispatch({ type: 'SET_VOCABULARY_CHART' })
          }
          if (index === 3) {
            dispatch({ type: 'SET_GRAMMAR_CHART' })
          }
          if (index === 4) {
            dispatch({ type: 'SET_EXERCISE_HISTORY_CHART' })
          }
          if (index === 5) {
            dispatch({ type: 'SET_TEST_HISTORY_CHART' })
          }
          if (index === 7) {
            dispatch({ type: 'SET_TIMELINE_CHART' })
          }
        }

        // practice tour steps
        if (tourState.steps === practiceTourSteps) {
          if (index === 2) {
            dispatch({ type: 'SHOW_PRACTICE_DROPDOWN' })
          }
          if (index === 3) {
            dispatch({ type: 'CLOSE_PRACTICE_DROPDOWN' })
            const currentPath = history.location.pathname
            const newPath = currentPath.substring(0, currentPath.length - 7)
            history.push(`${newPath}practice/`)
          }
        }

        dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))

        // mobile
      } else {
        // home tour control
        if (tourState.steps === homeTourSteps) {
          if (index === 0) {
            dispatch(sidebarSetOpen(false))
            if (!history.location.pathname.includes('/home')) {
              history.push('/home')
            }
          } else if (index === 1 || index === 8) {
            dispatch(sidebarSetOpen(true))

            setTimeout(() => {
              dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
            }, 600)
            return
          } else if (index === 2) {
            confettiRain()
            confettiRain()
            setTimeout(() => {
              confettiRain()
            }, 400)
            setTimeout(() => {
              confettiRain()
            }, 600)
            setTimeout(() => {
              confettiRain()
            }, 800)
            dispatch(sidebarSetOpen(false))
          }
        }
        // library tour control
        if (tourState.steps === libraryTourSteps) {
          if (index === 3) {
            dispatch(sidebarSetOpen(true))

            setTimeout(() => {
              dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
              window.dispatchEvent(new Event('resize'))
            }, 600)
          }
        }
        // progress tour control
        if (tourState.steps === progressTourSteps) {
          if (index === 2) {
            dispatch(sidebarSetOpen(true))

            setTimeout(() => {
              dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
              window.dispatchEvent(new Event('resize'))
            }, 500)
          }
        }
        // practice tour control
        if (tourState.steps === practiceTourSteps) {
          if (index === 1) {
            dispatch({ type: 'SHOW_PRACTICE_DROPDOWN' })
          }
          if (index === 2) {
            dispatch({ type: 'CLOSE_PRACTICE_DROPDOWN' })
            const currentPath = history.location.pathname
            const newPath = currentPath.substring(0, currentPath.length - 7)
            history.push(`${newPath}practice/`)
          }
          if (index === 7) {
            dispatch(sidebarSetOpen(true))

            setTimeout(() => {
              dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
              window.dispatchEvent(new Event('resize'))
            }, 500)
          }
        }
        dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
      }
    }
  }

  return (
    <JoyRide
      {...tourState}
      callback={callback}
      disableScrolling={true}
      hideBackButton={true}
      showProgress={true}
      styles={{
        tooltipContainer: {
          textAlign: 'left',
        },
        options: {
          arrowColor: 'rgb(50, 170, 248)',
          primaryColor: 'rgb(50, 170, 248)',
          backgroundColor: 'white',
          zIndex: 1000,
          textColor: '#004a14',
        },
        buttonNext: {
          backgroundColor: 'rgb(50, 170, 248)',
          borderRadius: 8,
        },
      }}
      locale={{
        last: <FormattedMessage id="end-tour" />,
        next: <FormattedMessage id="next" />,
      }}
    />
  )
}

export default Tour
