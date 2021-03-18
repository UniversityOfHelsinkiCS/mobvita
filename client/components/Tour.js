import React, { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import JoyRide, { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap'
import { updateToNonNewUser } from 'Utilities/redux/userReducer'
import { FormattedMessage } from 'react-intl'

const Tour = () => {
  const dispatch = useDispatch()
  const tourState = useSelector(({ tour }) => tour)
  const open = useSelector(({ sidebar }) => sidebar.open)
  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    // Auto start the tour if the user hasn't seen it before
    if (user.user.is_new_user) {
      setTimeout(() => {
        if (history.location.pathname.includes('home')) {
          dispatch(sidebarSetOpen(false))
          dispatch({ type: 'START' })
        }
      }, 500)
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
      dispatch({ type: 'STOP' })
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      if (index === 0) {
        dispatch(sidebarSetOpen(false))
        history.push('/home')

        dispatch({
          type: 'NEXT_OR_PREV',
          payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) },
        })
      } else if (index === 1) {
        dispatch(sidebarSetOpen(true))

        setTimeout(() => {
          dispatch({
            type: 'NEXT_OR_PREV',
            payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) },
          })
        }, 600)
      } else if (index === 4 && !open) {
        history.push('/library')

        dispatch({
          type: 'NEXT_OR_PREV',
          payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) },
        })
      } else {
        dispatch({
          type: 'NEXT_OR_PREV',
          payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) },
        })
      }
    }
  }

  const startTour = () => {
    dispatch(sidebarSetOpen(false))
    dispatch({ type: 'RESTART' })
  }

  return (
    <>
      {user.user.last_used_language !== null ? (
        <div className="tour-link">
          <Button type="button" onClick={startTour} className="tour-start">
            <FormattedMessage id="start-tour" />
          </Button>
        </div>
      ) : null}
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
    </>
  )
}

export default Tour
