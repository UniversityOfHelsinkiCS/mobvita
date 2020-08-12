import React from 'react'
import { images } from 'Utilities/common'

const Medal = ({ medal }) => {
  const MEDAL_WIDTH = '30px'

  const medalImage = () => {
    switch (medal) {
      case 'bronze':
        return images.bronzeMedal
      case 'silver':
        return images.silverMedal
      case 'gold':
        return images.goldMedal
      case 'emerald':
        return images.emeraldMedal
      case 'diamond':
        return images.diamondMedal
      default:
        return images.unlockedMedal
    }
  }

  return (
    <img src={medalImage()} width={MEDAL_WIDTH} />
  )
}

export default Medal
