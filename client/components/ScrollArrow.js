import React, { useState, useEffect, useCallback } from 'react'
import { Icon } from 'semantic-ui-react'
import useWindowDimensions from 'Utilities/windowDimensions'

const ScrollArrow = () => {
  const smallWindow = useWindowDimensions().width < 700
  const iconSize = smallWindow ? 'big' : 'huge'
  const [showScroll, setShowScroll] = useState(null)
  const checkScrollTop = useCallback(() => {
    const headerHeight = 400

    if (!showScroll && window.pageYOffset > headerHeight) {
      setShowScroll(true)
    } else if (showScroll && window.pageYOffset <= headerHeight) {
      setShowScroll(false)
    }
  }, [showScroll])

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop)
    return () => window.removeEventListener('scroll', checkScrollTop)
  }, [checkScrollTop])

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div
      className="scroll-to-top"
      style={{
        display: showScroll ? 'flex' : 'none',
        width: '85%',
      }}
    >
      <Icon name="arrow circle up" size={iconSize} onClick={scrollTop} />
    </div>
  )
}

export default ScrollArrow
