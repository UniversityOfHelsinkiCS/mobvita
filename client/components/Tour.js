import React, { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import JoyRide, { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { libraryDropdownOpen } from 'Utilities/redux/libraryReducer'
import { useSelector, useDispatch } from 'react-redux'
import { updateToNonNewUser } from 'Utilities/redux/userReducer'
import { startTour, handleNextTourStep, stopTour } from 'Utilities/redux/tourReducer'
import { FormattedMessage } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import { homeTourSteps, libraryTourSteps } from 'Utilities/common'

const Tour = () => {
  const dispatch = useDispatch()
  const tourState = useSelector(({ tour }) => tour)
  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const history = useHistory()
  const location = useLocation()

  const bigScreen = useWindowDimensions().width >= 700

  useEffect(() => {
    // Auto start the tour if the user is anonymous and hasn't seen it before
    if (
      user.user.is_new_user &&
      history.location.pathname.includes('home')
    ) {
      dispatch(sidebarSetOpen(false))
      dispatch(startTour())
    }
  }, [location])

  const setTourViewed = () => {
    dispatch(updateToNonNewUser())
  }

  const callback = data => {
    const { action, index, type, status } = data

    if (
      action === ACTIONS.CLOSE ||
      (status === STATUS.SKIPPED && tourState.run) ||
      status === STATUS.FINISHED
    ) {
      setTourViewed()
      dispatch(stopTour())
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // desktop
      if (bigScreen) {
        if (tourState.steps === homeTourSteps && !history.location.pathname.includes('/home')) {
          history.push('/home')  // This statement pushes the use to home page if tour is started
          // on a page that doesnt have a tour
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
          } else if (index === 1) {
            dispatch(sidebarSetOpen(true))
  
            setTimeout(() => {
              dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
            }, 600)
            return
          } else if (index === 2) {
            dispatch(sidebarSetOpen(false))
          }
        }
        // library tour control
        if (tourState.steps === libraryTourSteps) {
          console.log(index)
          if (index === 2) {
            dispatch(libraryDropdownOpen(true))
          } else {
            dispatch(libraryDropdownOpen(false))
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
      styles={{
        tooltipContainer: {
          textAlign: 'left',
        },
        options: {
          arrowColor: 'rgb(50, 170, 248)',
          primaryColor: 'rgb(50, 170, 248)',
          zIndex: 1000,
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
