import React from 'react'
import { FormattedHTMLMessage } from 'react-intl'
import { images } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'

const WellDoneFlashcardsHeader = () => {
  const bigScreen = useWindowDimensions().width > 700

  return (
    <div className='flex'>
      <div
        style={{
          fontSize: '1.4rem',
          marginBottom: '1em',
          fontWeight: 500,
        }}
      >
        <FormattedHTMLMessage id="well-done-click-next-card-to-play-another-set-of-cards-1" />
      </div>
      <img
        src={images.fireworks}
        alt="encouraging fireworks"
        className={bigScreen ? 'enc-picture' : 'enc-picture-mobile'}
      />
    </div>
  )
}

export default WellDoneFlashcardsHeader