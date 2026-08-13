import React, { useState, useEffect } from 'react'
import { throttle } from 'lodash'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp'
import useWindowDimensions from 'Utilities/windowDimensions'

const ScrollArrow = () => {
  const smallWindow = useWindowDimensions().width < 700
  // semantic's size="big" was 2em and size="huge" 4em; keep the same responsive step.
  const iconFontSize = smallWindow ? 32 : 64
  const [showScroll, setShowScroll] = useState(false)

  useEffect(() => {
    const headerHeight = 400

    // Throttle the scroll handler so it runs at most every 200ms instead of on
    // every scroll event.
    const handleScroll = throttle(() => {
      setShowScroll(window.pageYOffset > headerHeight)
    }, 200)

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      handleScroll.cancel()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div
      className="scroll-to-top"
      style={{
        display: showScroll ? 'flex' : 'none',
        width: '50%',
      }}
    >
      <ArrowCircleUpIcon
        sx={{ fontSize: iconFontSize, cursor: 'pointer' }}
        onClick={scrollTop}
        data-cy="scroll-to-top-arrow"
      />
    </div>
  )
}

export default ScrollArrow
