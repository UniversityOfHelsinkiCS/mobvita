import React from 'react'
import { useDispatch } from 'react-redux'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { Swipeable } from 'react-swipeable'

const SwipeHandler = () => {
  const dispatch = useDispatch()

  return (
    <Swipeable trackMouse onSwipedRight={() => dispatch(sidebarSetOpen(true))}>
      <div style={{
        height: '100vh',
        width: '10px',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 100,
      }}
      />
    </Swipeable>
  )
}

export default SwipeHandler
