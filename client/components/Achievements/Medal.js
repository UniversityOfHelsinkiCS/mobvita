import React from 'react'
import { images } from 'Utilities/common'

const Medal = ({ medal }) => {
  const MEDAL_PIXEL_WIDTH = 30

  const medalImage = () => {
    switch (medal) {
      case 'bronze':
        return images.bronzeMedal
      case 'silver':
        return images.silverMedal
      case 'gold':
        return images.goldMedal
      case 'platinum':
        return images.platinumMedal
      case 'diamond':
        return images.diamondMedal
      default:
        return images.unlockedMedal
    }
  }

  return (
    <img
      src={medalImage()}
      alt="medal"
      width={`${MEDAL_PIXEL_WIDTH}px`}
      // Set height to mitigate some weird stretching behaviour on Safari
      height={`${1.26 * MEDAL_PIXEL_WIDTH}px`}
    />
  )
}

export default Medal
