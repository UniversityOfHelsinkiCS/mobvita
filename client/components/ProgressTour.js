import React, { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import JoyRide, { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { useSelector, useDispatch } from 'react-redux'
import { updateToNonNewUser } from 'Utilities/redux/userReducer'
import { startProgressTour, stopProgressTour, handleNextProgressTourStep } from 'Utilities/redux/progresstourReducer'
import { FormattedMessage } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'

const ProgressTour = () => {
  const dispatch = useDispatch()
  const tourState = useSelector(({progresstour} ) => progresstour )
  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const history = useHistory()
  const location = useLocation()

  const bigScreen = useWindowDimensions().width >= 700

  useEffect(() => {
    // Auto start the tour if the user is anonymous and hasn't seen it before
    if (
      user.user.is_new_user &&
      history.location.pathname.includes('progress')
    ) {
      dispatch(sidebarSetOpen(false))
      dispatch(startProgressTour())
    }
  }, [location])

  const setTourViewed = () => {
    dispatch(updateToNonNewUser())
  }

  const callback = data => {
    const { action, index, type, status } = data
    console.log(action)

    if (
      action === ACTIONS.CLOSE ||
      (status === STATUS.SKIPPED && tourState.run) ||
      status === STATUS.FINISHED
    ) {
      setTourViewed()
      dispatch(stopProgressTour())
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // desktop
      if (bigScreen) {
        if (index === 0) {
          console.log("Ei löytynyt targettia")
          history.push('/profile/progress')
        }
        dispatch(handleNextProgressTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))

        // mobile
      } else {
        if (index === 0) {
          dispatch(sidebarSetOpen(false))
          history.push('/profile/progress')
        }
        if (index === 1) {
          dispatch(sidebarSetOpen(true))

          setTimeout(() => {
            dispatch(handleNextProgressTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
          }, 600)
          return
        }
        if (index === 2) {
          dispatch(sidebarSetOpen(false))
        }

        dispatch(handleNextProgressTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
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
        next: <FormattedMessage id="next" />,
      }}
    />
  )
}

export default ProgressTour
