import React, { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import JoyRide, { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { useSelector, useDispatch } from 'react-redux'
import { updateToNonNewUser } from 'Utilities/redux/userReducer'
import { FormattedMessage } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'

const Tour = () => {
  const dispatch = useDispatch()
  const tourState = useSelector(({ tour }) => tour)
  const open = useSelector(({ sidebar }) => sidebar.open)
  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const history = useHistory()
  const location = useLocation()

  const bigScreen = useWindowDimensions().width >= 700

  useEffect(() => {
    // Auto start the tour if the user hasn't seen it before
    if (user.user.is_new_user && history.location.pathname.includes('home')) {
      dispatch(sidebarSetOpen(false))
      dispatch({ type: 'TOUR_START' })
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
      dispatch({ type: 'TOUR_STOP' })
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // desktop
      if (bigScreen) {
        if (index === 0) {
          history.push('/home')
        }
        dispatch({
          type: 'TOUR_NEXT_OR_PREV',
          payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) },
        })

        // mobile
      } else {
        if (index === 0) {
          dispatch(sidebarSetOpen(false))
          history.push('/home')
        }
        if (index === 1) {
          dispatch(sidebarSetOpen(true))

          setTimeout(() => {
            dispatch({
              type: 'TOUR_NEXT_OR_PREV',
              payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) },
            })
          }, 600)
          return
        }
        if (index === 2) {
          dispatch(sidebarSetOpen(false))
        }

        dispatch({
          type: 'TOUR_NEXT_OR_PREV',
          payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) },
        })
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
          arrowColor: '#4c91cd',
          primaryColor: '#4c91cd',
          zIndex: 1000,
        },
        buttonNext: {
          backgroundColor: '#4c91cd',
          borderRadius: 4,
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
